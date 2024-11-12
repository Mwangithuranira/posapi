import { Context } from "hono";
import dotenv from 'dotenv';
import Stripe from "stripe";

import { getEntitiesController, getEntityByIdController, deleteEntityController } from "../baseController/base.Generic.Controller";
import { getPaymentsService, getPaymentByIdService, paymentExistsService, insertPaymentService, updatePaymentSesseionIdSevice, deletePaymentService, updatePaymentService, getPaymentByBookingIdService } from "./payements.service";
import { ClientDomain } from "../utils";

dotenv.config();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });


// get all payments
export const getPaymentsController = getEntitiesController(getPaymentsService);
// get payment by id
export const getPaymentByIdController = getEntityByIdController(getPaymentByIdService);


//create payment
export const createPaymentController = async (c: Context) => {
    try {
        const payment = await c.req.json();
        const createdPayment = await insertPaymentService(payment);
        if (createdPayment === undefined) return c.json({ message: "Payment not created" }, 400);
        return c.json({ message: "Payment created successfully" }, 201);

    } catch (error: any) {
        return c.json({ message: error.message }, 500);
    }
}

// update payment
export const updatePaymentController = async (c: Context) => {
    const payment_id = Number(c.req.param('payment_id'));
    const paymentExist = await getPaymentByIdService(payment_id);
    if (paymentExist === undefined) return c.json({ message: "Payment not found" }, 404);
    const payment = await c.req.json();
    try {
        const updatedPayment = await updatePaymentService(payment_id, payment);
        return c.json({ message: updatedPayment }, 200);

    } catch (error: any) {
        return c.json({ message: error.message }, 500);

    }
}

// delete payment
export const deletePaymentController = deleteEntityController(paymentExistsService, deletePaymentService);

// get payment by booking id
export const getPaymentByBookingIdController = async (c: Context) => {
    try {
        const booking_id = Number(c.req.param('booking_id'));
        const payment = await getPaymentByBookingIdService(booking_id);
        if (payment === undefined) return c.json({ message: "Payment not found" }, 404);
        return c.json(payment, 200);
        
    } catch (error:any) {
        return c.json({ message: error.message }, 500);
    }

}


// checkout session
export const createCheckoutSessionController = async (c: Context) => {
    let booking;
    try {
        booking = await c.req.json();
    } catch (error: any) {
        return c.json({ message: "Booking not found" }, 404);
    }

    try {
        if (!booking.booking_id) return c.json({ message: "Booking ID is required" }, 400);

        // ksh to USD conversion
        const conversionRate = 0.007;
        const totalAmountInUSD = booking.total_amount * conversionRate;

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: `Booking ID: ${booking.booking_id}`,
                },
                unit_amount: Math.round(totalAmountInUSD * 100), // convert to cents
            },
            quantity: 1,
        }];

        // create a checkout session
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${ClientDomain}/dashboard/payment-successful`,
            cancel_url: `${ClientDomain}/dashboard/payment-failed`,
        };

        // create a checkout session
        const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create(sessionParams);
        console.log(`Checkout Session URL: ${session.url}`);

        // save payment details to db
        const paymentDetails = {
            booking_id: booking.booking_id,
            amount: booking.total_amount.toString(),
            user_id: booking.user_id,
            payment_date: new Date(),
            payment_method: "Card",
            transaction_id: session.id,
        };

        const createPayment = await insertPaymentService(paymentDetails);
        return c.json({ sessionId: session.id, url: session.url, payment: createPayment }, 201);

    } catch (error: any) {
        return c.json({ message: error.message }, 500);
    }
};



// handle webhooks
export const handleStripeWebhook = async (c: Context) => {
    const sig = c.req.header('stripe-signature');
    const rawBody = await c.req.text();
    if (!sig) {
        console.log("No signature");
        return c.json({ message: "Invalid signature" }, 400);
    }
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_ENDPOINT_SECRET as string);
    } catch (error: any) {
        console.log("Error", error.message);
        return c.json({ message: `WebHook Error: ${error.message}` }, 400);
    }

    // handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            // update payment status
            try {
                const session_id = session.id;
                const updateStatus = await updatePaymentSesseionIdSevice(session_id);
                return c.json({ message: updateStatus }, 200);
            } catch (error: any) {
                return c.json({ message: `Database Error ${error.message}` }, 500);
            }

        // handle other events
        default:
            console.log(`Unhandled event type ${event.type}`);
            return c.json({ message: `Unhandled event type ${event.type}` }, 200);
    }
}

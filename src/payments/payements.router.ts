import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { paymentSchema } from '../validators';
import { getPaymentsController, getPaymentByIdController, deletePaymentController,updatePaymentController, createPaymentController, createCheckoutSessionController,getPaymentByBookingIdController } from './payements.controller';


export const paymentRouter = new Hono();

// get all payments
paymentRouter
    .get("/payments", getPaymentsController)
    .post("/payments",createPaymentController);

// get payment by id
paymentRouter
    .get("/payments/:id", getPaymentByIdController)
    .delete("/payments/:id", deletePaymentController)
    .put("/payments/:id", updatePaymentController);

// checkout session
paymentRouter.post("/checkout-session", createCheckoutSessionController);

// get payment by booking id
paymentRouter.get("paymentbybooking/:booking_id", getPaymentByBookingIdController);

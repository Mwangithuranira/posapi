import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { TIPayments, TSPayments, paymentsTable } from "../drizzle/schema";


// GET ALL PAYMENTS
export const getPaymentsService = async (): Promise<TSPayments[]> => {
  const payments = await db.query.paymentsTable.findMany();
  return payments;
}

// GET PAYMENT BY ID
export const getPaymentByIdService = async (id: number): Promise<TSPayments | undefined> => {
  const payment = await db.query.paymentsTable.findFirst({
    where: eq(paymentsTable.payment_id, id)
  });
  return payment || undefined;
}

// INSERT PAYMENT
export const insertPaymentService = async (payment: TIPayments) => {
  await db.insert(paymentsTable).values(payment)
  return "Payment inserted successfully";
}

// CHECK IF PAYMENT EXISTS
export const paymentExistsService = async (id: number): Promise<boolean> => {
  const payment = await getPaymentByIdService(id);
  return payment !== undefined;
}

// UPDATE PAYMENT STATUS
export const updatePaymentService = async (payment_id: number, payment: TIPayments) => {
  await db.update(paymentsTable).set(payment).where(eq(paymentsTable.payment_id, payment_id));
  return "Payment updated successfully";
}


// update payment using session id
export const updatePaymentSesseionIdSevice = async (session_id: string) => {
  await db.update(paymentsTable).set({ payment_status: "Paid" }).where(eq(paymentsTable.transaction_id, session_id));
  return "PaymentSessionId updated successfully";
}


// DELETE PAYMENT
export const deletePaymentService = async (id: number): Promise<string> => {
  await db.delete(paymentsTable).where(eq(paymentsTable.payment_id, id));
  return "payment deleted successfully";
}


// get payment by booking id
export const getPaymentByBookingIdService = async (booking_id: number)=>{
  const payment = await db.query.paymentsTable.findFirst({
    where: eq(paymentsTable.booking_id, booking_id)
  });
  return payment;
}

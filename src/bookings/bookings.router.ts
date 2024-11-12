import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';

import { bookingSchema } from '../validators';
import {
    getBookingsController, getBookingByIdController, deleteBookingController, createBookingController, updateBookingController,
    getUserBookingController, getAllUserBookingsController
} from './bookings.controller'

export const bookingRouter = new Hono()

// get all bookings
bookingRouter
    .get("bookings", getBookingsController)
    .post("bookings", zValidator('json', bookingSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), createBookingController)

// get booking by id
bookingRouter
    .get("bookings/:id", getBookingByIdController)
    .put("bookings/:id", zValidator('json', bookingSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), updateBookingController)
    .delete("bookings/:id", deleteBookingController)

// // get user booking
// bookingRouter.get("bookings/user/:id", getUserBookingController)
//get all user bookings
bookingRouter.get("bookings/user/all/:id", getAllUserBookingsController)
import {
    getBookingsService, getBookingByIdService, bookingExistsService, createBookingService, updateBookingService, deleteBookingService, 
    getUserBookingService, getAllUserBookingsService
} from "./bookings.service";
import { getEntitiesController, getEntityByIdController, deleteEntityController } from "../baseController/base.Generic.Controller";
import { createEntityControllerWithDates, updateEntityControllerWithDates } from '../baseController/date.GenericController';

// get all bookings
export const getBookingsController = getEntitiesController(getBookingsService);
// get booking by id
export const getBookingByIdController = getEntityByIdController(getBookingByIdService);
// create booking
export const createBookingController = createEntityControllerWithDates(createBookingService, ['booking_date', 'return_date']);
//  update booking
export const updateBookingController = updateEntityControllerWithDates(bookingExistsService, updateBookingService, ['booking_date', 'return_date']);
// delete booking
export const deleteBookingController = deleteEntityController(bookingExistsService, deleteBookingService);
// get user booking
export const getUserBookingController = getEntityByIdController(getUserBookingService);
// get all user bookings
export const getAllUserBookingsController = getEntityByIdController(getAllUserBookingsService);
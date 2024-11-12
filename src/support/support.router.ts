
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';
import { getSupportTicketsController, getSupportTicketByIdController, createSupportTicketController, updateSupportTicketController, deleteSupportTicketController,
    getAllUsersSupportTicketsController,
    getUserSupportTicketController
} from './support.controller';
import { ticketSchema } from './../validators';

export const supportRouter = new Hono()

// get all support tickets
supportRouter
    .get("support", getSupportTicketsController)
    .post("support", zValidator('json', ticketSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), createSupportTicketController)

// get support ticket by id
supportRouter
    .get("support/:id", getSupportTicketByIdController)
    .put("support/:id", zValidator('json', ticketSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), updateSupportTicketController)
    .delete("support/:id", deleteSupportTicketController)

// get user support ticket
supportRouter.get("supportticket/user/:id", getUserSupportTicketController)

// get all users support tickets
supportRouter.get("supporttickets/users/all", getAllUsersSupportTicketsController)
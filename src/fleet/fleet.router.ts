import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';
import { fleetSchema } from '../validators';
import { getFleetManagementController, getFleetManagementByIdController, createFleetManagementController, updateFleetManagementController, deleteFleetManagementController } from './fleet.controller'

export const fleetRouter = new Hono()

// get all fleet
fleetRouter
    .get("fleet", getFleetManagementController)
    .post("fleet", zValidator('json', fleetSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), createFleetManagementController)

// get fleet by id
fleetRouter
    .get("fleet/:id", getFleetManagementByIdController)
    .put("fleet/:id", zValidator('json', fleetSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), updateFleetManagementController)
    .delete("fleet/:id", deleteFleetManagementController)
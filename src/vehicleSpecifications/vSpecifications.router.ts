import { Hono } from 'hono'
import {
getVehicleSpecificationsController, getVehicleSpecificationsByIdController, createVehicleSpecificationsController,
updateVehicleSpecificationsController, deleteVehicleSpecificationsController
} from './vSpecifications.controller';
import { zValidator } from '@hono/zod-validator';
import { vehicleSpecSchema } from '../validators';
import { adminRoleAuth, userRoleAuth, bothRoleAuth} from './../middleware/bearAuth'

export const vehicleSpecificationsRouter = new Hono()

// get all vehicleSpecifications
vehicleSpecificationsRouter
    .get("vehicleSpecifications", getVehicleSpecificationsController)
    .post("vehicleSpecifications", zValidator('json', vehicleSpecSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), createVehicleSpecificationsController)

// get vehicleSpecifications by id
vehicleSpecificationsRouter
    .get("vehicleSpecifications/:id", getVehicleSpecificationsByIdController)
    .put("vehicleSpecifications/:id", zValidator('json', vehicleSpecSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), updateVehicleSpecificationsController)
    .delete("vehicleSpecifications/:id", deleteVehicleSpecificationsController)


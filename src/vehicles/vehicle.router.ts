import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';
import { vehicleSchema } from '../validators';
import {
    getVehiclesController, getVehicleByIdController, createVehicleController, updateVehicleController, deleteVehicleController,
    getVehiclesWithSpecsController, getVehicleWithSpecsByIdController
} from './vehicle.controller'

export const vehicleRouter = new Hono()

// get all vehicles
vehicleRouter
    .get("vehicles", getVehiclesController)
    .post("vehicles", zValidator('json', vehicleSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), createVehicleController)

// get vehicle by id
vehicleRouter
    .get("vehicles/:id", getVehicleByIdController)
    .put("vehicles/:id", zValidator('json', vehicleSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), updateVehicleController)
    .delete("vehicles/:id", deleteVehicleController)

// get vehicles with specifications
vehicleRouter.get("vehiclesSpecs", getVehiclesWithSpecsController)
// get vehicle with specification by id
vehicleRouter.get("vehicle-specs/:id", getVehicleWithSpecsByIdController)
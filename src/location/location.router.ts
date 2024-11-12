import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';
import { locationSchema } from '../validators';
import { getLocationsController, getLocationByIdController, createLocationController, updateLocationController, deleteLocationController } from './location.controller'

export const locationRouter = new Hono()

// get all locations
locationRouter
    .get("locations", getLocationsController)
    .post("locations", zValidator('json', locationSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), createLocationController)

// get location by id
locationRouter
    .get("locations/:id", getLocationByIdController)
    .put("locations/:id", zValidator('json', locationSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), updateLocationController)
    .delete("locations/:id", deleteLocationController)
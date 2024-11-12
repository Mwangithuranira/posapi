import { getLocationsService, getLocationByIdService, locationExistsService, createLocationService, updateLocationService, deleteLocationService } from "./location.service";

import {
    getEntitiesController, getEntityByIdController, createEntityController,
    updateEntityController, deleteEntityController
} from "../baseController/base.Generic.Controller";

// get all locations
export const getLocationsController = getEntitiesController(getLocationsService);
// get location by id
export const getLocationByIdController = getEntityByIdController(getLocationByIdService);
// create location
export const createLocationController = createEntityController(createLocationService);
//  update location
export const updateLocationController = updateEntityController(locationExistsService, updateLocationService);
// delete location
export const deleteLocationController = deleteEntityController(locationExistsService, deleteLocationService);
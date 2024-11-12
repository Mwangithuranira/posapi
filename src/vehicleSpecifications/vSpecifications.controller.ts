
import { getVehicleSpecificationsService, getVehicleSpecificationsByIdService, vehicleSpecificationsExistsService, createVehicleSpecificationsService, updateVehicleSpecificationsService, deleteVehicleSpecificationsService } from './vSpecifications.service';

import {
    getEntitiesController, getEntityByIdController, createEntityController, updateEntityController, deleteEntityController
} from "../baseController/base.Generic.Controller";

// get all vehicleSpecifications
export const getVehicleSpecificationsController = getEntitiesController(getVehicleSpecificationsService);
// get vehicleSpecifications by id
export const getVehicleSpecificationsByIdController = getEntityByIdController(getVehicleSpecificationsByIdService);
// create vehicleSpecifications
export const createVehicleSpecificationsController = createEntityController(createVehicleSpecificationsService);
//update vehicleSpecifications
export const updateVehicleSpecificationsController = updateEntityController(vehicleSpecificationsExistsService, updateVehicleSpecificationsService);
// delete vehicleSpecifications
export const deleteVehicleSpecificationsController = deleteEntityController(vehicleSpecificationsExistsService, deleteVehicleSpecificationsService);
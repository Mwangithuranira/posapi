import { getEntitiesController, getEntityByIdController, deleteEntityController } from "../baseController/base.Generic.Controller";
import { createEntityControllerWithDates, updateEntityControllerWithDates } from '../baseController/date.GenericController';
import {
    getFleetManagementService, getFleetManagementByIdService, fleetManagementExistsService, createFleetManagementService,
    updateFleetManagementService, deleteFleetManagementService
} from "./fleet.service";

// get all fleet management
export const getFleetManagementController = getEntitiesController(getFleetManagementService);
// get fleet management by id
export const getFleetManagementByIdController = getEntityByIdController(getFleetManagementByIdService);
// create fleet management
export const createFleetManagementController = createEntityControllerWithDates(createFleetManagementService, ['acquisition_date']);
//  update fleet management
export const updateFleetManagementController = updateEntityControllerWithDates(fleetManagementExistsService, updateFleetManagementService, ['acquisition_date']);
// delete fleet management
export const deleteFleetManagementController = deleteEntityController(fleetManagementExistsService, deleteFleetManagementService);
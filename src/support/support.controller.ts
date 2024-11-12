import {
    getEntitiesController, getEntityByIdController, createEntityController,
    updateEntityController, deleteEntityController
} from "../baseController/base.Generic.Controller";

import {
    getSupportTicketsService, getSupportTicketByIdService, supportTicketExistsService, createSupportTicketService,updateSupportTicketService, deleteSupportTicketService,
    getAllUsersSupportTicketsService,
    getUserSupportTicketService
} from "./support.service";

// get all support tickets
export const getSupportTicketsController = getEntitiesController(getSupportTicketsService);
// get support ticket by id
export const getSupportTicketByIdController = getEntityByIdController(getSupportTicketByIdService);
// create support ticket
export const createSupportTicketController = createEntityController(createSupportTicketService);
//  update support ticket
export const updateSupportTicketController = updateEntityController(supportTicketExistsService, updateSupportTicketService);
// delete support ticket
export const deleteSupportTicketController = deleteEntityController(supportTicketExistsService, deleteSupportTicketService);
// get user support ticket
export const getUserSupportTicketController = getEntityByIdController(getUserSupportTicketService);
// get all user support tickets
export const getAllUsersSupportTicketsController = getEntitiesController(getAllUsersSupportTicketsService);
import { eq } from "drizzle-orm";
import {db} from "../drizzle/db";

import { TIFleetManagement, TSFleetManagement, fleetManagementTable } from "../drizzle/schema";

// GET ALL FLEET MANAGEMENT
export const getFleetManagementService = async (): Promise<TSFleetManagement[]> => {
    const fleetManagement = await db.query.fleetManagementTable.findMany();
    return fleetManagement;
}

// GET FLEET MANAGEMENT BY ID
export const getFleetManagementByIdService = async (id: number): Promise<TSFleetManagement | undefined> => {
    const fleetManagement = await db.query.fleetManagementTable.findFirst({
        where: eq(fleetManagementTable.fleet_id, id)
    });
    return fleetManagement || undefined;
}

// CHECK IF FLEET MANAGEMENT EXISTS
export const fleetManagementExistsService = async (id: number): Promise<boolean> => {
    const fleetManagement = await getFleetManagementByIdService(id);
    return fleetManagement !== undefined; //returns true if fleet management exists
}

// CREATE FLEET MANAGEMENT
export const createFleetManagementService = async (fleetManagement: TIFleetManagement): Promise<string> => {
    await db.insert(fleetManagementTable).values(fleetManagement)
    return "fleet management created successfully";
}

//  UPDATE FLEET MANAGEMENT
export const updateFleetManagementService = async (id: number, fleetManagement: TIFleetManagement): Promise<string> => {
    await db.update(fleetManagementTable).set(fleetManagement).where(eq(fleetManagementTable.fleet_id, id));
    return "fleet management updated successfully";
}

// DELETE FLEET MANAGEMENT
export const deleteFleetManagementService = async (id: number): Promise<string> => {
    await db.delete(fleetManagementTable).where(eq(fleetManagementTable.fleet_id, id));
    return "fleet management deleted successfully";
}

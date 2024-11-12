import { eq } from "drizzle-orm";
import {db} from "../drizzle/db";

import { TIVehicleSpecifications, TSVehicleSpecifications, vehicleSpecificationsTable } from "../drizzle/schema";

// GET ALL VEHICLE SPECIFICATIONS
export const getVehicleSpecificationsService = async (): Promise<TSVehicleSpecifications[]> => {
    const vehicleSpecifications = await db.query.vehicleSpecificationsTable.findMany();
    return vehicleSpecifications;
};

// GET VEHICLE SPECIFICATIONS BY ID
export const getVehicleSpecificationsByIdService = async (id: number): Promise<TSVehicleSpecifications | undefined> => {
    const vehicleSpecifications = await db.query.vehicleSpecificationsTable.findFirst({
        where: eq(vehicleSpecificationsTable.vehicleSpec_id, id)
    });
    return vehicleSpecifications || undefined;
}

// CHECK IF VEHICLE SPECIFICATIONS EXISTS
export const vehicleSpecificationsExistsService = async (id: number): Promise<boolean> => {
    const vehicleSpecifications = await getVehicleSpecificationsByIdService(id);
    return vehicleSpecifications !== undefined;
}

// CREATE VEHICLE SPECIFICATIONS
export const createVehicleSpecificationsService = async (vehicleSpecifications: TIVehicleSpecifications): Promise<string> => {
    await db.insert(vehicleSpecificationsTable).values(vehicleSpecifications)
    return "vehicleSpecifications created successfully";
}

//  UPDATE VEHICLE SPECIFICATIONS
export const updateVehicleSpecificationsService = async (id: number, vehicleSpecifications: TIVehicleSpecifications): Promise<string> => {
    await db.update(vehicleSpecificationsTable).set(vehicleSpecifications).where(eq(vehicleSpecificationsTable.vehicleSpec_id, id));
    return "vehicleSpecifications updated successfully";
}

// DELETE VEHICLE SPECIFICATIONS
export const deleteVehicleSpecificationsService = async (id: number): Promise<string> => {
    await db.delete(vehicleSpecificationsTable).where(eq(vehicleSpecificationsTable.vehicleSpec_id, id));
    return "vehicleSpecifications deleted successfully";
}
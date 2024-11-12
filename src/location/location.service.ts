import { eq } from "drizzle-orm";
import {db} from "../drizzle/db";

import { TILocation, TSLocation, locationTable } from "../drizzle/schema";

// GET ALL LOCATIONS
export const getLocationsService = async (): Promise<TSLocation[]> => {
    const locations = await db.query.locationTable.findMany();
    return locations;
};

// GET LOCATION BY ID
export const getLocationByIdService = async (id: number): Promise<TSLocation | undefined> => {
    const location = await db.query.locationTable.findFirst({
        where: eq(locationTable.location_id, id)
    });
    return location || undefined;
}

// CHECK IF LOCATION EXISTS
export const locationExistsService = async (id: number): Promise<boolean> => {
    const location = await getLocationByIdService(id);
    return location !== undefined; //returns true if location exists
}

// CREATE LOCATION
export const createLocationService = async (location: TILocation): Promise<string> => {
    await db.insert(locationTable).values(location)
    return "location created successfully";
}

//  UPDATE LOCATION
export const updateLocationService = async (id: number, location: TILocation): Promise<string> => {
    await db.update(locationTable).set(location).where(eq(locationTable.location_id, id));
    return "location updated successfully";
}

// DELETE LOCATION
export const deleteLocationService = async (id: number): Promise<string> => {
    await db.delete(locationTable).where(eq(locationTable.location_id, id));
    return "location deleted successfully";
}
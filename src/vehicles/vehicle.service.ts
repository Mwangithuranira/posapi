import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";

import { TIVehicles, TSVehicles, vehiclesTable } from "../drizzle/schema";

// GET ALL VEHICLES
export const getVehiclesService = async (): Promise<TSVehicles[]> => {
    const vehicles = await db.query.vehiclesTable.findMany();
    return vehicles;
};

// GET VEHICLE BY ID
export const getVehicleByIdService = async (id: number): Promise<TSVehicles | undefined> => {
    const vehicle = await db.query.vehiclesTable.findFirst({
        where: eq(vehiclesTable.vehicle_id, id)
    });
    return vehicle || undefined;
}

// CHECK IF VEHICLE EXISTS
export const vehicleExistsService = async (id: number): Promise<boolean> => {
    const vehicle = await getVehicleByIdService(id);
    return vehicle !== undefined; //returns true if vehicle exists
}

// CREATE VEHICLE
export const createVehicleService = async (vehicle: TIVehicles): Promise<string> => {
    await db.insert(vehiclesTable).values(vehicle)
    return "vehicle created successfully";
}

//  UPDATE VEHICLE
export const updateVehicleService = async (id: number, vehicle: TIVehicles): Promise<string> => {
    await db.update(vehiclesTable).set(vehicle).where(eq(vehiclesTable.vehicle_id, id));
    return "vehicle updated successfully";
}

// DELETE VEHICLE
export const deleteVehicleService = async (id: number): Promise<string> => {
    await db.delete(vehiclesTable).where(eq(vehiclesTable.vehicle_id, id));
    return "vehicle deleted successfully";
}

type TGetVehicleSpecs = {
    vehicle_id: number;
    rental_rate: string;
    availability: boolean;
    vehicle_specifications: {
        manufacturer: string;
        model: string;
        year: number;
        fuel_type: string;
        engine_capacity: string;
        transmission: string;
        seating_capacity: number;
        color: string;
        features: string | null;
    };
}[]


// Get all vehicles with specifications
export const getVehiclesWithSpecsService = async () => {
    const vehicles = await db.query.vehiclesTable.findMany({
        columns: {
            vehicle_id: true,
            rental_rate: true,
            availability: true,
        },
        with: {
            vehicle_specifications: {
                columns: {
                    manufacturer: true,
                    model: true,
                    year: true,
                    fuel_type: true,
                    color: true,
                    engine_capacity: true,
                    transmission: true,
                    features: true,
                    seating_capacity: true,
                    image_url: true,
                }
            }
        }
    });
    return vehicles;
}

type TGetVehicleSpecsById = {
    vehicle_id: number;
    rental_rate: string;
    availability: boolean;
    vehicle_specifications: {
        manufacturer: string;
        model: string;
        year: number;
        fuel_type: string;
        engine_capacity: string;
        transmission: string;
        seating_capacity: number;
        color: string;
        features: string | null;
    };
} | undefined


// Get vehicle with specification by id
export const getVehicleWithSpecsByIdService = async (id: number) => {
    const vehicle = await db.query.vehiclesTable.findFirst({
        where: eq(vehiclesTable.vehicle_id, id),
        columns: {
            vehicle_id: true,
            rental_rate: true,
            availability: true,
            
        },
        with: {
            vehicle_specifications: {
                columns: {
                    manufacturer: true,
                    model: true,
                    year: true,
                    fuel_type: true,
                    color: true,
                    engine_capacity: true,
                    transmission: true,
                    features: true,
                    seating_capacity: true,
                    image_url: true,
                }
            },
        }
    });
    return vehicle;
}
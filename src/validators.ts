import { z } from "zod";

export const userSchema = z.object({
    full_name: z.string().min(3).max(255),
    email: z.string().email(),
    contact_phone: z.string(),
    address: z.string(),
    password: z.string().min(6).max(255),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});


export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(255),
});

export const vehicleSpecSchema = z.object({
    manufacturer: z.string().min(3).max(255),
    model: z.string().min(3).max(255),
    year: z.number().int(),
    fuel_type: z.string().min(3).max(255),
    engine_capacity: z.string().min(3).max(255),
    transmission: z.string().min(3).max(255),
    seating_capacity: z.number().int(),
    color: z.string().min(3).max(255),
    features: z.string().min(3).max(255),
});

export const vehicleSchema = z.object({
    vehicleSpec_id: z.number().int(),
    rental_rate: z.string().min(3).max(255),
    availability: z.boolean(),
});

export const locationSchema = z.object({
    name: z.string().min(3).max(255),
    address: z.string().min(10).max(255),
    contact_phone: z.string().min(10).max(15),
});

export const bookingSchema = z.object({
    user_id: z.number().int(),
    vehicle_id: z.number().int(),
    booking_date: z.string(),
    return_date: z.string(),
    total_amount: z.string().min(3).max(255),
    booking_status: z.string().min(3).max(255).optional(),
});

export const paymentSchema = z.object({
    booking_id: z.number().int()
});

export const ticketSchema = z.object({
    user_id: z.number().int(),
    subject: z.string().min(3).max(255),
    description: z.string().min(3).max(255),
    status: z.string().min(3).max(255).optional(),
});

export const fleetSchema = z.object({
    vehicle_id: z.number().int(),
    acquisition_date: z.string(),
    depreciation_rate: z.string().min(3).max(255),
    current_value: z.string().min(3).max(255),
    maintenance_cost: z.string().min(3).max(255),
    status: z.string().min(3).max(255),
});


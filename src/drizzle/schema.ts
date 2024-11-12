import { integer, pgTable, serial, varchar, text, timestamp, boolean, decimal, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["user", "admin", "both"]);

// 1. Users Table
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  full_name: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  contact_phone: varchar("contact_phone", { length: 255 }).notNull(),
  address: text("address").notNull(),
  role: roleEnum("role").default("user"),
  image_url: varchar("image_url", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  created_at: timestamp("created_at").default(sql`NOW()`).notNull(),
  updated_at: timestamp("updated_at").default(sql`NOW()`).notNull(),
});

// 2. Vehicle Specifications Table
export const vehicleSpecificationsTable = pgTable("vehicle_specifications", {
  vehicleSpec_id: serial("vehicleSpec_id").primaryKey(),
  manufacturer: varchar("manufacturer", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  year: integer("year").notNull(),
  fuel_type: varchar("fuel_type", { length: 255 }).notNull(),
  engine_capacity: varchar("engine_capacity", { length: 255 }).notNull(),
  transmission: varchar("transmission", { length: 255 }).notNull(),
  seating_capacity: integer("seating_capacity").notNull(),
  color: varchar("color", { length: 255 }).notNull(),
  features: text("features"),
  image_url: varchar("image_url", { length: 255 }),
});

// 3. Vehicles Table
export const vehiclesTable = pgTable("vehicles", {
  vehicle_id: serial("vehicle_id").primaryKey(),
  vehicleSpec_id: integer("vehicleSpec_id").notNull().references(() => vehicleSpecificationsTable.vehicleSpec_id, { onDelete: "cascade" }),
  rental_rate: decimal("rental_rate", { precision: 10, scale: 2 }).notNull(), // ie. 100.00
  availability: boolean("availability").notNull(),
  created_at: timestamp("created_at").default(sql`NOW()`).notNull(),
  updated_at: timestamp("updated_at").default(sql`NOW()`).notNull(),
});

// 4. Location and Branches Table
export const locationTable = pgTable("location", {
  location_id: serial("location_id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  contact_phone: varchar("contact_phone", { length: 255 }).notNull(),
  created_at: timestamp("created_at").default(sql`NOW()`).notNull(),
  updated_at: timestamp("updated_at").default(sql`NOW()`).notNull(),
});

// 5. Bookings Table
export const bookingsTable = pgTable("bookings", {
  booking_id: serial("booking_id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  vehicle_id: integer("vehicle_id").notNull().references(() => vehiclesTable.vehicle_id, { onDelete: "cascade" }),  // corrected reference
  location_id: integer("location_id").references(() => locationTable.location_id, { onDelete: "cascade" }),
  booking_date: timestamp("booking_date").notNull(),
  return_date: timestamp("return_date").notNull(),
  total_amount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  booking_status: varchar("booking_status", { length: 255 }).default("Confirmed").notNull(),
  created_at: timestamp("created_at").default(sql`NOW()`).notNull(),
  updated_at: timestamp("updated_at").default(sql`NOW()`).notNull(),
});

// 6. Payments Table
export const paymentsTable = pgTable("payments", {
  payment_id: serial("payment_id").primaryKey(),
  booking_id: integer("booking_id").notNull().references(() => bookingsTable.booking_id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  payment_status: varchar("payment_status", { length: 255 }).default("Pending").notNull(),
  payment_date: timestamp("payment_date").notNull(),
  payment_method: varchar("payment_method", { length: 255 }).notNull(),
  transaction_id: varchar("transaction_id", { length: 255 }).notNull(),
  created_at: timestamp("created_at").default(sql`NOW()`).notNull(),
  updated_at: timestamp("updated_at").default(sql`NOW()`).notNull(),
});


// 8. Customer Support Tickets Table
export const supportTicketsTable = pgTable("support_tickets", {
  ticket_id: serial("ticket_id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  // default the status to Open
  status: varchar("status", { length: 255 }).default("Open").notNull(),
  // status: varchar("status", { length: 255 }).notNull(),
  created_at: timestamp("created_at").default(sql`NOW()`).notNull(),
  updated_at: timestamp("updated_at").default(sql`NOW()`).notNull(),
});

// 9. Fleet Management Table
export const fleetManagementTable = pgTable("fleet_management", {
  fleet_id: serial("fleet_id").primaryKey(),
  vehicle_id: integer("vehicle_id").notNull().references(() => vehiclesTable.vehicle_id, { onDelete: "cascade" }),  // corrected reference
  acquisition_date: timestamp("acquisition_date").notNull(),
  depreciation_rate: decimal("depreciation_rate", { precision: 5, scale: 2 }).notNull(),
  current_value: decimal("current_value", { precision: 10, scale: 2 }).notNull(),
  maintenance_cost: decimal("maintenance_cost", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 255 }).notNull(),
  created_at: timestamp("created_at").default(sql`NOW()`).notNull(),
  updated_at: timestamp("updated_at").default(sql`NOW()`).notNull(),
});

//1. user relationships
export const userRelationships = relations(usersTable, ({ many }) => ({
  bookings: many(bookingsTable),
  payments: many(paymentsTable),
  support_tickets: many(supportTicketsTable),
}));

//vehicle relationships
export const vehicleRelationships = relations(vehiclesTable, ({ one, many }) => ({
  vehicle_specifications: one(vehicleSpecificationsTable, {
    fields: [vehiclesTable.vehicleSpec_id],
    references: [vehicleSpecificationsTable.vehicleSpec_id],
  }),
  bookings: many(bookingsTable),
  fleet_management: many(fleetManagementTable),
}));

//booking relationships
export const bookingRelationships = relations(bookingsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [bookingsTable.user_id],
    references: [usersTable.id],
  }),
  vehicle: one(vehiclesTable, {
    fields: [bookingsTable.vehicle_id],
    references: [vehiclesTable.vehicle_id],
  }),
  location: one(locationTable, {    //revisit
    fields: [bookingsTable.location_id],
    references: [locationTable.location_id],
  }),
  payments: many(paymentsTable),
}));

//payment relationships
export const paymentRelationships = relations(paymentsTable, ({ one }) => ({
  booking: one(bookingsTable, {
    fields: [paymentsTable.booking_id],
    references: [bookingsTable.booking_id],
  }),
}));


//support ticket relationships
export const supportTicketRelationships = relations(supportTicketsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [supportTicketsTable.user_id],
    references: [usersTable.id],
  }),
}));

//location relationships
export const locationRelationships = relations(locationTable, ({ many }) => ({
  bookings: many(bookingsTable),
}));

//fleet management relationships
export const fleetManagementRelationships = relations(fleetManagementTable, ({ one }) => ({
  vehicle: one(vehiclesTable, {
    fields: [fleetManagementTable.vehicle_id],
    references: [vehiclesTable.vehicle_id],
  }),
}));

// usersTable Types
export type TIUsers = typeof usersTable.$inferInsert;
export type TSUsers = typeof usersTable.$inferSelect;

// vehicleSpecificationsTable Types
export type TIVehicleSpecifications = typeof vehicleSpecificationsTable.$inferInsert;
export type TSVehicleSpecifications = typeof vehicleSpecificationsTable.$inferSelect;

// vehiclesTable Types
export type TIVehicles = typeof vehiclesTable.$inferInsert;
export type TSVehicles = typeof vehiclesTable.$inferSelect;

// locationTable Types
export type TILocation = typeof locationTable.$inferInsert;
export type TSLocation = typeof locationTable.$inferSelect;

// bookingsTable Types
export type TIBookings = typeof bookingsTable.$inferInsert;
export type TSBookings = typeof bookingsTable.$inferSelect;

// paymentsTable Types
export type TIPayments = typeof paymentsTable.$inferInsert;
export type TSPayments = typeof paymentsTable.$inferSelect;

// supportTicketsTable Types
export type TISupportTickets = typeof supportTicketsTable.$inferInsert;
export type TSSupportTickets = typeof supportTicketsTable.$inferSelect;

// fleetManagementTable Types
export type TIFleetManagement = typeof fleetManagementTable.$inferInsert;
export type TSFleetManagement = typeof fleetManagementTable.$inferSelect;





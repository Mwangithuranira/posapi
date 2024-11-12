import {db} from "./db";
import {
  usersTable,
  vehicleSpecificationsTable,
  vehiclesTable,
  locationTable,
  bookingsTable,
  paymentsTable,
  supportTicketsTable,
  fleetManagementTable,
} from "./schema";

// Seed data
const users = [
  {
    full_name: "Denis Kathuri",
    email: "denis@gmail.com",
    contact_phone: "0712345678",
    address: "1234, Embu",
    role: "user" as const,
    password: "password1",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    full_name: "Sarah Wanjiru",
    email: "sarah@gmail.com",
    contact_phone: "0712345679",
    address: "5678, Kiambu",
    role: "user" as const,
    password: "password2",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    full_name: "Brian Kemboi",
    email: "bkemboi590@gmail.com",
    contact_phone: "0768353360",
    address: "143 Kerugoya, Kirinyaga",
    role: "admin" as const,
    password: "adminpass",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const vehicleSpecifications = [
  {
    manufacturer: "Toyota",
    model: "Corolla",
    year: 2018,
    fuel_type: "Petrol",
    engine_capacity: "1800cc",
    transmission: "Automatic",
    seating_capacity: 5,
    color: "White",
    features: "Air Conditioning, Power Steering, Anti-lock Braking System",
  },
  {
    manufacturer: "Honda",
    model: "Civic",
    year: 2020,
    fuel_type: "Diesel",
    engine_capacity: "2000cc",
    transmission: "Manual",
    seating_capacity: 5,
    color: "Black",
    features: "Air Conditioning, Power Steering, Anti-lock Braking System, Sunroof",
  },
];

const vehicles = [
  {
    vehicleSpec_id: 1,
    rental_rate: "5000.00",
    availability: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    vehicleSpec_id: 2,
    rental_rate: "7000.00",
    availability: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const locations = [
  {
    name: "Nairobi Branch",
    address: "1234 Main St, Nairobi",
    contact_phone: "0712345678",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: "Mombasa Branch",
    address: "5678 Elm St, Mombasa",
    contact_phone: "0712345679",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const bookings = [
  {
    user_id: 1,
    vehicle_id: 1,
    location_id: 1,
    booking_date: new Date(),
    return_date: new Date(new Date().setDate(new Date().getDate() + 7)),
    total_amount: "35000.00",
    booking_status: "Confirmed",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    user_id: 2,
    vehicle_id: 2,
    location_id: 2,
    booking_date: new Date(),
    return_date: new Date(new Date().setDate(new Date().getDate() + 5)),
    total_amount: "35000.00",
    booking_status: "Pending",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const payments = [
  {
    booking_id: 1,
    amount: "35000.00",
    payment_status: "Completed",
    payment_date: new Date(),
    payment_method: "Credit Card",
    transaction_id: "TXN123456",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    booking_id: 2,
    amount: "35000.00",
    payment_status: "Pending",
    payment_date: new Date(),
    payment_method: "PayPal",
    transaction_id: "TXN123457",
    created_at: new Date(),
    updated_at: new Date(),
  },
];


const supportTickets = [
  {
    user_id: 1,
    subject: "Booking Issue",
    description: "I have an issue with my recent booking.",
    status: "Open",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    user_id: 2,
    subject: "Payment Issue",
    description: "My payment did not go through.",
    status: "Pending",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const fleetManagement = [
  {
    vehicle_id: 1,
    acquisition_date: new Date(),
    depreciation_rate: "10.00",
    current_value: "400000.00",
    maintenance_cost: "5000.00",
    status: "Active",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    vehicle_id: 2,
    acquisition_date: new Date(),
    depreciation_rate: "8.00",
    current_value: "450000.00",
    maintenance_cost: "6000.00",
    status: "Under Maintenance",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// Seed function
async function seed() {
  await db.insert(usersTable).values(users);
  await db.insert(vehicleSpecificationsTable).values(vehicleSpecifications);
  await db.insert(vehiclesTable).values(vehicles);
  await db.insert(locationTable).values(locations);
  await db.insert(bookingsTable).values(bookings);
  await db.insert(paymentsTable).values(payments);
  await db.insert(supportTicketsTable).values(supportTickets);
  await db.insert(fleetManagementTable).values(fleetManagement);
}

seed()
  .then(() => {
    console.log("Seeding completed");
  })
  .catch((error) => {
    console.error("Error seeding data", error);
  });

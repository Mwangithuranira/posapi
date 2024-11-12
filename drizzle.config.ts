import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: "postgresql", //used to determine the type of database
  dbCredentials: {
    url: process.env.DATABASE_URL as string, //database url
  },
  verbose: true, //log the migration process into the console
  strict: true, //stop the migration process if an error occurs
});

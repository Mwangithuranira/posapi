import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import 'dotenv/config';
import { logger } from 'hono/logger';
import { csrf } from 'hono/csrf';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { timeout } from 'hono/timeout';
import { HTTPException } from 'hono/http-exception';
import { cors } from 'hono/cors';
// all routers
import { userRouter } from './users/users.router';
import { vehicleSpecificationsRouter } from './vehicleSpecifications/vSpecifications.router';
import { vehicleRouter } from './vehicles/vehicle.router';
import { locationRouter } from './location/location.router';
import { bookingRouter } from './bookings/bookings.router';
import { paymentRouter } from './payments/payements.router';
import { supportRouter } from './support/support.router';
import { fleetRouter } from './fleet/fleet.router';

import { handleStripeWebhook } from './payments/payements.controller';

const app = new Hono();

// custom factory method
const customTimeException = () =>
  new HTTPException(408, {
    message: "Request timeout after waiting for more than 10 seconds",
  });

// inbuilt middlewares
app.use('*', cors());
app.use(logger());
app.use(csrf());
app.use(trimTrailingSlash());
app.use('time', timeout(10000, customTimeException));

// default test route
app.get('/', (c) => {
  return c.text('The server is running📢!');
});

// route here
app.route("/", userRouter);
app.route("/", vehicleSpecificationsRouter);
app.route("/", vehicleRouter);
app.route("/", locationRouter);
app.route("/", bookingRouter);
app.route("/", paymentRouter);
app.route("/", supportRouter);
app.route("/", fleetRouter);

// stripe webhook
app.post("/webhook", handleStripeWebhook);


app.get('time', async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return c.text("Request completed");
});

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT)
});

console.log(`Server is running on port ${process.env.PORT}`);

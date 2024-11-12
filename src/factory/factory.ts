import { Context } from 'hono';
// try catch wrapper
export const tryCatchWrapper = (handler: (c: Context) => Promise<Response>) => {
    return async (c: Context): Promise<Response> => {
        try {
            return await handler(c);
        } catch (error: any) {
            return serverError(c, error);
        }
    };
};

// handle server error
export const serverError = (c: Context, error: Error) => {
    return c.json({ error: `Internal Server Error: ${error.message}` }, 500);
};

// handle  not found
export const notFound = (c: Context) => {
    return c.json({ message: 'Not Found' }, 404);
};

// invalidparam
export const invalidParam = (c: Context) => {
    return c.json({ message: 'Invalid param' }, 400);
};


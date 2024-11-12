import { Context } from "hono";
import { invalidParam, notFound, tryCatchWrapper } from "../factory/factory";
import { convertDates } from "./base.Generic.Controller";
import { CreateEntityService, UpdateEntityService, ExistService } from "./base.Generic.Controller";

// Generic create controller
export const createEntityControllerWithDates = <T>(service: CreateEntityService<T>, dateFields: (keyof T)[]) =>
    tryCatchWrapper(async (c: Context): Promise<Response> => {
        const entity = await c.req.json();
        const convertedEntity = convertDates(entity, dateFields);
        const res = await service(convertedEntity, c);
        if (!res) return c.text('Not created', 400);
        return c.json({ message: res }, 201);
    });

// Generic update controller
export const updateEntityControllerWithDates = <T>(existsService: ExistService, service: UpdateEntityService<T>, dateFields: (keyof T)[]) =>
    tryCatchWrapper(async (c: Context): Promise<Response> => {
        const id = parseInt(c.req.param('id'));
        if (isNaN(id)) return invalidParam(c);

        const exists = await existsService(id, c);
        if (!exists) return notFound(c);

        const entity = await c.req.json();
        const convertedEntity = convertDates(entity, dateFields);
        const res = await service(id, convertedEntity, c);
        if (!res) return c.text('Not updated', 400);
        return c.json({ message: res }, 200);
    });

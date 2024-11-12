import { Context } from "hono";
import { invalidParam, notFound, tryCatchWrapper } from "../factory/factory";
import { TIBookings } from "../drizzle/schema";

// interface for service to get all entities
export interface GetEntitiesService<T> {
    (c: Context): Promise<T[]>;
}
// interface for service to get entity by id
export interface GetEntityByIdService<T> {
    (id: number, c: Context): Promise<T | undefined>;
}
// interface for service to create entity
export interface CreateEntityService<T> {
    (entity: T, c: Context): Promise<string>;
}
// interface for service to update entity
export interface UpdateEntityService<T> {
    (id: number, entity: T, c: Context): Promise<string>;
}
// interface for service to delete entity
export interface DeleteEntityService {
    (id: number, c: Context): Promise<string>;
}
// iterface for exist service
export interface ExistService {
    (id: number, c: Context): Promise<boolean>;
}


// Controller to get all entities
export const getEntitiesController = <T>(service: GetEntitiesService<T>) =>
    tryCatchWrapper(async (c: Context): Promise<Response> => {
        const entities = await service(c);
        if (!entities || entities.length === 0) {
            return notFound(c);
        }
        return c.json(entities, 200);
    });

// Controller to get entity by id
export const getEntityByIdController = <T>(service: GetEntityByIdService<T>) =>
    tryCatchWrapper(async (c: Context): Promise<Response> => {
        const id = parseInt(c.req.param('id'));
        if (isNaN(id)) return invalidParam(c);

        const entity = await service(id, c);
        if (!entity) {
            // return c.text('Not found', 404);
            return notFound(c);

        }
        return c.json(entity, 200);
    });

// Controller to create entity
export const createEntityController = <T>(service: CreateEntityService<T>) =>
    tryCatchWrapper(async (c: Context): Promise<Response> => {
        const entity = await c.req.json();
        const res = await service(entity, c);
        if (!res) return c.text('Not created', 400);
        return c.json({ message: res }, 201);
    });

// Controller to update entity
export const updateEntityController = <T>(existService: ExistService, service: UpdateEntityService<T>) =>
    tryCatchWrapper(async (c: Context): Promise<Response> => {
        const id = parseInt(c.req.param('id'));
        if (isNaN(id)) return invalidParam(c);

        const exists = await existService(id, c);
        if (!exists) return notFound(c);

        const entity = await c.req.json();
        const res = await service(id, entity, c);
        if (!res) return c.text('Not updated', 400);
        return c.json({ message: res }, 200);
    });

// Controller to delete entity
export const deleteEntityController = <T>(existService: ExistService, service: DeleteEntityService) =>
    tryCatchWrapper(async (c: Context): Promise<Response> => {
        const id = parseInt(c.req.param('id'));
        if (isNaN(id)) return invalidParam(c);

        const exists = await existService(id, c);
        if (!exists) return notFound(c);

        const res = await service(id, c);
        if (!res) return c.text('Not deleted', 400);
        return c.json({ message: res }, 200);
    });

    export function convertDates<T extends Record<string, any>>(entity: T, dateFields: (keyof T)[]): T { 
        const convertedEntity = { ...entity };
        dateFields.forEach(field => {
          if (convertedEntity[field]) {
            convertedEntity[field] = new Date(convertedEntity[field]) as any;
          }
        });
        return convertedEntity;
      }
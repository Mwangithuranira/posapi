import { Hono } from 'hono'
import { getUsersController, getUserByIdController, createUserController, updateUserController, deleteUserController, loginUserController } from './users.controller'
import { zValidator } from '@hono/zod-validator';
import { userSchema, loginSchema } from '../validators';
import { adminRoleAuth, userRoleAuth, bothRoleAuth } from './../middleware/bearAuth'

export const userRouter = new Hono()

// get all users
userRouter
    .get("users", getUsersController)
    .post("users", zValidator('json', userSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), createUserController)

// get user by id
userRouter
    .get("users/:id", getUserByIdController)
    .put("users/:id", updateUserController)
    .delete("users/:id", deleteUserController)


// loginController
userRouter.post("login", zValidator('json', loginSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), loginUserController)

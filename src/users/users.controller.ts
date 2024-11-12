import {
    getUsersService, getUserByIdService, createUserService, updateUserService,
    userExistsService, deleteUserService
} from "./users.service";
import {
    getEntitiesController, getEntityByIdController, createEntityController,
    updateEntityController, deleteEntityController
} from "../baseController/base.Generic.Controller";
import { sendRegistrationEmailTemplate } from "../helpers/helperFunction";
import { userLoginService } from "./users.service";
import { Context } from "hono";
import bycrpt from "bcrypt";
import { sign } from "hono/jwt";



// get all users
export const getUsersController = getEntitiesController(getUsersService);
// get user by id
export const getUserByIdController = getEntityByIdController(getUserByIdService);
// create user
// export const createUserController = createEntityController(createUserService);
export const createUserController = async (c: Context) => {
    try {
        const user = await c.req.json();
        const pass = await user.password;
        const hashedPassword = await bycrpt.hash(pass, 10);
        user.password = hashedPassword;
        const createUser = await createUserService(user);
        if (!createUser) {
            return c.json({ message: "User not created" }, 400);
        } else{
            // send email
            const email = user.email;
            const eventName: string= "You created an account on Rental Rides";
            const userName: string= user.full_name;

            const emailResponse = await sendRegistrationEmailTemplate(email, eventName, userName);
            console.log("emailResponse", emailResponse);
            return c.json({ message: createUser, emailResponse }, 201);
        }
    }
    catch (error: any) {
        return c.json({ error: `Internal Server Error: ${error?.message}` }, 500);
    }
}


//  update user
export const updateUserController = updateEntityController(userExistsService, updateUserService);
// delete user
export const deleteUserController = deleteEntityController(userExistsService, deleteUserService);

// login user
export const loginUserController = async (c: Context) => {
    try {
        const user = await c.req.json();

        // check if user exists
        const userExists = await userLoginService(user);
        if (userExists === null) return c.json({ message: "User not found" }, 404);
        const userMartch = await bycrpt.compare(user.password, userExists?.password as string);
        if (!userMartch) {
            return c.json({ error: "Invalid credentials" }, 400); //invalid password
        } else {
            // create payload
            const payload = {
                user_id: userExists?.id,
                name: userExists?.full_name,
                email: userExists?.email,
                role: userExists?.role,
                address: userExists?.address,
                image_url: userExists?.image_url,
                expire: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 3)
            }
            let secret = process.env.JWT_SECRET as string;
            const token = await sign(payload, secret);
            let userID = userExists?.id;
            let name = userExists?.full_name;
            let email = userExists?.email;
            let role = userExists?.role;
            let address = userExists?.address;
            let image_url = userExists?.image_url;
            return c.json({ token, user: { userID, name, email, role, address, image_url } }, 200);
        }

    } catch (error: any) {
        return c.json({ error: `Internal Server Error: ${error.message}` }, 500);

    }
}

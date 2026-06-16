import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import bcrypt from "bcryptjs";
import * as JWT from "jsonwebtoken";
import { env } from "../env";
import { createUserWithEmailAndPassword, CreateUserWithEmailAndPasswordType, generateUserTokenPayload, type GenerateUserTokenPayloadType } from "./model";

export default class UserService {

    private async getUserByEmail(email: string) {
        //pseudocode
        // query the database to find a user by email
        // return the user if found, otherwise return null or undefined
        const result = await db.select().from(usersTable).where(eq(usersTable.email, email));

        if (!result || result.length === 0) {
            return null;
        }
        return result[0];
    }
    private async generateUserToken(payload: GenerateUserTokenPayloadType) {
        const { id } = await generateUserTokenPayload.parseAsync(payload);
        const token = JWT.sign({ id }, env.JWT_SECRET);
        return { token };
    }
    public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordType) {
        //pseudocode
        // data receive and validate
        // checck in db if this email already visits
        // hash the password
        // create a new user in db
        // jwt token, we will set it in cookies
        // return
        const { fullName, email, password } = await createUserWithEmailAndPassword.parseAsync(payload);

        const existingUser = await this.getUserByEmail(email);

        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await db.insert(usersTable).values({ fullName, email, passwordHash }).returning({ id: usersTable.id });

        if (!result || result.length === 0 || !result[0]?.id) {
            throw new Error("Something went wrong while creating the user");
        }
        // token generate
        const { token } = await this.generateUserToken({ id: result[0].id });
        return {
            token,
            id: result[0].id
        };
    }
}
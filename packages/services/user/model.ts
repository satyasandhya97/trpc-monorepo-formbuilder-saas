import { z } from "zod";

export const createUserWithEmailAndPassword = z.object({
    fullName: z.string().describe("Full name of the user"),
    email: z.email().describe("Email address of the user"),
    password: z.string().describe("Password for the user account"),
})

export type CreateUserWithEmailAndPasswordType = z.infer<typeof createUserWithEmailAndPassword>;

export const generateUserTokenPayload = z.object({
    id: z.string().describe("Unique identifier for the user"),
});

export type GenerateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>;
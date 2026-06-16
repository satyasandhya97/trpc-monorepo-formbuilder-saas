import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),

    fullName: varchar('full_name', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).notNull().unique(),
    passwordHash: text('password_hash'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),

});
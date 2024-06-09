import {
  Prisma,
  User as UserType,
  Account as AccountType,
} from "@prisma/client";

// Define a type for User with its relations
const userWithRelations = Prisma.validator<Prisma.UserArgs>()({});

// Define a type for Account with its relations
const accountWithRelations = Prisma.validator<Prisma.AccountArgs>()({});

// user
export type User = Prisma.UserGetPayload<typeof userWithRelations>;

// account
export type Account = Prisma.AccountGetPayload<typeof accountWithRelations>;

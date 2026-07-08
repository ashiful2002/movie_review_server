import { UserRole } from "../../generated/prisma";

export interface IRequestUser {
  id: string;
  role: UserRole;
  email: string;
}

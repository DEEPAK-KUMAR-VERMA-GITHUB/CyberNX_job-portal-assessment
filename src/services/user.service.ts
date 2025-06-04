import { User } from "../types";
import api from "./api";

interface IResponse {
  success: boolean;
  message: string;
  user: User;
}

export const userService = {
  register: async (
    userData: Omit<User, "id" | "createdAt" | "updatedAt" | "status">
  ): Promise<IResponse> => {
    const response = await api.post("/users/register", userData);
    return response.data;
  },
};

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  total: number;
  users: User[];
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDTO extends Partial<CreateUserDTO> {
  id: string;
}

export interface UserFilters {
  search?: string;
  page?: number;
  limit?: number;
} 
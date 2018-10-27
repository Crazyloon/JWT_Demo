export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

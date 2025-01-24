export interface IRegister {
  email: string;
  password: string;
  full_name: string;
  role: 'ORGANIZER' | 'CUSTOMER';
  points?: number;
  profile_picture?: string;
}

export interface ILogin {
  id: string;
  email: string;
  password?: string;
  full_name: string;
  role: 'ORGANIZER' | 'CUSTOMER';
  points?: number;
  profile_picture?: string;
  created_at: any;
  updated_at: any;
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: 'ORGANIZER' | 'CUSTOMER';
  points?: number;
  profile_picture?: string | null;
  created_at: any;
  updated_at: any;
}

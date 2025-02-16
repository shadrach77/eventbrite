export interface IEvent {
  id: string;
  organizer_id: string;
  category_id: string;
  location_id: string;
  title: string;
  start_date: any;
  end_date: any;
  description: string;
  average_rating?: number;
  picture: string;
  created_at: any;
  updated_at: any;
  organizer: IUser;
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: 'ORGANIZER' | 'CUSTOMER';
  points?: number;
  profile_picture?: string;
}

export interface ITicketType {
  id: string;
  event_id: string;
  title: string;
  price: number;
  available_seats: number;
  start_date: any;
  end_date: any;
  created_at: any;
  updated_at: any;
}

export interface IPromotionType {
  id: string;
  event_id: string;
  code: string;
  amount: number;
  start_date: any;
  end_date: any;
  created_at: any;
  updated_at: any;
}

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
  location: ILocation;
  category: ICategory;
  ticket_types: ITicketType[];
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

export interface ILocation {
  id: string;
  label: string;
}

export interface ICategory {
  id: string;
  label: string;
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

export interface ITransaction {
  id: string;
  event_id: string;
  customer_id: string;
  status: string;
  points_used?: number;
  grand_total: number;
  promotion_id?: string;
  payment_proof?: string;
  payment_proof_deadline: any;
  acceptance_deadline: any;
  created_at: any;
  updated_at: any;
}

export interface ITransactionAndTransactionTicket {
  id: string;
  event_id: string;
  customer_id: string;
  status: string;
  points_used?: number;
  grand_total: number;
  promotion_id?: string;
  payment_proof?: string;
  payment_proof_deadline: any;
  acceptance_deadline: any;
  created_at: any;
  updated_at: any;
  TransactionTickets: ITransactionTicket[];
}

export interface ITransactionTicket {
  id: string;
  transaction_id: string;
  ticket_id: string;
  quantity: number;
}

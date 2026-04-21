export interface Item {
  id: string;
  description: string;
  quantity: number;
  price: number;
  tax: number;
}

export interface BusinessDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  logo?: string;
}

export interface ClientDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  business: BusinessDetails;
  client: ClientDetails;
  items: Item[];
  notes: string;
  terms: string;
  currency: string;
  status: 'draft' | 'saved';
}

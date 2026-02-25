export interface User {
  id: string;
  name: string;
  balance: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  amount: number;
  note: string;
  timestamp: string;
}

export interface StatusHistoryEntry {
  from_status?: string;
  to_status: string;
  timestamp: string;
  changed_by: string;
  changed_by_name?: string;
  message?: string;
  remarks?: string;
  admin_remarks?: string;
  internal_notes?: string;
}

export interface BankAccount {
  account_name: string;
  account_number: string;
  bank_name: string;
  routing_number: string;
  transfer_amount: string;
}

export interface User {
  id: string;
  customer_id: string;
  email: string;
  first_name: string;
  last_name?: string;
}

export interface TransferRequest {
  id: string;
  transfer_id: string;
  user_id: string;
  type_: string;
  transfer_type: string;
  amount: string;
  currency: string;
  fee: string;
  fee_amount: string;
  net_amount: string;
  amount_after_fee: string;
  status: string;
  status_message?: string;
  priority: string;
  crypto_tx_hash?: string;
  deposit_wallet_address?: string;
  admin_wallet_address?: string;
  admin_wallet_id?: string;
  network?: string;
  confirmation_count: number;
  required_confirmations: number;
  bank_account_info?: any;
  bank_accounts?: BankAccount[];
  processed_by?: string;
  processing_notes?: string;
  notes?: string;
  admin_remarks?: string;
  internal_notes?: string;
  status_history?: StatusHistoryEntry[];
  user?: User;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  expires_at?: string;
}

export interface TransferStats {
  total_count: number;
  pending_count: number;
  processing_count: number;
  completed_count: number;
  failed_count: number;
  total_volume: number;
  total_fees: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  transfers: T[];
  total: number;
  page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface Admin {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  permissions: Record<string, boolean>;
  is_active: boolean;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
}
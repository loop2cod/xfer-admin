import axios, { AxiosInstance } from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  permissions: Record<string, boolean>;
  is_active: boolean;
  is_super_admin: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    pending_kyc: number;
  };
  transfers: {
    total: number;
    pending: number;
    completed: number;
    total_volume: number;
  };
  wallets: {
    total: number;
    total_balance: number;
  };
  recent_activity: {
    transfers_24h: number;
    new_users_24h: number;
  };
}

export interface AdminCreateRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  permissions?: Record<string, boolean>;
}

export interface AdminUpdateRequest {
  first_name?: string;
  last_name?: string;
  role?: string;
  permissions?: Record<string, boolean>;
  is_active?: boolean;
}

export interface RolePermissions {
  role: string;
  permissions: string[];
  description: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  kyc_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  last_login?: string;
  country?: string;
  date_of_birth?: string;
  address?: string;
  verification_documents?: any[];
  customer_id?: string;
  total_transfers?: number;
  total_volume?: number;
  pending_transfers?: number;
  completed_transfers?: number;
  failed_transfers?: number;
}

export interface CustomerDetails extends User {
  name: string;
  status: "active" | "suspended" | "pending";
  joinDate: string;
  lastActivity: string;
  verificationStatus: "verified" | "pending" | "rejected";
  riskLevel: "low" | "medium" | "high";
  avatar?: string;
  totalRequests: number;
  totalVolume: number;
  completedRequests: number;
  pendingRequests: number;
  failedRequests: number;
  averageRequestAmount: number;
  lastRequestDate?: string;
  notes: string[];
  documents: {
    id: string;
    type: string;
    status: "approved" | "pending" | "rejected";
    uploadDate: string;
  }[];
}

export interface UserNote {
  id: string;
  note: string;
  created_by: string;
  created_by_name: string;
  created_at: string;
}

export interface UserFilters {
  search?: string;
  kyc_status?: string;
  is_active?: boolean;
  skip?: number;
  limit?: number;
}

export interface PaginatedUsersResponse {
  users: User[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: any;
  description?: string;
  category: string;
  is_public: boolean;
  updated_at: string;
  updated_by: string;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  admin_name: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  // New enhanced fields
  type: string;
  activity_description: string;
  created_by: string;
  reference_link?: string;
}

export interface FinancialReport {
  period: string;
  total_volume: number;
  total_fees: number;
  total_transfers: number;
  completed_transfers: number;
  failed_transfers: number;
  average_transfer_amount: number;
  revenue_by_day: Array<{
    date: string;
    volume: number;
    fees: number;
    transfers: number;
  }>;
}

export interface AdminWallet {
  id: string;
  name: string;
  address: string;
  currency: string;
  network: string;
  fee_percentage: number;
  is_active: boolean;
  is_primary: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminWalletCreateRequest {
  name: string;
  address: string;
  currency: string;
  network: string;
  fee_percentage: number;
  is_active?: boolean;
  notes?: string;
}

export interface AdminWalletUpdateRequest {
  name?: string;
  address?: string;
  currency?: string;
  network?: string;
  fee_percentage?: number;
  is_active?: boolean;
  notes?: string;
}

export interface AdminBankAccount {
  id: string;
  name: string;
  bank_name: string;
  account_number: string;
  routing_number?: string;
  account_type: string;
  fee_percentage: number;
  is_active: boolean;
  is_primary: boolean;
  account_holder_name?: string;
  swift_code?: string;
  iban?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminBankAccountCreateRequest {
  name: string;
  bank_name: string;
  account_number: string;
  routing_number?: string;
  account_type: string;
  fee_percentage: number;
  is_active?: boolean;
  account_holder_name?: string;
  swift_code?: string;
  iban?: string;
  notes?: string;
}

export interface AdminBankAccountUpdateRequest {
  name?: string;
  bank_name?: string;
  account_number?: string;
  routing_number?: string;
  account_type?: string;
  fee_percentage?: number;
  is_active?: boolean;
  account_holder_name?: string;
  swift_code?: string;
  iban?: string;
  notes?: string;
}

export interface TransferRequest {
  id: string;
  transfer_id: string;
  user_id: string;
  transfer_type: string;
  type_: string;
  amount: number;
  fee: number;
  fee_amount: number;
  net_amount: number;
  amount_after_fee: number;
  currency: string;
  status: string;
  status_message?: string;
  priority?: string;
  crypto_tx_hash?: string;
  deposit_wallet_address?: string;
  admin_wallet_address?: string;
  admin_wallet_id?: string;
  network?: string;
  confirmation_count?: number;
  required_confirmations?: number;
  bank_account_info?: any;
  bank_accounts?: any[];
  processed_by?: string;
  processing_notes?: string;
  notes?: string;
  admin_remarks?: string;
  internal_notes?: string;
  status_history?: Array<{
    from_status: string;
    to_status: string;
    changed_by: string;
    changed_by_name: string;
    timestamp: string;
    remarks?: string;
    internal_notes?: string;
  }>;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  expires_at?: string;
  user?: {
    id: string;
    customer_id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface TransferUpdateRequest {
  status?: string;
  status_message?: string;
  crypto_tx_hash?: string;
  confirmation_count?: number;
  processing_notes?: string;
  admin_remarks?: string;
  internal_notes?: string;
}

export interface TransferStats {
  total_requests: number;
  pending_requests: number;
  completed_requests: number;
  failed_requests: number;
  total_volume: number;
  total_fees: number;
}

export interface PaginationMeta {
  total: number;
  skip: number;
  limit: number;
  total_pages: number;
  current_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface TransferFilters {
  search?: string;
  status_filter?: string;
  type_filter?: string;
  skip?: number;
  limit?: number;
}

export interface PaginatedTransfersResponse {
  transfers: TransferRequest[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// Token management utilities
const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_access_token');
  }
  return null;
};

const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_refresh_token');
  }
  return null;
};

const setTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_access_token', accessToken);
    localStorage.setItem('admin_refresh_token', refreshToken);
  }
};

const clearAuth = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_profile');
  }
};

// Create axios client with interceptors
const createApiClient = (): AxiosInstance => {
  const baseURL = 'https://server.letsnd.com/api/v1';

  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  client.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            const response = await refreshTokenRequest(refreshToken);
            if (response.success && response.data) {
              setTokens(response.data.access_token, response.data.refresh_token);
              originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
              return client(originalRequest);
            }
          }
        } catch (refreshError) {
          clearAuth();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Global client instance
const client = createApiClient();

// Helper function for refresh token request (used in interceptor)
const refreshTokenRequest = async (refreshToken: string): Promise<ApiResponse<AdminTokenResponse>> => {
  try {
    const response = await axios.post<ApiResponse<AdminTokenResponse>>('/auth/admin/refresh', {
      refresh_token: refreshToken
    }, {
      baseURL: 'https://server.letsnd.com/api/v1',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Token refresh failed'
    };
  }
};

// API Methods
export const login = async (credentials: AdminLoginRequest): Promise<ApiResponse<AdminTokenResponse>> => {
  try {
    const response = await client.post<ApiResponse<AdminTokenResponse>>('/auth/admin/login', credentials);

    if (response.data.success && response.data.data) {
      setTokens(response.data.data.access_token, response.data.data.refresh_token);
    }

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || error.response?.data?.message || error.message || 'Login failed'
    };
  }
};

export const logout = async (): Promise<ApiResponse> => {
  try {
    const response = await client.post<ApiResponse>('/auth/admin/logout');
    clearAuth();
    return response.data;
  } catch (error: any) {
    clearAuth();
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Logout failed'
    };
  }
};

export const refreshToken = async (refreshToken: string): Promise<ApiResponse<AdminTokenResponse>> => {
  try {
    const response = await client.post<ApiResponse<AdminTokenResponse>>('/auth/admin/refresh', {
      refresh_token: refreshToken
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Token refresh failed'
    };
  }
};

export const getProfile = async (): Promise<ApiResponse<AdminProfile>> => {
  try {
    const response = await client.get<ApiResponse<AdminProfile>>('/admin/me');

    if (response.data.success && response.data.data && typeof window !== 'undefined') {
      localStorage.setItem('admin_profile', JSON.stringify(response.data.data));
    }

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get profile'
    };
  }
};

export const updateProfile = async (data: AdminUpdateRequest): Promise<ApiResponse<AdminProfile>> => {
  try {
    const response = await client.put<ApiResponse<AdminProfile>>('/admin/me', data);

    if (response.data.success && response.data.data && typeof window !== 'undefined') {
      localStorage.setItem('admin_profile', JSON.stringify(response.data.data));
    }

    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to update profile'
    };
  }
};

export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  try {
    const response = await client.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get dashboard stats'
    };
  }
};

export const getAllAdmins = async (params?: {
  skip?: number;
  limit?: number;
  role?: string;
  is_active?: boolean;
}): Promise<ApiResponse<AdminProfile[]>> => {
  try {
    const response = await client.get<ApiResponse<AdminProfile[]>>('/admin/all', { params });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get admins'
    };
  }
};

export const createAdmin = async (data: AdminCreateRequest): Promise<ApiResponse<AdminProfile>> => {
  try {
    const response = await client.post<ApiResponse<AdminProfile>>('/admin/', data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create admin'
    };
  }
};

export const updateAdmin = async (id: string, data: AdminUpdateRequest): Promise<ApiResponse<AdminProfile>> => {
  try {
    const response = await client.put<ApiResponse<AdminProfile>>(`/admin/profile/${id}`, data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to update admin'
    };
  }
};

export const updateAdminPermissions = async (id: string, permissions: Record<string, boolean>): Promise<ApiResponse<AdminProfile>> => {
  try {
    const response = await client.put<ApiResponse<AdminProfile>>(`/admin/profile/${id}/permissions`, { permissions });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to update permissions'
    };
  }
};

export const toggleAdminStatus = async (id: string): Promise<ApiResponse<AdminProfile>> => {
  try {
    const response = await client.post<ApiResponse<AdminProfile>>(`/admin/profile/${id}/toggle-status`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to toggle admin status'
    };
  }
};

export const deleteAdmin = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await client.delete<ApiResponse>(`/admin/profile/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to delete admin'
    };
  }
};

export const getRolePermissions = async (): Promise<ApiResponse<RolePermissions[]>> => {
  try {
    const response = await client.get<ApiResponse<RolePermissions[]>>('/admin/roles/permissions');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get role permissions'
    };
  }
};

export const generateApiKey = async (expiresDays: number = 90): Promise<ApiResponse<{ api_key: string; expires_at: string }>> => {
  try {
    const response = await client.post<ApiResponse<{ api_key: string; expires_at: string }>>(`/admin/api-key`, {
      expires_days: expiresDays
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to generate API key'
    };
  }
};

export const revokeApiKey = async (): Promise<ApiResponse> => {
  try {
    const response = await client.delete<ApiResponse>('/admin/api-key');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to revoke API key'
    };
  }
};

// Admin Wallet Management
export const getAdminWallets = async (): Promise<ApiResponse<AdminWallet[]>> => {
  try {
    const response = await client.get<ApiResponse<AdminWallet[]>>('/admin-wallets/');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get admin wallets'
    };
  }
};

export const createAdminWallet = async (data: AdminWalletCreateRequest): Promise<ApiResponse<AdminWallet>> => {
  try {
    const response = await client.post<ApiResponse<AdminWallet>>('/admin-wallets/', data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create admin wallet'
    };
  }
};

export const updateAdminWallet = async (id: string, data: AdminWalletUpdateRequest): Promise<ApiResponse<AdminWallet>> => {
  try {
    const response = await client.put<ApiResponse<AdminWallet>>(`/admin-wallets/${id}`, data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to update admin wallet'
    };
  }
};

export const deleteAdminWallet = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await client.delete<ApiResponse>(`/admin-wallets/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to delete admin wallet'
    };
  }
};

export const setPrimaryAdminWallet = async (id: string): Promise<ApiResponse<AdminWallet>> => {
  try {
    const response = await client.post<ApiResponse<AdminWallet>>('/admin-wallets/set-primary/', { wallet_id: id });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to set primary admin wallet'
    };
  }
};

export const toggleAdminWalletStatus = async (id: string): Promise<ApiResponse<AdminWallet>> => {
  try {
    const response = await client.post<ApiResponse<AdminWallet>>(`/admin-wallets/${id}/toggle-status`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to toggle admin wallet status'
    };
  }
};

// Admin Bank Account Management
export const getAdminBankAccounts = async (): Promise<ApiResponse<AdminBankAccount[]>> => {
  try {
    const response = await client.get<ApiResponse<AdminBankAccount[]>>('/admin-bank-accounts/');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get admin bank accounts'
    };
  }
};

export const createAdminBankAccount = async (data: AdminBankAccountCreateRequest): Promise<ApiResponse<AdminBankAccount>> => {
  try {
    const response = await client.post<ApiResponse<AdminBankAccount>>('/admin-bank-accounts/', data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create admin bank account'
    };
  }
};

export const updateAdminBankAccount = async (id: string, data: AdminBankAccountUpdateRequest): Promise<ApiResponse<AdminBankAccount>> => {
  try {
    const response = await client.put<ApiResponse<AdminBankAccount>>(`/admin-bank-accounts/${id}`, data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to update admin bank account'
    };
  }
};

export const deleteAdminBankAccount = async (id: string): Promise<ApiResponse> => {
  try {
    const response = await client.delete<ApiResponse>(`/admin-bank-accounts/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to delete admin bank account'
    };
  }
};

export const setPrimaryAdminBankAccount = async (id: string): Promise<ApiResponse<AdminBankAccount>> => {
  try {
    const response = await client.post<ApiResponse<AdminBankAccount>>('/admin-bank-accounts/set-primary/', { account_id: id });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to set primary admin bank account'
    };
  }
};

export const toggleAdminBankAccountStatus = async (id: string): Promise<ApiResponse<AdminBankAccount>> => {
  try {
    const response = await client.post<ApiResponse<AdminBankAccount>>(`/admin-bank-accounts/${id}/toggle-status`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to toggle admin bank account status'
    };
  }
};

// Transfer Management
export const getPendingCount = async (): Promise<ApiResponse<{ pending_count: number; timestamp: string }>> => {
  try {
    const response = await client.get<ApiResponse<{ pending_count: number; timestamp: string }>>('/transfers/admin/pending-count');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching pending count:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to fetch pending count'
    };
  }
};

export const getAllTransfers = async (params?: {
  skip?: number;
  limit?: number;
  status?: string;
  status_filter?: string;
  type_filter?: string;
  transfer_type?: string;
  search?: string;
}): Promise<ApiResponse<PaginatedTransfersResponse>> => {
  try {
    const cleanParams = {
      skip: params?.skip || 0,
      limit: params?.limit || 50,
      ...(params?.status && { status_filter: params.status }),
      ...(params?.status_filter && { status_filter: params.status_filter }),
      ...(params?.type_filter && { type_filter: params.type_filter }),
      ...(params?.transfer_type && { type_filter: params.transfer_type }),
      ...(params?.search && { search: params.search }),
    };

    const response = await client.get<ApiResponse<PaginatedTransfersResponse>>('/transfers/admin/all', {
      params: cleanParams
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get transfers'
    };
  }
};

export const getTransferById = async (id: string): Promise<ApiResponse<TransferRequest>> => {
  try {
    const response = await client.get<ApiResponse<TransferRequest>>(`/transfers/admin/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get transfer'
    };
  }
};

export const updateTransfer = async (id: string, data: TransferUpdateRequest): Promise<ApiResponse<TransferRequest>> => {
  try {
    const response = await client.put<ApiResponse<TransferRequest>>(`/transfers/admin/${id}`, data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to update transfer'
    };
  }
};

export const bulkUpdateTransferStatus = async (
  transfer_ids: string[],
  status: string,
  status_message?: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await client.post<ApiResponse<any>>('/transfers/bulk-update-status', {
      transfer_ids,
      status,
      status_message
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to bulk update transfers'
    };
  }
};

export const getTransferStats = async (): Promise<ApiResponse<TransferStats>> => {
  try {
    const response = await client.get<ApiResponse<TransferStats>>('/transfers/admin/stats');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get transfer stats'
    };
  }
};

// User Management
export const getAllUsers = async (params?: UserFilters): Promise<ApiResponse<PaginatedUsersResponse>> => {
  try {
    const cleanParams = {
      skip: params?.skip || 0,
      limit: params?.limit || 50,
      ...(params?.search && { search: params.search }),
      ...(params?.kyc_status && { kyc_status: params.kyc_status }),
      ...(params?.is_active !== undefined && { is_active: params.is_active }),
    };

    const response = await client.get<ApiResponse<PaginatedUsersResponse>>('/users/admin/all', {
      params: cleanParams
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get users'
    };
  }
};

export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  try {
    const response = await client.get<ApiResponse<User>>(`/users/admin/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get user'
    };
  }
};

export const updateUserStatus = async (id: string, is_active: boolean): Promise<ApiResponse<User>> => {
  try {
    const response = await client.put<ApiResponse<User>>(`/users/admin/${id}/status`, { is_active });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to update user status'
    };
  }
};

export const updateUserKyc = async (id: string, kyc_status: string, notes?: string): Promise<ApiResponse<User>> => {
  try {
    const response = await client.put<ApiResponse<User>>(`/users/admin/${id}/kyc`, {
      kyc_status,
      notes
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to update KYC status'
    };
  }
};

export const getUserTransfers = async (userId: string, params?: {
  skip?: number;
  limit?: number;
  type_filter?: string;
  status_filter?: string;
}): Promise<ApiResponse<PaginatedTransfersResponse>> => {
  try {
    const response = await client.get<ApiResponse<PaginatedTransfersResponse>>(`/users/admin/${userId}/transfers`, { params });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get user transfers'
    };
  }
};

export const addUserNote = async (userId: string, note: string): Promise<ApiResponse<any>> => {
  try {
    const response = await client.post<ApiResponse<any>>(`/users/admin/${userId}/notes`, { note });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to add user note'
    };
  }
};

export const getUserNotes = async (userId: string): Promise<ApiResponse<any[]>> => {
  try {
    const response = await client.get<ApiResponse<any[]>>(`/users/admin/${userId}/notes`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get user notes'
    };
  }
};

// Audit Logs
export const getAuditLogs = async (params?: {
  skip?: number;
  limit?: number;
  admin_id?: string;
  action?: string;
  resource_type?: string;
  start_date?: string;
  end_date?: string;
}): Promise<ApiResponse<{ logs: AuditLog[]; total: number }>> => {
  try {
    const response = await client.get<ApiResponse<{ logs: AuditLog[]; total: number }>>('/admin-audit-logs/', {
      params
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get audit logs'
    };
  }
};

export const getAuditStats = async (): Promise<ApiResponse<{
  total_logs: number;
  unique_admins: number;
  actions_today: number;
  most_common_action: string;
}>> => {
  try {
    const response = await client.get<ApiResponse<{
      total_logs: number;
      unique_admins: number;
      actions_today: number;
      most_common_action: string;
    }>>('/admin-audit-logs/stats');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get audit stats'
    };
  }
};

// Financial Reports
export const getFinancialReport = async (params: {
  start_date: string;
  end_date: string;
  group_by?: 'day' | 'week' | 'month';
}): Promise<ApiResponse<FinancialReport>> => {
  try {
    const response = await client.get<ApiResponse<FinancialReport>>('/admin/reports/financial', {
      params
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get financial report'
    };
  }
};

export const exportFinancialReport = async (params: {
  start_date: string;
  end_date: string;
  format: 'csv' | 'xlsx';
}): Promise<ApiResponse<{ download_url: string }>> => {
  try {
    const response = await client.post<ApiResponse<{ download_url: string }>>('/admin/reports/financial/export', params);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to export financial report'
    };
  }
};

// System Settings
export const getSystemSettings = async (category?: string): Promise<ApiResponse<SystemSettings[]>> => {
  try {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    const response = await client.get<ApiResponse<SystemSettings[]>>(`/admin/settings${params}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get system settings'
    };
  }
};

export const getSystemSetting = async (key: string): Promise<ApiResponse<SystemSettings>> => {
  try {
    const response = await client.get<ApiResponse<SystemSettings>>(`/admin/settings/${encodeURIComponent(key)}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get system setting'
    };
  }
};

export const createSystemSetting = async (data: {
  key: string;
  value: any;
  description?: string;
  category: string;
  is_public?: boolean;
}): Promise<ApiResponse<SystemSettings>> => {
  try {
    const response = await client.post<ApiResponse<SystemSettings>>('/admin/settings', data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to create system setting'
    };
  }
};

export const updateSystemSetting = async (key: string, data: {
  value?: any;
  description?: string;
  category?: string;
  is_public?: boolean;
}): Promise<ApiResponse<SystemSettings>> => {
  try {
    const response = await client.put<ApiResponse<SystemSettings>>(`/admin/settings/${encodeURIComponent(key)}`, data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to update system setting'
    };
  }
};

export const deleteSystemSetting = async (key: string): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await client.delete<ApiResponse<{ message: string }>>(`/admin/settings/${encodeURIComponent(key)}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to delete system setting'
    };
  }
};

export const getSettingCategories = async (): Promise<ApiResponse<string[]>> => {
  try {
    const response = await client.get<ApiResponse<string[]>>('/admin/settings/categories/list');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get setting categories'
    };
  }
};

export const bulkUpdateSettings = async (settings: Array<{ key: string; value: any }>): Promise<ApiResponse<SystemSettings[]>> => {
  try {
    const response = await client.post<ApiResponse<SystemSettings[]>>('/admin/settings/bulk-update', settings);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to bulk update settings'
    };
  }
};

// Enhanced error handling with retry logic
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      lastError = error;

      // Don't retry on authentication errors or client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
};

// Utility methods
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

export const getCachedProfile = (): AdminProfile | null => {
  if (typeof window !== 'undefined') {
    const profile = localStorage.getItem('admin_profile');
    return profile ? JSON.parse(profile) : null;
  }
  return null;
};

// Clear all cached data
export const clearCache = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_profile');
    // Clear any other cached data
  }
};

// Get API health status
export const getHealthStatus = async (): Promise<ApiResponse<{ status: string; timestamp: number }>> => {
  try {
    const response = await client.get<ApiResponse<{ status: string; timestamp: number }>>('/health');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to get health status'
    };
  }
};

// Create an object with all API functions for backward compatibility
export const apiClient = {
  // Auth methods
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,

  // Dashboard
  getDashboardStats,

  // Admin management
  getAllAdmins,
  createAdmin,
  updateAdmin,
  updateAdminPermissions,
  toggleAdminStatus,
  deleteAdmin,
  getRolePermissions,
  generateApiKey,
  revokeApiKey,

  // Wallet management
  getAdminWallets,
  createAdminWallet,
  updateAdminWallet,
  deleteAdminWallet,
  setPrimaryAdminWallet,
  toggleAdminWalletStatus,

  // Bank account management
  getAdminBankAccounts,
  createAdminBankAccount,
  updateAdminBankAccount,
  deleteAdminBankAccount,
  setPrimaryAdminBankAccount,
  toggleAdminBankAccountStatus,

  // Transfer management
  getPendingCount,
  getAllTransfers,
  getTransferById,
  updateTransfer,
  bulkUpdateTransferStatus,
  getTransferStats,

  // User management
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserKyc,
  getUserTransfers,
  addUserNote,
  getUserNotes,

  // Audit logs
  getAuditLogs,
  getAuditStats,

  // Financial reports
  getFinancialReport,
  exportFinancialReport,

  // System settings
  getSystemSettings,
  getSystemSetting,
  createSystemSetting,
  updateSystemSetting,
  deleteSystemSetting,
  getSettingCategories,
  bulkUpdateSettings,

  // Utilities
  isAuthenticated,
  getCachedProfile,
  clearCache,
  getHealthStatus,
  retryRequest
};

export default apiClient;
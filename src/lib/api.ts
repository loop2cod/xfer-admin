import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

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

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
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
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              if (response.success && response.data) {
                this.setTokens(response.data.access_token, response.data.refresh_token);
                originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
                return this.client(originalRequest);
              }
            }
          } catch (refreshError) {
            this.clearAuth();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Token management
  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_access_token');
    }
    return null;
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_refresh_token');
    }
    return null;
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_access_token', accessToken);
      localStorage.setItem('admin_refresh_token', refreshToken);
    }
  }

  private clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
      localStorage.removeItem('admin_profile');
    }
  }

  // API Methods
  async login(credentials: AdminLoginRequest): Promise<ApiResponse<AdminTokenResponse>> {
    try {
      const response = await this.client.post<ApiResponse<AdminTokenResponse>>('/auth/admin/login', credentials);
      
      if (response.data.success && response.data.data) {
        this.setTokens(response.data.data.access_token, response.data.data.refresh_token);
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || error.message || 'Login failed'
      };
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await this.client.post<ApiResponse>('/auth/admin/logout');
      this.clearAuth();
      return response.data;
    } catch (error: any) {
      this.clearAuth();
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Logout failed'
      };
    }
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AdminTokenResponse>> {
    try {
      const response = await this.client.post<ApiResponse<AdminTokenResponse>>('/auth/admin/refresh', {
        refresh_token: refreshToken
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Token refresh failed'
      };
    }
  }

  async getProfile(): Promise<ApiResponse<AdminProfile>> {
    try {
      const response = await this.client.get<ApiResponse<AdminProfile>>('/admin/me');
      
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
  }

  async updateProfile(data: AdminUpdateRequest): Promise<ApiResponse<AdminProfile>> {
    try {
      const response = await this.client.put<ApiResponse<AdminProfile>>('/admin/me', data);
      
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
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const response = await this.client.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get dashboard stats'
      };
    }
  }

  async getAllAdmins(params?: {
    skip?: number;
    limit?: number;
    role?: string;
    is_active?: boolean;
  }): Promise<ApiResponse<AdminProfile[]>> {
    try {
      const response = await this.client.get<ApiResponse<AdminProfile[]>>('/admin/all', { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get admins'
      };
    }
  }

  async createAdmin(data: AdminCreateRequest): Promise<ApiResponse<AdminProfile>> {
    try {
      const response = await this.client.post<ApiResponse<AdminProfile>>('/admin/', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create admin'
      };
    }
  }

  async updateAdmin(id: string, data: AdminUpdateRequest): Promise<ApiResponse<AdminProfile>> {
    try {
      const response = await this.client.put<ApiResponse<AdminProfile>>(`/admin/${id}`, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update admin'
      };
    }
  }

  async updateAdminPermissions(id: string, permissions: Record<string, boolean>): Promise<ApiResponse<AdminProfile>> {
    try {
      const response = await this.client.put<ApiResponse<AdminProfile>>(`/admin/${id}/permissions`, { permissions });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update permissions'
      };
    }
  }

  async toggleAdminStatus(id: string): Promise<ApiResponse<AdminProfile>> {
    try {
      const response = await this.client.post<ApiResponse<AdminProfile>>(`/admin/${id}/toggle-status`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to toggle admin status'
      };
    }
  }

  async deleteAdmin(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.delete<ApiResponse>(`/admin/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete admin'
      };
    }
  }

  async getRolePermissions(): Promise<ApiResponse<RolePermissions[]>> {
    try {
      const response = await this.client.get<ApiResponse<RolePermissions[]>>('/admin/roles/permissions');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get role permissions'
      };
    }
  }

  async generateApiKey(expiresDays: number = 90): Promise<ApiResponse<{ api_key: string; expires_at: string }>> {
    try {
      const response = await this.client.post<ApiResponse<{ api_key: string; expires_at: string }>>(`/admin/api-key`, {
        expires_days: expiresDays
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to generate API key'
      };
    }
  }

  async revokeApiKey(): Promise<ApiResponse> {
    try {
      const response = await this.client.delete<ApiResponse>('/admin/api-key');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to revoke API key'
      };
    }
  }

  // Admin Wallet Management
  async getAdminWallets(): Promise<ApiResponse<AdminWallet[]>> {
    try {
      const response = await this.client.get<ApiResponse<AdminWallet[]>>('/admin-wallets');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get admin wallets'
      };
    }
  }

  async createAdminWallet(data: AdminWalletCreateRequest): Promise<ApiResponse<AdminWallet>> {
    try {
      const response = await this.client.post<ApiResponse<AdminWallet>>('/admin-wallets', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create admin wallet'
      };
    }
  }

  async updateAdminWallet(id: string, data: AdminWalletUpdateRequest): Promise<ApiResponse<AdminWallet>> {
    try {
      const response = await this.client.put<ApiResponse<AdminWallet>>(`/admin-wallets/${id}`, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update admin wallet'
      };
    }
  }

  async deleteAdminWallet(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.delete<ApiResponse>(`/admin-wallets/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete admin wallet'
      };
    }
  }

  async setPrimaryAdminWallet(id: string): Promise<ApiResponse<AdminWallet>> {
    try {
      const response = await this.client.post<ApiResponse<AdminWallet>>('/admin-wallets/set-primary', { wallet_id: id });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to set primary admin wallet'
      };
    }
  }

  async toggleAdminWalletStatus(id: string): Promise<ApiResponse<AdminWallet>> {
    try {
      const response = await this.client.post<ApiResponse<AdminWallet>>(`/admin-wallets/${id}/toggle-status`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to toggle admin wallet status'
      };
    }
  }

  // Admin Bank Account Management
  async getAdminBankAccounts(): Promise<ApiResponse<AdminBankAccount[]>> {
    try {
      const response = await this.client.get<ApiResponse<AdminBankAccount[]>>('/admin-bank-accounts');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get admin bank accounts'
      };
    }
  }

  async createAdminBankAccount(data: AdminBankAccountCreateRequest): Promise<ApiResponse<AdminBankAccount>> {
    try {
      const response = await this.client.post<ApiResponse<AdminBankAccount>>('/admin-bank-accounts', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create admin bank account'
      };
    }
  }

  async updateAdminBankAccount(id: string, data: AdminBankAccountUpdateRequest): Promise<ApiResponse<AdminBankAccount>> {
    try {
      const response = await this.client.put<ApiResponse<AdminBankAccount>>(`/admin-bank-accounts/${id}`, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update admin bank account'
      };
    }
  }

  async deleteAdminBankAccount(id: string): Promise<ApiResponse> {
    try {
      const response = await this.client.delete<ApiResponse>(`/admin-bank-accounts/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete admin bank account'
      };
    }
  }

  async setPrimaryAdminBankAccount(id: string): Promise<ApiResponse<AdminBankAccount>> {
    try {
      const response = await this.client.post<ApiResponse<AdminBankAccount>>('/admin-bank-accounts/set-primary', { account_id: id });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to set primary admin bank account'
      };
    }
  }

  async toggleAdminBankAccountStatus(id: string): Promise<ApiResponse<AdminBankAccount>> {
    try {
      const response = await this.client.post<ApiResponse<AdminBankAccount>>(`/admin-bank-accounts/${id}/toggle-status`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to toggle admin bank account status'
      };
    }
  }

  // Transfer Management
  async getPendingCount(): Promise<ApiResponse<{ pending_count: number; timestamp: string }>> {
    try {
      const response = await this.client.get<ApiResponse<{ pending_count: number; timestamp: string }>>('/transfers/admin/pending-count')
      return response.data
    } catch (error: any) {
      console.error('Error fetching pending count:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch pending count'
      }
    }
  }

  async getAllTransfers(params?: {
    skip?: number;
    limit?: number;
    status?: string;
    status_filter?: string;
    type_filter?: string;
    transfer_type?: string;
    search?: string;
  }): Promise<ApiResponse<PaginatedTransfersResponse>> {
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
      
      const response = await this.client.get<ApiResponse<PaginatedTransfersResponse>>('/transfers/admin/all', { 
        params: cleanParams 
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get transfers'
      };
    }
  }

  async getTransferById(id: string): Promise<ApiResponse<TransferRequest>> {
    try {
      const response = await this.client.get<ApiResponse<TransferRequest>>(`/transfers/admin/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get transfer'
      };
    }
  }

  async updateTransfer(id: string, data: TransferUpdateRequest): Promise<ApiResponse<TransferRequest>> {
    try {
      const response = await this.client.put<ApiResponse<TransferRequest>>(`/transfers/admin/${id}`, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update transfer'
      };
    }
  }

  async bulkUpdateTransferStatus(
    transfer_ids: string[],
    status: string,
    status_message?: string
  ): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.post<ApiResponse<any>>('/transfers/bulk-update-status', {
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
  }

  async getTransferStats(): Promise<ApiResponse<TransferStats>> {
    try {
      const response = await this.client.get<ApiResponse<TransferStats>>('/transfers/admin/stats');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get transfer stats'
      };
    }
  }

  // User Management
  async getAllUsers(params?: UserFilters): Promise<ApiResponse<PaginatedUsersResponse>> {
    try {
      const cleanParams = {
        skip: params?.skip || 0,
        limit: params?.limit || 50,
        ...(params?.search && { search: params.search }),
        ...(params?.kyc_status && { kyc_status: params.kyc_status }),
        ...(params?.is_active !== undefined && { is_active: params.is_active }),
      };

      const response = await this.client.get<ApiResponse<PaginatedUsersResponse>>('/users/admin/all', {
        params: cleanParams
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get users'
      };
    }
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await this.client.get<ApiResponse<User>>(`/users/admin/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get user'
      };
    }
  }

  async updateUserStatus(id: string, is_active: boolean): Promise<ApiResponse<User>> {
    try {
      const response = await this.client.put<ApiResponse<User>>(`/users/admin/${id}/status`, { is_active });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update user status'
      };
    }
  }

  async updateUserKyc(id: string, kyc_status: string, notes?: string): Promise<ApiResponse<User>> {
    try {
      const response = await this.client.put<ApiResponse<User>>(`/users/admin/${id}/kyc`, {
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
  }

  // Audit Logs
  async getAuditLogs(params?: {
    skip?: number;
    limit?: number;
    admin_id?: string;
    action?: string;
    resource_type?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<ApiResponse<{ logs: AuditLog[]; total: number }>> {
    try {
      const response = await this.client.get<ApiResponse<{ logs: AuditLog[]; total: number }>>('/admin/audit-logs', {
        params
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get audit logs'
      };
    }
  }

  async getAuditStats(): Promise<ApiResponse<{
    total_logs: number;
    unique_admins: number;
    actions_today: number;
    most_common_action: string;
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{
        total_logs: number;
        unique_admins: number;
        actions_today: number;
        most_common_action: string;
      }>>('/admin/audit-logs/stats');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get audit stats'
      };
    }
  }

  // Financial Reports
  async getFinancialReport(params: {
    start_date: string;
    end_date: string;
    group_by?: 'day' | 'week' | 'month';
  }): Promise<ApiResponse<FinancialReport>> {
    try {
      const response = await this.client.get<ApiResponse<FinancialReport>>('/admin/reports/financial', {
        params
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get financial report'
      };
    }
  }

  async exportFinancialReport(params: {
    start_date: string;
    end_date: string;
    format: 'csv' | 'xlsx';
  }): Promise<ApiResponse<{ download_url: string }>> {
    try {
      const response = await this.client.post<ApiResponse<{ download_url: string }>>('/admin/reports/financial/export', params);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to export financial report'
      };
    }
  }

  // System Settings
  async getSystemSettings(category?: string): Promise<ApiResponse<SystemSettings[]>> {
    try {
      const params = category ? `?category=${encodeURIComponent(category)}` : '';
      const response = await this.client.get<ApiResponse<SystemSettings[]>>(`/admin/settings${params}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get system settings'
      };
    }
  }

  async getSystemSetting(key: string): Promise<ApiResponse<SystemSettings>> {
    try {
      const response = await this.client.get<ApiResponse<SystemSettings>>(`/admin/settings/${encodeURIComponent(key)}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get system setting'
      };
    }
  }

  async createSystemSetting(data: {
    key: string;
    value: any;
    description?: string;
    category: string;
    is_public?: boolean;
  }): Promise<ApiResponse<SystemSettings>> {
    try {
      const response = await this.client.post<ApiResponse<SystemSettings>>('/admin/settings', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create system setting'
      };
    }
  }

  async updateSystemSetting(key: string, data: {
    value?: any;
    description?: string;
    category?: string;
    is_public?: boolean;
  }): Promise<ApiResponse<SystemSettings>> {
    try {
      const response = await this.client.put<ApiResponse<SystemSettings>>(`/admin/settings/${encodeURIComponent(key)}`, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update system setting'
      };
    }
  }

  async deleteSystemSetting(key: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await this.client.delete<ApiResponse<{ message: string }>>(`/admin/settings/${encodeURIComponent(key)}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete system setting'
      };
    }
  }

  async getSettingCategories(): Promise<ApiResponse<string[]>> {
    try {
      const response = await this.client.get<ApiResponse<string[]>>('/admin/settings/categories/list');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get setting categories'
      };
    }
  }

  async bulkUpdateSettings(settings: Array<{ key: string; value: any }>): Promise<ApiResponse<SystemSettings[]>> {
    try {
      const response = await this.client.post<ApiResponse<SystemSettings[]>>('/admin/settings/bulk-update', settings);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to bulk update settings'
      };
    }
  }

  // Enhanced error handling with retry logic
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
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
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getCachedProfile(): AdminProfile | null {
    if (typeof window !== 'undefined') {
      const profile = localStorage.getItem('admin_profile');
      return profile ? JSON.parse(profile) : null;
    }
    return null;
  }

  // Clear all cached data
  clearCache(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_profile');
      // Clear any other cached data
    }
  }

  // Get API health status
  async getHealthStatus(): Promise<ApiResponse<{ status: string; timestamp: number }>> {
    try {
      const response = await this.client.get<ApiResponse<{ status: string; timestamp: number }>>('/health');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get health status'
      };
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
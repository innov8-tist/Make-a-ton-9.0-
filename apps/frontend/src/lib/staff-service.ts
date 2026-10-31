import axiosInstance from '@/lib/axios';

export interface Staff {
  id: number;
  email: string;
  name: string;
  role: 'STAFF';
  isActive: boolean;
  createdAt: string;
  createdById: number | null;
}

export interface CreateStaffData {
  name: string;
  email: string;
  password: string;
  role: 'STAFF';
}

interface StaffListResponse {
  data: {
    staff: Staff[];
  };
}

interface CreateStaffResponse {
  data: {
    user: Staff;
  };
}

export const staffService = {
  async listStaff(): Promise<Staff[]> {
    const response = await axiosInstance.get<StaffListResponse>('/auth/staff');
    return response.data.data.staff;
  },

  async createStaff(data: CreateStaffData): Promise<Staff> {
    const response = await axiosInstance.post<CreateStaffResponse>('/auth/staff', data);
    return response.data.data.user;
  },
};

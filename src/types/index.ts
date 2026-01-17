/**
 * Shared TypeScript interfaces for MP Manager V2
 * Used by both client stores and server API
 */

export type Ship = {
  id: string;
  name: string;
  code: string;
  created_at: string;
};

export type MaintenancePeriod = {
  id: string;
  ship_id: string;
  mp_number: number;
  year: number;
  type: 'In Water' | 'Docking' | 'Log Visit';
  status: 'planned' | 'active' | 'completed';
  start_date: string; // YYYY-MM-DD
  end_date: string;
  planning_start: string; // ISO 8601
  closeout_end: string;
  has_pre_planning: boolean;
  created_at: string;
  updated_at: string;
};

export type Team = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Personnel = {
  id: string;
  team_id: string;
  name: string;
  rank?: string;
  role?: string;
  created_at: string;
};

export type Assignment = {
  id: string;
  mp_id: string;
  team_id: string;
  weeks_allocated: number;
  status: 'allocated' | 'in-progress' | 'completed';
  created_at: string;
  updated_at: string;
};

// API Response types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// UI State types
export type ModalState = {
  isOpen: boolean;
  mode: 'create' | 'edit';
  entityId?: string;
};

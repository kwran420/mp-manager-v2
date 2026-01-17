import type { Ship, MaintenancePeriod, Team, Personnel, Assignment, ApiResponse } from '@/types';

/**
 * API client wrapper for MP Manager V2
 * Provides type-safe fetch operations with error handling
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: error || `HTTP ${response.status}` };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Ships
  async getShips(): Promise<ApiResponse<Ship[]>> {
    return this.request<Ship[]>('/api/ships');
  }

  async createShip(ship: Omit<Ship, 'id' | 'created_at'>): Promise<ApiResponse<Ship>> {
    return this.request<Ship>('/api/ships', {
      method: 'POST',
      body: JSON.stringify(ship),
    });
  }

  // Maintenance Periods
  async getMPs(): Promise<ApiResponse<MaintenancePeriod[]>> {
    return this.request<MaintenancePeriod[]>('/api/mps');
  }

  async getMPsByShip(shipId: string): Promise<ApiResponse<MaintenancePeriod[]>> {
    return this.request<MaintenancePeriod[]>(`/api/ships/${shipId}/mps`);
  }

  async createMP(mp: Omit<MaintenancePeriod, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<MaintenancePeriod>> {
    return this.request<MaintenancePeriod>('/api/mps', {
      method: 'POST',
      body: JSON.stringify(mp),
    });
  }

  async updateMP(id: string, mp: Partial<MaintenancePeriod>): Promise<ApiResponse<MaintenancePeriod>> {
    return this.request<MaintenancePeriod>(`/api/mps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mp),
    });
  }

  async deleteMP(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/mps/${id}`, { method: 'DELETE' });
  }

  // Teams
  async getTeams(): Promise<ApiResponse<Team[]>> {
    return this.request<Team[]>('/api/teams');
  }

  async createTeam(team: { name: string }): Promise<ApiResponse<Team>> {
    return this.request<Team>('/api/teams', {
      method: 'POST',
      body: JSON.stringify(team),
    });
  }

  async updateTeam(id: string, team: Partial<Team>): Promise<ApiResponse<Team>> {
    return this.request<Team>(`/api/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(team),
    });
  }

  async deleteTeam(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/teams/${id}`, { method: 'DELETE' });
  }

  // Personnel
  async getPersonnel(teamId?: string): Promise<ApiResponse<Personnel[]>> {
    const endpoint = teamId ? `/api/teams/${teamId}/personnel` : '/api/personnel';
    return this.request<Personnel[]>(endpoint);
  }

  // Assignments
  async getAssignments(): Promise<ApiResponse<Assignment[]>> {
    return this.request<Assignment[]>('/api/assignments');
  }

  async createAssignment(assignment: Omit<Assignment, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Assignment>> {
    return this.request<Assignment>('/api/assignments', {
      method: 'POST',
      body: JSON.stringify(assignment),
    });
  }

  async updateAssignment(id: string, assignment: Partial<Assignment>): Promise<ApiResponse<Assignment>> {
    return this.request<Assignment>(`/api/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assignment),
    });
  }

  async deleteAssignment(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/assignments/${id}`, { method: 'DELETE' });
  }

  // Health check
  async health(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>('/api/health');
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE);

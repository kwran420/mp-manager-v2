/**
 * Mock data for development and Phase 1b UI development
 * Matches database schema but stored in memory for now
 */

// Re-export types from centralized location
export type { Ship, MaintenancePeriod, Team, Personnel, Assignment } from '@/types';
import type { Ship, MaintenancePeriod, Team, Personnel, Assignment } from '@/types';

// Helper function to generate realistic dates
function addWeeks(date: Date, weeks: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().split('T')[0];
}

function addDays(date: Date, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

const today = new Date();
const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
const in120Days = new Date(today.getTime() + 120 * 24 * 60 * 60 * 1000);

// SHIPS
export const mockShips: Ship[] = [
  {
    id: 'ship-001',
    name: 'Cape Schanck',
    code: 'SCH',
    created_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'ship-002',
    name: 'HMAS Sydney',
    code: 'SYD',
    created_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'ship-003',
    name: 'Adelaide',
    code: 'ADE',
    created_at: new Date('2025-01-01').toISOString(),
  },
];

// MAINTENANCE PERIODS
export const mockMPs: MaintenancePeriod[] = [
  {
    id: 'mp-001',
    ship_id: 'ship-001',
    mp_number: 1,
    year: 2025,
    type: 'In Water',
    status: 'planned',
    start_date: in30Days.toISOString().split('T')[0],
    end_date: addDays(in30Days, 90),
    planning_start: addWeeks(in30Days, -14),
    closeout_end: addDays(in30Days, 104),
    has_pre_planning: false,
    created_at: new Date('2025-01-10').toISOString(),
    updated_at: new Date('2025-01-10').toISOString(),
  },
  {
    id: 'mp-002',
    ship_id: 'ship-002',
    mp_number: 2,
    year: 2025,
    type: 'Docking',
    status: 'planned',
    start_date: addDays(in120Days, 0),
    end_date: addDays(in120Days, 60),
    planning_start: addWeeks(new Date(in120Days), -14),
    closeout_end: addDays(in120Days, 74),
    has_pre_planning: false,
    created_at: new Date('2025-01-10').toISOString(),
    updated_at: new Date('2025-01-10').toISOString(),
  },
  {
    id: 'mp-003',
    ship_id: 'ship-001',
    mp_number: 3,
    year: 2025,
    type: 'Log Visit',
    status: 'planned',
    start_date: addDays(in30Days, 180),
    end_date: addDays(in30Days, 181),
    planning_start: addWeeks(new Date(new Date(in30Days.getTime() + 180 * 24 * 60 * 60 * 1000)), -4),
    closeout_end: addDays(in30Days, 195),
    has_pre_planning: false,
    created_at: new Date('2025-01-10').toISOString(),
    updated_at: new Date('2025-01-10').toISOString(),
  },
];

// TEAMS
export const mockTeams: Team[] = [
  {
    id: 'team-001',
    name: 'Engineering Team Alpha',
    created_at: new Date('2025-01-01').toISOString(),
    updated_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'team-002',
    name: 'Maintenance Team Bravo',
    created_at: new Date('2025-01-01').toISOString(),
    updated_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'team-003',
    name: 'Navigation Team Charlie',
    created_at: new Date('2025-01-02').toISOString(),
    updated_at: new Date('2025-01-02').toISOString(),
  },
];

// PERSONNEL
export const mockPersonnel: Personnel[] = [
  {
    id: 'pers-001',
    team_id: 'team-001',
    name: 'LCDR James Mitchell',
    rank: 'LCDR',
    role: 'Engineering Officer',
    created_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'pers-002',
    team_id: 'team-001',
    name: 'PO Sarah Chen',
    rank: 'PO',
    role: 'Senior Technician',
    created_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'pers-003',
    team_id: 'team-002',
    name: 'CPO Robert Walsh',
    rank: 'CPO',
    role: 'Maintenance Lead',
    created_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'pers-004',
    team_id: 'team-002',
    name: 'LS Maria Gonzalez',
    rank: 'LS',
    role: 'Technician',
    created_at: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'pers-005',
    team_id: 'team-003',
    name: 'LCDR David Brown',
    rank: 'LCDR',
    role: 'Navigation Officer',
    created_at: new Date('2025-01-02').toISOString(),
  },
];

// ASSIGNMENTS
export const mockAssignments: Assignment[] = [
  {
    id: 'assign-001',
    mp_id: 'mp-001',
    team_id: 'team-001',
    weeks_allocated: 16,
    status: 'allocated',
    created_at: new Date('2025-01-10').toISOString(),
    updated_at: new Date('2025-01-10').toISOString(),
  },
  {
    id: 'assign-002',
    mp_id: 'mp-001',
    team_id: 'team-002',
    weeks_allocated: 12,
    status: 'allocated',
    created_at: new Date('2025-01-10').toISOString(),
    updated_at: new Date('2025-01-10').toISOString(),
  },
  {
    id: 'assign-003',
    mp_id: 'mp-002',
    team_id: 'team-003',
    weeks_allocated: 10,
    status: 'allocated',
    created_at: new Date('2025-01-10').toISOString(),
    updated_at: new Date('2025-01-10').toISOString(),
  },
];

/**
 * Centralized mock data store for easy manipulation during dev
 */
export const mockDataStore = {
  ships: [...mockShips],
  mps: [...mockMPs],
  teams: [...mockTeams],
  personnel: [...mockPersonnel],
  assignments: [...mockAssignments],
};

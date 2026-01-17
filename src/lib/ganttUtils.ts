/**
 * Gantt chart utility functions
 * Handles date calculations, collision detection, and lane stacking
 */

import { MaintenancePeriod, Assignment } from '@/types';

// Constants for timeline
export const CELL_WIDTH = 40; // pixels per week
export const LANE_HEIGHT = 60; // pixels per lane
export const HEADER_HEIGHT = 60; // timeline header height

/**
 * Get Sunday-based week start for a given date
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get all weeks between two dates (inclusive)
 */
export function getWeeksBetween(start: Date, end: Date): Date[] {
  const weeks: Date[] = [];
  const current = getWeekStart(new Date(start));
  const endWeek = getWeekStart(new Date(end));

  while (current <= endWeek) {
    weeks.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }

  return weeks;
}

/**
 * Calculate number of weeks between two dates
 */
export function weeksBetween(start: Date, end: Date): number {
  const startWeek = getWeekStart(start);
  const endWeek = getWeekStart(end);
  const diff = endWeek.getTime() - startWeek.getTime();
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
}

/**
 * Calculate pixel offset from timeline start
 */
export function getPixelOffset(date: Date, timelineStart: Date): number {
  const weeks = weeksBetween(timelineStart, date) - 1;
  return weeks * CELL_WIDTH;
}

/**
 * Calculate bar width in pixels
 */
export function getBarWidth(startDate: Date, endDate: Date): number {
  const weeks = weeksBetween(startDate, endDate);
  return weeks * CELL_WIDTH;
}

/**
 * Group weeks by month for header rendering
 */
export function groupWeeksByMonth(weeks: Date[]): { month: string; year: number; weeks: number }[] {
  const groups: Map<string, { month: string; year: number; weeks: number }> = new Map();

  weeks.forEach((week) => {
    const key = `${week.getFullYear()}-${week.getMonth()}`;
    const monthName = week.toLocaleString('default', { month: 'short' });
    const year = week.getFullYear();

    if (groups.has(key)) {
      groups.get(key)!.weeks++;
    } else {
      groups.set(key, { month: monthName, year, weeks: 1 });
    }
  });

  return Array.from(groups.values());
}

/**
 * Get phase for a given date within an MP
 */
export type MPPhase = 'pre-planning' | 'planning' | 'active' | 'closeout';

export function getPhaseAtDate(mp: MaintenancePeriod, date: Date): MPPhase | null {
  const d = date.getTime();
  const planningStart = new Date(mp.planning_start).getTime();
  const activeStart = new Date(mp.start_date).getTime();
  const activeEnd = new Date(mp.end_date).getTime();
  const closeoutEnd = new Date(mp.closeout_end).getTime();

  if (d < planningStart) {
    // Check pre-planning (9 months before planning start)
    if (mp.has_pre_planning) {
      const prePlanningStart = planningStart - (9 * 30 * 24 * 60 * 60 * 1000);
      if (d >= prePlanningStart) return 'pre-planning';
    }
    return null;
  }
  if (d < activeStart) return 'planning';
  if (d <= activeEnd) return 'active';
  if (d <= closeoutEnd) return 'closeout';
  return null;
}

/**
 * Calculate phase segments for rendering a bar
 */
export interface PhaseSegment {
  phase: MPPhase;
  startOffset: number; // pixels from bar start
  width: number; // pixels
}

export function getPhaseSegments(
  mp: MaintenancePeriod,
  timelineStart: Date
): PhaseSegment[] {
  const segments: PhaseSegment[] = [];

  const planningStart = new Date(mp.planning_start);
  const activeStart = new Date(mp.start_date);
  const activeEnd = new Date(mp.end_date);
  const closeoutEnd = new Date(mp.closeout_end);

  // Pre-planning (if enabled)
  if (mp.has_pre_planning) {
    const prePlanningStart = new Date(planningStart);
    prePlanningStart.setMonth(prePlanningStart.getMonth() - 9);

    segments.push({
      phase: 'pre-planning',
      startOffset: getPixelOffset(prePlanningStart, timelineStart),
      width: getBarWidth(prePlanningStart, new Date(planningStart.getTime() - 24 * 60 * 60 * 1000)),
    });
  }

  // Planning phase
  segments.push({
    phase: 'planning',
    startOffset: getPixelOffset(planningStart, timelineStart),
    width: getBarWidth(planningStart, new Date(activeStart.getTime() - 24 * 60 * 60 * 1000)),
  });

  // Active phase
  segments.push({
    phase: 'active',
    startOffset: getPixelOffset(activeStart, timelineStart),
    width: getBarWidth(activeStart, activeEnd),
  });

  // Closeout phase
  segments.push({
    phase: 'closeout',
    startOffset: getPixelOffset(new Date(activeEnd.getTime() + 24 * 60 * 60 * 1000), timelineStart),
    width: getBarWidth(new Date(activeEnd.getTime() + 24 * 60 * 60 * 1000), closeoutEnd),
  });

  return segments;
}

/**
 * Collision detection: calculate lane index for each MP to avoid overlaps
 * Returns a map of MP ID → lane index
 */
export function calculateLanes(
  mps: MaintenancePeriod[],
  teamId: string,
  assignments: Assignment[]
): Map<string, number> {
  const laneMap = new Map<string, number>();

  // Filter MPs assigned to this team
  const teamMPs = mps.filter((mp) =>
    assignments.some((a) => a.mp_id === mp.id && a.team_id === teamId)
  );

  // Sort by planning start date
  const sortedMPs = [...teamMPs].sort(
    (a, b) => new Date(a.planning_start).getTime() - new Date(b.planning_start).getTime()
  );

  // Track end dates for each lane
  const laneEndDates: Date[] = [];

  sortedMPs.forEach((mp) => {
    const mpStart = new Date(mp.planning_start);
    const mpEnd = new Date(mp.closeout_end);

    // Find first available lane
    let lane = 0;
    while (lane < laneEndDates.length) {
      if (laneEndDates[lane] < mpStart) {
        break;
      }
      lane++;
    }

    laneMap.set(mp.id, lane);
    laneEndDates[lane] = mpEnd;
  });

  return laneMap;
}

/**
 * Get max concurrent MPs for a team (for lane height calculation)
 */
export function getMaxLanes(
  mps: MaintenancePeriod[],
  teamId: string,
  assignments: Assignment[]
): number {
  const laneMap = calculateLanes(mps, teamId, assignments);
  return Math.max(1, ...Array.from(laneMap.values()).map((v) => v + 1));
}

/**
 * Phase colors for rendering
 */
export const PHASE_COLORS = {
  'pre-planning': {
    bg: 'bg-gray-200 dark:bg-gray-700',
    fill: '#e5e7eb',
    fillDark: '#374151',
  },
  planning: {
    bg: 'bg-blue-200 dark:bg-blue-800',
    fill: '#bfdbfe',
    fillDark: '#1e40af',
  },
  active: {
    bg: 'bg-green-400 dark:bg-green-600',
    fill: '#4ade80',
    fillDark: '#16a34a',
  },
  closeout: {
    bg: 'bg-amber-200 dark:bg-amber-700',
    fill: '#fde68a',
    fillDark: '#b45309',
  },
};

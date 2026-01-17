import { useMemo, useState } from 'react';
import { useShipStore, useMpStore, useTeamStore, useAssignmentStore } from '@/stores';
import { GanttTimeline } from './GanttTimeline';
import { GanttLane } from './GanttLane';
import { GanttLegend } from './GanttLegend';
import { getWeeksBetween, CELL_WIDTH } from '@/lib/ganttUtils';
import { MaintenancePeriod } from '@/types';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface GanttChartProps {
  onMPClick?: (mp: MaintenancePeriod) => void;
}

export function GanttChart({ onMPClick }: GanttChartProps) {
  const ships = useShipStore((s) => s.ships);
  const mps = useMpStore((s) => s.mps);
  const teams = useTeamStore((s) => s.teams);
  const assignments = useAssignmentStore((s) => s.assignments);

  // Timeline range state
  const [monthsToShow, setMonthsToShow] = useState(6);
  const [startOffset, setStartOffset] = useState(0); // months from today

  // Calculate timeline bounds
  const { timelineStart, timelineEnd, weeks } = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() + startOffset, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + monthsToShow, 0);

    return {
      timelineStart: start,
      timelineEnd: end,
      weeks: getWeeksBetween(start, end),
    };
  }, [monthsToShow, startOffset]);

  // Navigation handlers
  const scrollLeft = () => setStartOffset((o) => o - 1);
  const scrollRight = () => setStartOffset((o) => o + 1);
  const zoomIn = () => setMonthsToShow((m) => Math.max(3, m - 3));
  const zoomOut = () => setMonthsToShow((m) => Math.min(24, m + 3));
  const goToToday = () => setStartOffset(0);

  // Filter teams that have assignments
  const teamsWithWork = useMemo(() => {
    const teamIdsWithWork = new Set(assignments.map((a) => a.team_id));
    return teams.filter((t) => teamIdsWithWork.has(t.id));
  }, [teams, assignments]);

  // Show all teams (including empty ones)
  const allTeams = teams;

  if (teams.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-12">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium">No teams configured</p>
          <p className="mt-1">Add teams to see the Gantt chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Schedule
          </h2>
          <GanttLegend />
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation */}
          <button
            onClick={scrollLeft}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            title="Previous months"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
          >
            Today
          </button>
          <button
            onClick={scrollRight}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            title="Next months"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

          {/* Zoom */}
          <button
            onClick={zoomIn}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            title="Zoom in"
            disabled={monthsToShow <= 3}
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[60px] text-center">
            {monthsToShow}mo
          </span>
          <button
            onClick={zoomOut}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            title="Zoom out"
            disabled={monthsToShow >= 24}
          >
            <ZoomOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Gantt Content */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: weeks.length * CELL_WIDTH + 192 }}>
          {/* Timeline Header */}
          <div className="flex">
            <div className="sticky left-0 z-20 w-48 flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700" />
            <GanttTimeline startDate={timelineStart} endDate={timelineEnd} />
          </div>

          {/* Team Lanes */}
          {allTeams.map((team) => (
            <GanttLane
              key={team.id}
              team={team}
              mps={mps}
              ships={ships}
              assignments={assignments}
              timelineStart={timelineStart}
              timelineWeeks={weeks.length}
              onMPClick={onMPClick}
            />
          ))}
        </div>
      </div>

      {/* Today marker info */}
      <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        Showing {timelineStart.toLocaleDateString('default', { month: 'short', year: 'numeric' })} – {timelineEnd.toLocaleDateString('default', { month: 'short', year: 'numeric' })}
        {' • '}
        {mps.length} MPs across {allTeams.length} teams
      </div>
    </div>
  );
}

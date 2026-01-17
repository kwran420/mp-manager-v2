import { useMemo } from 'react';
import { Team, MaintenancePeriod, Assignment, Ship } from '@/types';
import { GanttBar } from './GanttBar';
import { calculateLanes, getMaxLanes, LANE_HEIGHT, CELL_WIDTH } from '@/lib/ganttUtils';

interface GanttLaneProps {
  team: Team;
  mps: MaintenancePeriod[];
  ships: Ship[];
  assignments: Assignment[];
  timelineStart: Date;
  timelineWeeks: number;
  onMPClick?: (mp: MaintenancePeriod) => void;
}

export function GanttLane({
  team,
  mps,
  ships,
  assignments,
  timelineStart,
  timelineWeeks,
  onMPClick,
}: GanttLaneProps) {
  // Get MPs assigned to this team
  const teamMPs = useMemo(() => {
    const assignedMPIds = assignments
      .filter((a) => a.team_id === team.id)
      .map((a) => a.mp_id);
    return mps.filter((mp) => assignedMPIds.includes(mp.id));
  }, [mps, assignments, team.id]);

  // Calculate lane positions for collision avoidance
  const laneMap = useMemo(
    () => calculateLanes(mps, team.id, assignments),
    [mps, team.id, assignments]
  );

  const maxLanes = useMemo(
    () => getMaxLanes(mps, team.id, assignments),
    [mps, team.id, assignments]
  );

  const laneHeight = Math.max(LANE_HEIGHT, maxLanes * (LANE_HEIGHT - 10) + 16);

  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700">
      {/* Team label (sticky) */}
      <div
        className="sticky left-0 z-10 w-48 flex-shrink-0 flex items-center px-4 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
        style={{ minHeight: laneHeight }}
      >
        <div>
          <div className="font-medium text-gray-900 dark:text-white truncate">
            {team.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {teamMPs.length} MP{teamMPs.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Timeline area */}
      <div
        className="relative flex-1 bg-white dark:bg-gray-900"
        style={{
          minWidth: timelineWeeks * CELL_WIDTH,
          minHeight: laneHeight,
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: timelineWeeks }).map((_, i) => (
            <div
              key={i}
              className="border-r border-gray-100 dark:border-gray-800"
              style={{ width: CELL_WIDTH }}
            />
          ))}
        </div>

        {/* MP Bars */}
        {teamMPs.map((mp) => {
          const ship = ships.find((s) => s.id === mp.ship_id);
          const lane = laneMap.get(mp.id) ?? 0;

          return (
            <GanttBar
              key={mp.id}
              mp={mp}
              ship={ship}
              laneIndex={lane}
              timelineStart={timelineStart}
              onClick={onMPClick}
            />
          );
        })}
      </div>
    </div>
  );
}

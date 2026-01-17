import { useMemo } from 'react';
import { getWeeksBetween, groupWeeksByMonth, CELL_WIDTH, HEADER_HEIGHT } from '@/lib/ganttUtils';

interface GanttTimelineProps {
  startDate: Date;
  endDate: Date;
}

export function GanttTimeline({ startDate, endDate }: GanttTimelineProps) {
  const weeks = useMemo(() => getWeeksBetween(startDate, endDate), [startDate, endDate]);
  const monthGroups = useMemo(() => groupWeeksByMonth(weeks), [weeks]);

  return (
    <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Month headers */}
      <div className="flex" style={{ height: HEADER_HEIGHT / 2 }}>
        {monthGroups.map((group, i) => (
          <div
            key={i}
            className="flex items-center justify-center border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300"
            style={{ width: group.weeks * CELL_WIDTH }}
          >
            {group.month} {group.year}
          </div>
        ))}
      </div>

      {/* Week headers */}
      <div className="flex" style={{ height: HEADER_HEIGHT / 2 }}>
        {weeks.map((week, i) => {
          const weekNum = getWeekNumber(week);
          return (
            <div
              key={i}
              className="flex items-center justify-center border-r border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400"
              style={{ width: CELL_WIDTH }}
            >
              W{weekNum}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Get ISO week number
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

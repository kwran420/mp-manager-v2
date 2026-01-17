import { useMemo } from 'react';
import { MaintenancePeriod, Ship } from '@/types';
import { getPhaseSegments, PHASE_COLORS, LANE_HEIGHT } from '@/lib/ganttUtils';

interface GanttBarProps {
  mp: MaintenancePeriod;
  ship: Ship | undefined;
  laneIndex: number;
  timelineStart: Date;
  onClick?: (mp: MaintenancePeriod) => void;
}

export function GanttBar({ mp, ship, laneIndex, timelineStart, onClick }: GanttBarProps) {
  const segments = useMemo(() => getPhaseSegments(mp, timelineStart), [mp, timelineStart]);

  // Calculate bar position
  const topOffset = laneIndex * (LANE_HEIGHT - 10) + 8;

  // Format MP label
  const mpLabel = `${ship?.code || '???'} MP${String(mp.mp_number).padStart(2, '0')}-${String(mp.year).slice(-2)}`;
  const typeLabel = mp.type === 'Log Visit' ? 'LV' : mp.type === 'Docking' ? 'DOCK' : 'IW';

  return (
    <div
      className="absolute flex cursor-pointer group"
      style={{ top: topOffset }}
      onClick={() => onClick?.(mp)}
    >
      {segments.map((segment, i) => {
        const phaseColor = PHASE_COLORS[segment.phase];
        const isActive = segment.phase === 'active';

        return (
          <div
            key={i}
            className={`
              h-10 flex items-center justify-center text-xs font-medium
              border-y first:border-l last:border-r border-gray-400 dark:border-gray-600
              first:rounded-l last:rounded-r
              transition-all group-hover:brightness-95 dark:group-hover:brightness-110
              ${phaseColor.bg}
              ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}
            `}
            style={{
              position: 'absolute',
              left: segment.startOffset,
              width: Math.max(segment.width, 1),
              height: 40,
            }}
          >
            {/* Only show label on active phase if wide enough */}
            {isActive && segment.width > 80 && (
              <div className="flex flex-col items-center leading-tight">
                <span className="font-semibold">{mpLabel}</span>
                <span className="text-[10px] opacity-75">{typeLabel}</span>
              </div>
            )}
            {/* Phase label for non-active phases if wide enough */}
            {!isActive && segment.width > 60 && (
              <span className="text-[10px] uppercase opacity-60">{segment.phase}</span>
            )}
          </div>
        );
      })}

      {/* Hover tooltip */}
      <div className="absolute left-0 -top-12 hidden group-hover:block z-50">
        <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
          <div className="font-semibold">{ship?.name || 'Unknown Ship'}</div>
          <div>{mpLabel} • {mp.type}</div>
          <div className="text-gray-300">
            {new Date(mp.start_date).toLocaleDateString()} – {new Date(mp.end_date).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

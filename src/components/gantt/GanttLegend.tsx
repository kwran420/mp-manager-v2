import { PHASE_COLORS } from '@/lib/ganttUtils';

export function GanttLegend() {
  const phases = [
    { key: 'pre-planning', label: 'Pre-Planning' },
    { key: 'planning', label: 'Planning' },
    { key: 'active', label: 'Active' },
    { key: 'closeout', label: 'Closeout' },
  ] as const;

  return (
    <div className="flex items-center gap-3 ml-4">
      {phases.map(({ key, label }) => (
        <div key={key} className="flex items-center gap-1.5">
          <div
            className={`w-3 h-3 rounded-sm ${PHASE_COLORS[key].bg}`}
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

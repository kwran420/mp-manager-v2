import { useMpStore } from '@/stores/useMpStore';
import { useTeamStore } from '@/stores/useTeamStore';
import { useAssignmentStore } from '@/stores/useAssignmentStore';
import { useShipStore } from '@/stores/useShipStore';
import { GanttChart } from '@/components/gantt';
import { MaintenancePeriod } from '@/types';
import { useState } from 'react';

export function Dashboard() {
  const mps = useMpStore((s) => s.mps);
  const teams = useTeamStore((s) => s.teams);
  const assignments = useAssignmentStore((s) => s.assignments);
  const ships = useShipStore((s) => s.ships);

  const activeMPs = mps.filter((mp) => mp.status === 'active').length;
  const plannedMPs = mps.filter((mp) => mp.status === 'planned').length;
  const totalWeeks = assignments.reduce((sum, a) => sum + a.weeks_allocated, 0);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Overview of maintenance periods and team allocations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Ships"
          value={ships.length}
          color="blue"
        />
        <StatCard
          label="Maintenance Periods"
          value={mps.length}
          color="green"
        />
        <StatCard
          label="Active Teams"
          value={teams.length}
          color="purple"
        />
        <StatCard
          label="Total Weeks Allocated"
          value={totalWeeks}
          color="orange"
        />
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            MP Status
          </h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Planned</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {plannedMPs}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Active</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {activeMPs}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No recent changes
            </p>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <GanttChart onMPClick={(mp) => console.log('Clicked MP:', mp.id)} />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function StatCard({ label, value, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
  };

  return (
    <div className={`rounded-lg p-6 ${colorClasses[color]}`}>
      <p className="text-sm font-medium opacity-75">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

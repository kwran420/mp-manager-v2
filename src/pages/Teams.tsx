import { useTeamStore } from '@/stores/useTeamStore';
import { useAssignmentStore } from '@/stores/useAssignmentStore';
import { Users } from 'lucide-react';

export function Teams() {
  const teams = useTeamStore((s) => s.teams);
  const assignments = useAssignmentStore((s) => s.assignments);

  const getTeamWorkload = (teamId: string) => {
    const teamAssignments = assignments.filter((a) => a.team_id === teamId);
    return teamAssignments.reduce((sum, a) => sum + a.weeks_allocated, 0);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Teams
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage team assignments and personnel
          </p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors">
          Add Team
        </button>
      </div>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center">
            <Users className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No teams yet</p>
            <button className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Create first team
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {teams.map((team) => (
            <div
              key={team.id}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {team.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{getTeamWorkload(team.id)}</span> weeks allocated
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                    Edit
                  </button>
                  <button className="rounded px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                    Delete
                  </button>
                </div>
              </div>

              {/* Personnel (placeholder) */}
              <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-800">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  PERSONNEL
                </p>
                <p className="mt-2 text-sm text-gray-400 dark:text-gray-600">
                  Personnel management coming soon
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

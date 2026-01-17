import { useTeamStore, useAssignmentStore } from '@/stores';

/**
 * Custom hook for team operations with workload calculations
 * Abstracts store access and provides enriched data
 */
export function useTeams() {
  const teams = useTeamStore((s) => s.teams);
  const addTeam = useTeamStore((s) => s.addTeam);
  const updateTeam = useTeamStore((s) => s.updateTeam);
  const deleteTeam = useTeamStore((s) => s.deleteTeam);
  const assignments = useAssignmentStore((s) => s.assignments);

  // Enrich teams with workload data
  const enrichedTeams = teams.map((team) => {
    const teamAssignments = assignments.filter((a) => a.team_id === team.id);
    const totalWeeks = teamAssignments.reduce((sum, a) => sum + a.weeks_allocated, 0);
    const activeAssignments = teamAssignments.filter((a) => a.status === 'in-progress').length;

    return {
      ...team,
      assignmentCount: teamAssignments.length,
      totalWeeksAllocated: totalWeeks,
      activeAssignments,
    };
  });

  // Calculate utilization (assumes 52 weeks per year capacity)
  const getUtilization = (teamId: string, weeksInPeriod = 52) => {
    const team = enrichedTeams.find((t) => t.id === teamId);
    if (!team) return 0;
    return Math.round((team.totalWeeksAllocated / weeksInPeriod) * 100);
  };

  return {
    teams: enrichedTeams,
    getUtilization,
    addTeam,
    updateTeam,
    deleteTeam,
  };
}

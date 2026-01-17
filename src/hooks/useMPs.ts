import { useMpStore, useShipStore, useAssignmentStore } from '@/stores';
import type { MaintenancePeriod } from '@/types';

/**
 * Custom hook for MP operations with computed values
 * Abstracts store access and provides enriched data
 */
export function useMPs() {
  const mps = useMpStore((s) => s.mps);
  const addMp = useMpStore((s) => s.addMp);
  const updateMp = useMpStore((s) => s.updateMp);
  const deleteMp = useMpStore((s) => s.deleteMp);
  const ships = useShipStore((s) => s.ships);
  const assignments = useAssignmentStore((s) => s.assignments);

  // Enrich MPs with ship names and assignment data
  const enrichedMPs = mps.map((mp) => {
    const ship = ships.find((s) => s.id === mp.ship_id);
    const mpAssignments = assignments.filter((a) => a.mp_id === mp.id);
    const totalWeeks = mpAssignments.reduce((sum, a) => sum + a.weeks_allocated, 0);

    return {
      ...mp,
      shipName: ship?.name ?? 'Unknown Ship',
      shipCode: ship?.code ?? '???',
      assignmentCount: mpAssignments.length,
      totalWeeksAllocated: totalWeeks,
    };
  });

  // Filter helpers
  const activeMPs = enrichedMPs.filter((mp) => mp.status === 'active');
  const plannedMPs = enrichedMPs.filter((mp) => mp.status === 'planned');
  const completedMPs = enrichedMPs.filter((mp) => mp.status === 'completed');

  const getMPsByShip = (shipId: string) =>
    enrichedMPs.filter((mp) => mp.ship_id === shipId);

  return {
    mps: enrichedMPs,
    activeMPs,
    plannedMPs,
    completedMPs,
    getMPsByShip,
    addMp,
    updateMp,
    deleteMp,
  };
}

import { create } from 'zustand';
import { mockAssignments, Assignment } from '@/lib/mockData';

interface AssignmentStore {
  assignments: Assignment[];
  getAssignment: (id: string) => Assignment | undefined;
  getAssignmentsByMp: (mpId: string) => Assignment[];
  getAssignmentsByTeam: (teamId: string) => Assignment[];
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
}

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  assignments: mockAssignments,

  getAssignment: (id: string) => {
    return get().assignments.find((a) => a.id === id);
  },

  getAssignmentsByMp: (mpId: string) => {
    return get().assignments.filter((a) => a.mp_id === mpId);
  },

  getAssignmentsByTeam: (teamId: string) => {
    return get().assignments.filter((a) => a.team_id === teamId);
  },

  addAssignment: (assignment: Assignment) => {
    set((state) => ({
      assignments: [...state.assignments, assignment],
    }));
  },

  updateAssignment: (id: string, updates: Partial<Assignment>) => {
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    }));
  },

  deleteAssignment: (id: string) => {
    set((state) => ({
      assignments: state.assignments.filter((a) => a.id !== id),
    }));
  },
}));

import { z } from 'zod';

/**
 * Zod validation schemas for MP Manager V2
 * Used by both client forms and server API
 */

// Ship validation
export const shipSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Ship name is required').max(100),
  code: z.string().min(2).max(5, 'Ship code must be 2-5 characters'),
  created_at: z.string().datetime(),
});

export type ShipInput = z.infer<typeof shipSchema>;

// Maintenance Period validation
export const mpSchema = z.object({
  id: z.string().uuid(),
  ship_id: z.string().uuid(),
  mp_number: z.number().int().min(1).max(99),
  year: z.number().int().min(2020).max(2100),
  type: z.enum(['In Water', 'Docking', 'Log Visit']),
  status: z.enum(['planned', 'active', 'completed']),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  planning_start: z.string().datetime(),
  closeout_end: z.string().datetime(),
  has_pre_planning: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type MPInput = z.infer<typeof mpSchema>;

// Team validation
export const teamSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Team name is required').max(50, 'Team name too long'),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type TeamInput = z.infer<typeof teamSchema>;

// Personnel validation
export const personnelSchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100),
  rank: z.string().max(50).optional(),
  role: z.string().max(100).optional(),
  created_at: z.string().datetime(),
});

export type PersonnelInput = z.infer<typeof personnelSchema>;

// Assignment validation
export const assignmentSchema = z.object({
  id: z.string().uuid(),
  mp_id: z.string().uuid(),
  team_id: z.string().uuid(),
  weeks_allocated: z.number().int().min(1).max(52),
  status: z.enum(['allocated', 'in-progress', 'completed']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type AssignmentInput = z.infer<typeof assignmentSchema>;

// Form validation (partial schemas for create/edit)
export const createMPFormSchema = mpSchema.pick({
  ship_id: true,
  mp_number: true,
  year: true,
  type: true,
  start_date: true,
  end_date: true,
  has_pre_planning: true,
});

export const createTeamFormSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(50, 'Team name too long'),
});

export const createAssignmentFormSchema = z.object({
  mp_id: z.string().uuid(),
  team_id: z.string().uuid(),
  weeks_allocated: z.number().int().min(1).max(52),
});

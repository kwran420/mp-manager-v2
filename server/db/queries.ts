/**
 * Type-safe database queries using Drizzle ORM
 * This module provides query builders that are fully typed and safe
 */

import { db } from './db';
import { ships, mps, teams, personnel, assignments, audit_log } from './schema';
import { eq, and } from 'drizzle-orm';

// ===== SHIPS =====
export const shipQueries = {
  getAll: async () => db.select().from(ships),
  getById: async (id: string) => db.select().from(ships).where(eq(ships.id, id)).limit(1),
  getByCode: async (code: string) => db.select().from(ships).where(eq(ships.code, code)).limit(1),
  create: async (id: string, name: string, code: string) =>
    db.insert(ships).values({ id, name, code }).returning(),
};

// ===== MAINTENANCE PERIODS (MPs) =====
export const mpQueries = {
  getAll: async () => db.select().from(mps).orderBy(mps.start_date),
  getById: async (id: string) => db.select().from(mps).where(eq(mps.id, id)).limit(1),
  getByShip: async (shipId: string) =>
    db.select().from(mps).where(eq(mps.ship_id, shipId)).orderBy(mps.start_date),
  getActive: async () => db.select().from(mps).where(eq(mps.status, 'active')),
  create: async (
    id: string,
    shipId: string,
    mpNumber: number,
    year: number,
    type: 'In Water' | 'Docking' | 'Log Visit',
    startDate: string,
    endDate: string,
    planningStart: string,
    closeoutEnd: string,
    hasPrePlanning: boolean = false
  ) =>
    db
      .insert(mps)
      .values({
        id,
        ship_id: shipId,
        mp_number: mpNumber,
        year,
        type,
        start_date: startDate,
        end_date: endDate,
        planning_start: planningStart,
        closeout_end: closeoutEnd,
        has_pre_planning: hasPrePlanning,
      })
      .returning(),
  update: async (id: string, updates: Partial<typeof mps.$inferInsert>) =>
    db.update(mps).set({ ...updates, updated_at: new Date().toISOString() }).where(eq(mps.id, id)).returning(),
  delete: async (id: string) => db.delete(mps).where(eq(mps.id, id)),
};

// ===== TEAMS =====
export const teamQueries = {
  getAll: async () => db.select().from(teams).orderBy(teams.name),
  getById: async (id: string) => db.select().from(teams).where(eq(teams.id, id)).limit(1),
  getByName: async (name: string) => db.select().from(teams).where(eq(teams.name, name)).limit(1),
  create: async (id: string, name: string) =>
    db.insert(teams).values({ id, name }).returning(),
  update: async (id: string, name: string) =>
    db.update(teams).set({ name, updated_at: new Date().toISOString() }).where(eq(teams.id, id)).returning(),
  delete: async (id: string) => db.delete(teams).where(eq(teams.id, id)),
};

// ===== PERSONNEL =====
export const personnelQueries = {
  getAll: async () => db.select().from(personnel),
  getByTeam: async (teamId: string) =>
    db.select().from(personnel).where(eq(personnel.team_id, teamId)).orderBy(personnel.name),
  create: async (id: string, teamId: string, name: string, rank?: string, role?: string) =>
    db.insert(personnel).values({ id, team_id: teamId, name, rank, role }).returning(),
  update: async (id: string, updates: Partial<typeof personnel.$inferInsert>) =>
    db.update(personnel).set(updates).where(eq(personnel.id, id)).returning(),
  delete: async (id: string) => db.delete(personnel).where(eq(personnel.id, id)),
};

// ===== ASSIGNMENTS =====
export const assignmentQueries = {
  getAll: async () => db.select().from(assignments),
  getById: async (id: string) => db.select().from(assignments).where(eq(assignments.id, id)).limit(1),
  getByMP: async (mpId: string) =>
    db.select().from(assignments).where(eq(assignments.mp_id, mpId)),
  getByTeam: async (teamId: string) =>
    db.select().from(assignments).where(eq(assignments.team_id, teamId)),
  getByMPAndTeam: async (mpId: string, teamId: string) =>
    db
      .select()
      .from(assignments)
      .where(and(eq(assignments.mp_id, mpId), eq(assignments.team_id, teamId)))
      .limit(1),
  create: async (id: string, mpId: string, teamId: string, weeksAllocated: number) =>
    db
      .insert(assignments)
      .values({ id, mp_id: mpId, team_id: teamId, weeks_allocated: weeksAllocated })
      .returning(),
  update: async (id: string, updates: Partial<typeof assignments.$inferInsert>) =>
    db.update(assignments).set({ ...updates, updated_at: new Date().toISOString() }).where(eq(assignments.id, id)).returning(),
  delete: async (id: string) => db.delete(assignments).where(eq(assignments.id, id)),
};

// ===== AUDIT LOG =====
export const auditQueries = {
  getAll: async () => db.select().from(audit_log).orderBy(audit_log.timestamp),
  getByEntity: async (entityType: string, entityId: string) =>
    db
      .select()
      .from(audit_log)
      .where(and(eq(audit_log.entity_type, entityType as any), eq(audit_log.entity_id, entityId)))
      .orderBy(audit_log.timestamp),
  log: async (
    id: string,
    action: 'create' | 'update' | 'delete',
    entityType: 'ship' | 'mp' | 'team' | 'personnel' | 'assignment',
    entityId: string,
    oldValues?: string,
    newValues?: string,
    user?: string
  ) =>
    db
      .insert(audit_log)
      .values({ id, action, entity_type: entityType, entity_id: entityId, old_values: oldValues, new_values: newValues, user })
      .returning(),
};

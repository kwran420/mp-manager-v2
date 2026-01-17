import { sqliteTable, text, integer, real, blob } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Ships — Naval vessels that undergo maintenance periods
 */
export const ships = sqliteTable('ships', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(), // e.g., "SCH" for Cape Schanck
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

/**
 * Maintenance Periods (MPs) — Scheduled maintenance activities
 */
export const mps = sqliteTable('mps', {
  id: text('id').primaryKey(),
  ship_id: text('ship_id')
    .notNull()
    .references(() => ships.id, { onDelete: 'cascade' }),
  mp_number: integer('mp_number').notNull(), // e.g., 03
  year: integer('year').notNull(), // e.g., 2025
  type: text('type', { enum: ['In Water', 'Docking', 'Log Visit'] }).notNull(),
  status: text('status', { enum: ['planned', 'active', 'completed'] }).default('planned'),
  
  // Date windows
  start_date: text('start_date').notNull(), // ISO 8601: YYYY-MM-DD
  end_date: text('end_date').notNull(),
  planning_start: text('planning_start').notNull(), // Auto-calculated: 14w before (MPs), 4w (Log Visits)
  closeout_end: text('closeout_end').notNull(), // Auto-calculated: 2w after end_date
  
  // Optional phases
  has_pre_planning: integer('has_pre_planning', { mode: 'boolean' }).default(false), // 9m before planned start
  
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

/**
 * Teams — Personnel groups responsible for executing MPs
 */
export const teams = sqliteTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

/**
 * Personnel — Individual crew members assigned to teams
 */
export const personnel = sqliteTable('personnel', {
  id: text('id').primaryKey(),
  team_id: text('team_id')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  rank: text('rank'), // e.g., "LCDR", "PO"
  role: text('role'), // e.g., "Engineering", "Navigation"
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

/**
 * Assignments — MP to Team work allocations
 */
export const assignments = sqliteTable('assignments', {
  id: text('id').primaryKey(),
  mp_id: text('mp_id')
    .notNull()
    .references(() => mps.id, { onDelete: 'cascade' }),
  team_id: text('team_id')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  weeks_allocated: integer('weeks_allocated').notNull(), // e.g., 16 weeks
  status: text('status', { enum: ['allocated', 'in-progress', 'completed'] }).default('allocated'),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

/**
 * Audit Log — Track all data changes for compliance
 */
export const audit_log = sqliteTable('audit_log', {
  id: text('id').primaryKey(),
  action: text('action', { enum: ['create', 'update', 'delete'] }).notNull(),
  entity_type: text('entity_type', { enum: ['ship', 'mp', 'team', 'personnel', 'assignment'] }).notNull(),
  entity_id: text('entity_id').notNull(),
  user: text('user'), // Optional: user email if multi-user auth implemented
  old_values: text('old_values'), // JSON string of previous values
  new_values: text('new_values'), // JSON string of new values
  timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
});

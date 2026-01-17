import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import fs from 'fs';
import path from 'path';

const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './data/mp-manager.db';

// Ensure data directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize better-sqlite3 connection
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL'); // Write-Ahead Logging for better concurrency
sqlite.pragma('foreign_keys = ON'); // Enforce foreign key constraints

// Initialize Drizzle ORM
export const db = drizzle(sqlite, { schema });

/**
 * Initialize database schema (creates tables if they don't exist)
 * Called automatically on first connection
 */
export async function initializeDatabase() {
  try {
    // Get all tables
    const tables = sqlite
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      )
      .all() as Array<{ name: string }>;

    const existingTables = tables.map((t) => t.name);
    const requiredTables = Object.keys(schema);

    // Check if all tables exist
    const allTablesExist = requiredTables.every((table) => existingTables.includes(table));

    if (allTablesExist) {
      console.log('✅ Database schema already initialized');
      return;
    }

    console.log('🔧 Creating database schema...');

    // Create tables (if not exists)
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS ships (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS mps (
        id TEXT PRIMARY KEY,
        ship_id TEXT NOT NULL,
        mp_number INTEGER NOT NULL,
        year INTEGER NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('In Water', 'Docking', 'Log Visit')),
        status TEXT DEFAULT 'planned' CHECK(status IN ('planned', 'active', 'completed')),
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        planning_start TEXT NOT NULL,
        closeout_end TEXT NOT NULL,
        has_pre_planning INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ship_id) REFERENCES ships(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS teams (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS personnel (
        id TEXT PRIMARY KEY,
        team_id TEXT NOT NULL,
        name TEXT NOT NULL,
        rank TEXT,
        role TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS assignments (
        id TEXT PRIMARY KEY,
        mp_id TEXT NOT NULL,
        team_id TEXT NOT NULL,
        weeks_allocated INTEGER NOT NULL,
        status TEXT DEFAULT 'allocated' CHECK(status IN ('allocated', 'in-progress', 'completed')),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (mp_id) REFERENCES mps(id) ON DELETE CASCADE,
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS audit_log (
        id TEXT PRIMARY KEY,
        action TEXT NOT NULL CHECK(action IN ('create', 'update', 'delete')),
        entity_type TEXT NOT NULL CHECK(entity_type IN ('ship', 'mp', 'team', 'personnel', 'assignment')),
        entity_id TEXT NOT NULL,
        user TEXT,
        old_values TEXT,
        new_values TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database schema created successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Seed database with sample data (development only)
 */
export async function seedDatabase() {
  try {
    // Check if data already exists
    const shipCount = sqlite.prepare('SELECT COUNT(*) as count FROM ships').get() as {
      count: number;
    };

    if (shipCount.count > 0) {
      console.log('✅ Database already seeded');
      return;
    }

    console.log('🌱 Seeding sample data...');

    const crypto = await import('crypto');
    const generateId = () => crypto.randomUUID();

    // Sample ships
    const ship1Id = generateId();
    const ship2Id = generateId();

    sqlite.prepare('INSERT INTO ships VALUES (?, ?, ?, CURRENT_TIMESTAMP)').run(
      ship1Id,
      'Cape Schanck',
      'SCH'
    );
    sqlite.prepare('INSERT INTO ships VALUES (?, ?, ?, CURRENT_TIMESTAMP)').run(
      ship2Id,
      'HMAS Sydney',
      'SYD'
    );

    // Sample MPs
    const mp1Id = generateId();
    const mp2Id = generateId();
    const today = new Date();
    const startDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    const endDate = new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000); // 3 months duration
    const planningStart = new Date(startDate.getTime() - 14 * 7 * 24 * 60 * 60 * 1000); // 14 weeks before
    const closeoutEnd = new Date(endDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 2 weeks after

    const fmt = (d: Date) => d.toISOString().split('T')[0];

    sqlite
      .prepare(
        `INSERT INTO mps VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
      )
      .run(
        mp1Id,
        ship1Id,
        1,
        2025,
        'In Water',
        'planned',
        fmt(startDate),
        fmt(endDate),
        fmt(planningStart),
        fmt(closeoutEnd),
        0
      );

    sqlite
      .prepare(
        `INSERT INTO mps VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
      )
      .run(
        mp2Id,
        ship2Id,
        2,
        2025,
        'Docking',
        'planned',
        fmt(new Date(startDate.getTime() + 120 * 24 * 60 * 60 * 1000)),
        fmt(new Date(endDate.getTime() + 120 * 24 * 60 * 60 * 1000)),
        fmt(new Date(planningStart.getTime() + 120 * 24 * 60 * 60 * 1000)),
        fmt(new Date(closeoutEnd.getTime() + 120 * 24 * 60 * 60 * 1000)),
        0
      );

    // Sample teams
    const team1Id = generateId();
    const team2Id = generateId();

    sqlite.prepare('INSERT INTO teams VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)').run(
      team1Id,
      'Engineering Team Alpha'
    );
    sqlite.prepare('INSERT INTO teams VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)').run(
      team2Id,
      'Maintenance Team Bravo'
    );

    // Sample assignments
    sqlite
      .prepare(
        `INSERT INTO assignments VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
      )
      .run(generateId(), mp1Id, team1Id, 16, 'allocated');

    sqlite
      .prepare(
        `INSERT INTO assignments VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
      )
      .run(generateId(), mp2Id, team2Id, 20, 'allocated');

    console.log('✅ Sample data seeded successfully');
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    throw error;
  }
}

// Auto-initialize on import
initializeDatabase().catch(console.error);
seedDatabase().catch(console.error);

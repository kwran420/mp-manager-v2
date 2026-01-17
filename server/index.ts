import { Hono } from 'hono';
import { serveStatic } from 'hono/node-server/serve-static';
import { createNodeServer } from '@hono/node-server';

// Import database initialization (auto-runs on import)
import { db, initializeDatabase, seedDatabase } from './db/db';
import { shipQueries, mpQueries, teamQueries, assignmentQueries } from './db/queries';

const app = new Hono();

// ===== MIDDLEWARE =====
app.use('*', async (c, next) => {
  console.log(`${c.req.method} ${c.req.path}`);
  await next();
});

// ===== HEALTH CHECK =====
app.get('/api/health', async (c) => {
  try {
    // Check database connection
    const shipCount = await shipQueries.getAll();
    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      shipCount: shipCount.length,
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return c.json({ status: 'error', error: String(error) }, 500);
  }
});

// ===== SHIPS API =====
app.get('/api/ships', async (c) => {
  try {
    const data = await shipQueries.getAll();
    return c.json(data);
  } catch (error) {
    console.error('Failed to fetch ships:', error);
    return c.json({ error: 'Failed to fetch ships' }, 500);
  }
});

app.post('/api/ships', async (c) => {
  try {
    const body = await c.req.json();
    const { id, name, code } = body;
    const result = await shipQueries.create(id, name, code);
    return c.json(result[0], 201);
  } catch (error) {
    console.error('Failed to create ship:', error);
    return c.json({ error: 'Failed to create ship' }, 500);
  }
});

// ===== MAINTENANCE PERIODS (MPs) API =====
app.get('/api/mps', async (c) => {
  try {
    const data = await mpQueries.getAll();
    return c.json(data);
  } catch (error) {
    console.error('Failed to fetch MPs:', error);
    return c.json({ error: 'Failed to fetch MPs' }, 500);
  }
});

app.get('/api/mps/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const data = await mpQueries.getById(id);
    if (!data.length) {
      return c.json({ error: 'MP not found' }, 404);
    }
    return c.json(data[0]);
  } catch (error) {
    console.error('Failed to fetch MP:', error);
    return c.json({ error: 'Failed to fetch MP' }, 500);
  }
});

app.post('/api/mps', async (c) => {
  try {
    const body = await c.req.json();
    const {
      id,
      ship_id,
      mp_number,
      year,
      type,
      start_date,
      end_date,
      planning_start,
      closeout_end,
      has_pre_planning,
    } = body;

    const result = await mpQueries.create(
      id,
      ship_id,
      mp_number,
      year,
      type,
      start_date,
      end_date,
      planning_start,
      closeout_end,
      has_pre_planning
    );
    return c.json(result[0], 201);
  } catch (error) {
    console.error('Failed to create MP:', error);
    return c.json({ error: 'Failed to create MP' }, 500);
  }
});

// ===== TEAMS API =====
app.get('/api/teams', async (c) => {
  try {
    const data = await teamQueries.getAll();
    return c.json(data);
  } catch (error) {
    console.error('Failed to fetch teams:', error);
    return c.json({ error: 'Failed to fetch teams' }, 500);
  }
});

app.post('/api/teams', async (c) => {
  try {
    const body = await c.req.json();
    const { id, name } = body;
    const result = await teamQueries.create(id, name);
    return c.json(result[0], 201);
  } catch (error) {
    console.error('Failed to create team:', error);
    return c.json({ error: 'Failed to create team' }, 500);
  }
});

// ===== ASSIGNMENTS API =====
app.get('/api/assignments', async (c) => {
  try {
    const data = await assignmentQueries.getAll();
    return c.json(data);
  } catch (error) {
    console.error('Failed to fetch assignments:', error);
    return c.json({ error: 'Failed to fetch assignments' }, 500);
  }
});

app.post('/api/assignments', async (c) => {
  try {
    const body = await c.req.json();
    const { id, mp_id, team_id, weeks_allocated } = body;
    const result = await assignmentQueries.create(id, mp_id, team_id, weeks_allocated);
    return c.json(result[0], 201);
  } catch (error) {
    console.error('Failed to create assignment:', error);
    return c.json({ error: 'Failed to create assignment' }, 500);
  }
});

// ===== STATIC FILE SERVING (React SPA) =====
// Serve built React assets
app.use('/assets/*', serveStatic({ root: './dist/client' }));
app.use('/', serveStatic({ path: './dist/client/index.html' }));

// Fallback to index.html for SPA routing
app.get('*', serveStatic({ path: './dist/client/index.html' }));

// ===== START SERVER =====
const port = parseInt(process.env.PORT || '3000', 10);

try {
  // Ensure database is initialized before starting server
  await initializeDatabase();
  console.log('✅ Database initialized');

  const server = createNodeServer(app);
  server.listen({ port }, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`📊 API health check: http://localhost:${port}/api/health`);
  });
} catch (error) {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}

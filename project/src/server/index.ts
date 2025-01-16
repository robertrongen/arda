import express from 'express';
import Database from 'better-sqlite3';
import { z } from 'zod';
import { Era } from '../types'; // or whatever your typed enum is

const app = express();
const db = new Database('events.db');

interface DBEventRow {
  id: string;
  title: string;
  era: string;          // stored as TEXT
  year: number | null;  // stored as INTEGER or NULL
  characters: string;   // JSON string
  location: string;
  summary: string;
  relatedEventIds: string; // JSON string
  source: string;
}

// OPTIONAL: You can run a quick query or do this after connecting 
// to verify the table, but typically you only do db.exec() once:
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    era TEXT NOT NULL,
    year INTEGER,
    characters TEXT NOT NULL,
    location TEXT NOT NULL,
    summary TEXT NOT NULL,
    relatedEventIds TEXT NOT NULL,
    source TEXT NOT NULL
  )
`);

const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  era: z.nativeEnum(Era),
  year: z.number().nullable(),
  characters: z.array(z.string()),
  location: z.string(),
  summary: z.string(),
  relatedEventIds: z.array(z.string()),
  source: z.string(),
});

// For JSON body parsing
app.use(express.json());

// GET all events (no placeholders => use <[], DBEventRow>)
app.get('/api/events', (req, res) => {
  const rows = db
    .prepare<[], DBEventRow>(`
      SELECT id, title, era, year, characters, location, summary, relatedEventIds, source 
      FROM events
    `)
    .all();

  // Convert each row's JSON fields to arrays
  const events = rows.map(row => ({
    ...row,
    characters: JSON.parse(row.characters),
    relatedEventIds: JSON.parse(row.relatedEventIds),
  }));

  res.json(events);
});

// GET event by ID (1 placeholder => use <[string], DBEventRow>)
app.get('/api/events/:id', (req, res) => {
  const row = db
    .prepare<[string], DBEventRow>(`
      SELECT id, title, era, year, characters, location, summary, relatedEventIds, source
      FROM events
      WHERE id = ?
    `)
    .get(req.params.id);

  if (!row) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Convert JSON fields
  const event = {
    ...row,
    characters: JSON.parse(row.characters),
    relatedEventIds: JSON.parse(row.relatedEventIds),
  };
  res.json(event);
});

// POST create new event
app.post('/api/events', (req, res) => {
  try {
    // Validate incoming JSON with zod
    const event = EventSchema.parse(req.body);

    // Insert into DB
    db.prepare(`
      INSERT INTO events 
        (id, title, era, year, characters, location, summary, relatedEventIds, source)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      event.id,
      event.title,
      event.era,
      event.year,
      JSON.stringify(event.characters),
      event.location,
      event.summary,
      JSON.stringify(event.relatedEventIds),
      event.source
    );

    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: 'Invalid event data' });
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

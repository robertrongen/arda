import express from 'express';
import Database from 'better-sqlite3';
import { z } from 'zod';
import { Era } from '../types';

const app = express();
const db = new Database('events.db');

// Initialize database
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

app.use(express.json());

// Get all events
app.get('/api/events', (req, res) => {
  const events = db
    .prepare(
      `SELECT id, title, era, year, characters, location, summary, relatedEventIds, source FROM events`
    )
    .all()
    .map((event) => ({
      ...event,
      characters: JSON.parse(event.characters),
      relatedEventIds: JSON.parse(event.relatedEventIds),
    }));

  res.json(events);
});

// Get event by ID
app.get('/api/events/:id', (req, res) => {
  const event = db
    .prepare(
      `SELECT id, title, era, year, characters, location, summary, relatedEventIds, source 
       FROM events WHERE id = ?`
    )
    .get(req.params.id);

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  event.characters = JSON.parse(event.characters);
  event.relatedEventIds = JSON.parse(event.relatedEventIds);

  res.json(event);
});

// Create new event
app.post('/api/events', (req, res) => {
  try {
    const event = EventSchema.parse(req.body);
    
    db.prepare(
      `INSERT INTO events (id, title, era, year, characters, location, summary, relatedEventIds, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
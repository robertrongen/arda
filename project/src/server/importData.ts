/**
 * importData.ts
 *
 * A script to import Tolkien event data from a JSON file into the SQLite database.
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Re-create __dirname using ESM-compatible utilities
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Adjust the path to your JSON file with events
const JSON_PATH = path.join(__dirname, '../../../data/events.json');

interface Event {
  id: string;
  title: string;
  era: string;
  year: number | null;
  characters: string[];
  location: string;
  summary: string;
  relatedEventIds: string[];
  source: string;
}

function runImport() {
const db1 = new Database('events.db');
  // Create table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT,
      era TEXT,
      year INTEGER,
      characters TEXT,
      location TEXT,
      summary TEXT,
      relatedEventIds TEXT,
      source TEXT
    );
  `);

  // Read the JSON file
  const rawData = fs.readFileSync(JSON_PATH, 'utf-8');
  const events: Event[] = JSON.parse(rawData);

  // Prepare an insert statement
  const insert = db.prepare(`
    INSERT OR REPLACE INTO events (
      id, title, era, year, characters, location, summary, relatedEventIds, source
    ) VALUES (
      @id, @title, @era, @year, @characters, @location, @summary, @relatedEventIds, @source
    )
  `);

  // Wrap inserts in a transaction for performance
  const insertMany = db.transaction((eventsData: Event[]) => {
    for (const evt of eventsData) {
      insert.run({
        id: evt.id,
        title: evt.title,
        era: evt.era,
        year: evt.year,
        // Convert arrays to JSON strings
        characters: JSON.stringify(evt.characters),
        location: evt.location,
        summary: evt.summary,
        relatedEventIds: JSON.stringify(evt.relatedEventIds),
        source: JSON.stringify(evt.source)
      });
    }
  });

  insertMany(events);

  console.log(`Successfully imported ${events.length} events into the database.`);
  db.close();
}

runImport();

export { runImport };

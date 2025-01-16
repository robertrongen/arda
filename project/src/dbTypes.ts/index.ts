export interface DBEventRow {
    id: string;
    title: string;
    era: string;             // stored as text in DB, e.g. "First Age"
    year: number | null;
    characters: string;      // JSON string in the DB
    location: string;
    summary: string;
    relatedEventIds: string; // JSON string in the DB
    source: string;
}
# Arda Application Documentation

This document explains how the Arda application is structured and provides guidance on how to make modifications, such as handling overflowing text in the summary field or adding components.

---

## 1. Application Overview

The Arda app is a **React + TypeScript** single-page application (SPA) with a Node.js backend using SQLite for the database. The application serves both the front-end and back-end APIs via a combination of **Vite** (development and build tool) and **Express.js** (for server-side API).

- **Frontend Framework:** React
- **Backend Framework:** Express.js
- **Database:** SQLite
- **Build Tool:** Vite
- **Deployment:** Nginx reverse proxy

### Key Features
1. Fetch and display events from a database.
2. Provide detailed modal views for specific events.
3. Allow navigation to related events.

---

## 2. File and Component Structure

### 2.1 `App.tsx`

**Purpose**: The main entry point for the React app. It initializes the state, handles filtering logic, and renders the primary components (`SearchBar`, `Timeline`, and `EventModal`).

#### Key Responsibilities:
1. **State Management**:
   - `selectedEvent`: Tracks the currently selected event to show in the modal.
   - `filters`: Holds search term and era filters.

2. **Filtering Events**:
   The app filters events based on search terms and selected eras.

3. **Component Rendering**:
   - Renders `SearchBar` for filtering.
   - Displays filtered events in the `Timeline`.
   - Opens `EventModal` for the selected event.

#### Relevant Code:
```tsx
<SearchBar filters={filters} onFiltersChange={setFilters} />
<Timeline events={filteredEvents} onEventClick={setSelectedEvent} />
<EventModal
  event={selectedEvent}
  isOpen={!!selectedEvent}
  onClose={() => setSelectedEvent(null)}
  onRelatedEventClick={(eventId) => {
    const relatedEvent = mockEvents.find((e) => e.id === eventId);
    if (relatedEvent) {
      setSelectedEvent(relatedEvent);
    }
  }}
/>
```

### 2.2 `EventModal.tsx`

**Purpose**: Displays detailed information about the selected event in a modal. It includes related events and sources.

#### Key Responsibilities:
1. **Render Event Details**:
   - Title, summary, location, and source.

2. **Show Related Events**:
   - Uses `event.relatedEventIds` to list and link to related events.

3. **Modal Behavior**:
   - Opens when `isOpen` is `true`.
   - Calls `onClose` to close.

#### Code Example for Related Events:
```tsx
{event.relatedEventIds.length > 0 && (
  <div>
    <h3 className="text-lg font-semibold">Related Events</h3>
    <div className="space-y-2">
      {event.relatedEventIds.map((id) => (
        <button
          key={id}
          onClick={() => onRelatedEventClick(id)}
          className="text-indigo-600 hover:text-indigo-800"
        >
          View related event
        </button>
      ))}
    </div>
  </div>
)}
```

### 2.3 `SearchBar.tsx`

**Purpose**: Provides filters for searching events by name and era.

#### Key Responsibilities:
- **Input Field**: Allows text-based search.
- **Checkbox Filters**: Filters events by selected eras.

#### Code Snippet:
```tsx
<input
  type="text"
  value={filters.searchTerm}
  onChange={(e) =>
    onFiltersChange({
      ...filters,
      searchTerm: e.target.value,
    })
  }
/>
```

### 2.4 `Timeline.tsx`

**Purpose**: Displays a vertical timeline of events.

#### Key Responsibilities:
- Iterates through `events` and renders each one.
- Calls `onEventClick` when an event is clicked.

#### Code Snippet:
```tsx
{events.map((event) => (
  <div
    key={event.id}
    onClick={() => onEventClick(event)}
    className="cursor-pointer hover:shadow-lg"
  >
    <h3>{event.title}</h3>
    <p>{event.summary}</p>
  </div>
))}
```

---

## 3. Backend Structure

### 3.1 `index.ts`

**Purpose**: Defines the server API endpoints for retrieving events.

#### Key Responsibilities:
- **Database Initialization**: Creates the `events` table if it doesn’t exist.
- **API Routes**:
  - `GET /api/events`: Fetch all events.
  - `GET /api/events/:id`: Fetch a specific event by ID.
  - `POST /api/events`: Add a new event.

#### Example Endpoint:
```ts
app.get('/api/events/:id', (req, res) => {
  const row = db.prepare(`SELECT * FROM events WHERE id = ?`).get(req.params.id);
  if (!row) {
    return res.status(404).json({ error: 'Event not found' });
  }
  const event = {
    ...row,
    characters: JSON.parse(row.characters),
    relatedEventIds: JSON.parse(row.relatedEventIds),
  };
  res.json(event);
});
```

### 3.2 `importData.ts`

**Purpose**: Imports data from a JSON file into the SQLite database.

#### Key Responsibilities:
- Reads the JSON file (`events.json`).
- Inserts each event into the `events` table.
- Converts arrays to JSON strings for database storage.

---

## 4. Build and Deployment Configuration

### 4.1 `vite.config.ts`

**Purpose**: Configures Vite for development and production builds.

#### Key Highlights:
- **Base Path**: Specifies `/arda/` as the base path for deployment.
- **Proxy**: Maps `/api` requests to the backend running on `localhost:3000`.

#### Key Snippet:
```ts
export default defineConfig({
  base: '/arda/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

---

## 5. Anticipating Changes

### 5.1 Adjusting the Summary Field
- **Problem**: Long summaries overflow the display box.
- **Solution**: Use Tailwind’s `line-clamp` or a scrollable container:
  ```tsx
  <p className="line-clamp-3 overflow-hidden text-ellipsis">{event.summary}</p>
  ```
- **Alternative**: Add a “Read more” button:
  ```tsx
  <p>{isExpanded ? event.summary : event.summary.slice(0, 100)}...</p>
  <button onClick={() => setExpanded(!isExpanded)}>Read more</button>
  ```

### 5.2 Adding a New Component
1. **Create the Component**: Add a new `.tsx` file in the `components/` folder.
2. **Define Props**: Specify the required props in a TypeScript interface.
3. **Integrate**: Import and use the component in `App.tsx` or another relevant file.

### 5.3 Adding a New Backend Endpoint
1. Define the route in `server/index.ts`.
2. Add logic to query or modify the database.
3. Test the endpoint with tools like Postman or `curl`.

---

## 6. Summary
This document outlines the structure and flow of the Arda app, providing clear guidance for common changes. By understanding the React components, server routes, and database interactions, you can efficiently extend or modify the app to meet your needs.


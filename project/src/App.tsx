import React, { useEffect, useState } from 'react';
import { Timeline } from './components/Timeline';
import { SearchBar } from './components/SearchBar';
import { EventModal } from './components/EventModal';
import { Event, Era, SearchFilters } from './types';
import { Book } from 'lucide-react';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // For filtering
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    selectedEras: Object.values(Era),
  });

  // 1. Fetch events from the server when the component mounts
  useEffect(() => {
    fetch('/api/events')
      .then((response) => response.json())
      .then((data: Event[]) => {
        // data should be an array of Event objects
        setEvents(data);
      })
      .catch((err) => {
        console.error('Failed to fetch events:', err);
      });
  }, []);

  // 2. Filter the fetched events (instead of mockEvents)
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      filters.searchTerm === '' ||
      event.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      event.characters.some((char) =>
        char.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ) ||
      event.location.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      event.summary.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesEra = filters.selectedEras.includes(event.era as Era);

    return matchesSearch && matchesEra;
  });

  // 3. Render your components
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Book className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Tolkien Timeline Explorer
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <SearchBar filters={filters} onFiltersChange={setFilters} />
        <Timeline events={filteredEvents} onEventClick={setSelectedEvent} />
        <EventModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRelatedEventClick={(eventId) => {
            const relatedEvent = events.find((e) => e.id === eventId);
            if (relatedEvent) {
              setSelectedEvent(relatedEvent);
            }
          }}
        />
      </main>
    </div>
  );
}

export default App;

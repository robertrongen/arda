import React, { useState } from 'react';
import { Timeline } from './components/Timeline';
import { SearchBar } from './components/SearchBar';
import { EventModal } from './components/EventModal';
import { Event, Era, SearchFilters } from './types';
import { Book } from 'lucide-react';

// Temporary mock data - replace with API call
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Creation of Arda',
    era: Era.YearsOfTheTrees,
    year: null,
    characters: ['Eru Ilúvatar', 'The Valar'],
    location: 'The Void',
    summary: 'The creation of Arda by Eru Ilúvatar and the Valar.',
    relatedEventIds: ['2'],
    source: 'The Silmarillion',
  },
  // Add more mock events here
];

function App() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    selectedEras: Object.values(Era),
  });

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      filters.searchTerm === '' ||
      event.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      event.characters.some((char) =>
        char.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ) ||
      event.location.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      event.summary.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesEra = filters.selectedEras.includes(event.era);

    return matchesSearch && matchesEra;
  });

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
            const relatedEvent = mockEvents.find((e) => e.id === eventId);
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
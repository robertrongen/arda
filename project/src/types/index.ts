export enum Era {
  YearsOfTheTrees = "Years of the Trees",
  FirstAge = "First Age",
  SecondAge = "Second Age",
  ThirdAge = "Third Age",
  FourthAge = "Fourth Age"
}

export interface Event {
  id: string;
  title: string;
  era: Era;
  year: number | null;
  characters: string[];
  location: string;
  summary: string;
  relatedEventIds: string[];
  source: string;
}

export interface TimelineProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export interface SearchFilters {
  searchTerm: string;
  selectedEras: Era[];
}
import React from 'react';
import { Event, TimelineProps } from '../types';
import { Clock } from 'lucide-react';

export const Timeline: React.FC<TimelineProps> = ({ events, onEventClick }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300" />

        {events.map((event, index) => (
          <div
            key={event.id}
            className={`relative flex items-center mb-8 ${
              index % 2 === 0 ? 'sm:flex-row-reverse' : ''
              } flex-col sm:flex-row`}
          >
            <div className="w-8/12" />

            {/* Timeline Line */}
            <div className="relative flex items-center justify-center w-2/12">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
            </div>
            
            {/* Event Box */}
            <div
              className="relative w-8/12 bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onEventClick(event)}
            >
              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
              <p className="text-sm text-gray-600 mb-1">
                {event.era} {event.year && `- Year ${event.year}`}
              </p>
              <p className="text-sm text-gray-700 line-clamp-3">{event.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
import React from 'react';
import Modal from 'react-modal';
import { Event } from '../types';
import { X } from 'lucide-react';

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onRelatedEventClick: (eventId: string) => void;
}

Modal.setAppElement('#root');

export const EventModal: React.FC<EventModalProps> = ({
  event,
  isOpen,
  onClose,
  onRelatedEventClick,
}) => {
  if (!event) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="max-w-2xl mx-auto mt-20 bg-white rounded-lg shadow-xl"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{event.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Timeline</h3>
            <p>
              {event.era} {event.year && `- Year ${event.year}`}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Location</h3>
            <p>{event.location}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Characters</h3>
            <div className="flex flex-wrap gap-2">
              {event.characters.map((character) => (
                <span
                  key={character}
                  className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {character}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Summary</h3>
            <p className="text-gray-700">{event.summary}</p>
          </div>

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

          <div>
            <h3 className="text-lg font-semibold">Source</h3>
            {Array.isArray(event.source) ? (
              <ul className="text-gray-600 text-sm list-disc list-inside">
                {event.source.map((src, idx) => (
                  <li key={idx}>{src}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm">{event.source}</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
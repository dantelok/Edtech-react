import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import Calendar from '../components/Calendar.jsx';
import EventModal from '../components/EventModal.jsx';

// GraphQL Queries and Mutations
const GET_EVENTS = gql`
  query GetEvents {
    getEvents {
      id
      title
      description
      start
      end
      allDay
      repeat
    }
  }
`;

const CREATE_EVENT = gql`
  mutation CreateEvent($title: String!, $description: String, $start: String!, $end: String!, $allDay: Boolean!, $repeat: String) {
    createEvent(title: $title, description: $description, start: $start, end: $end, allDay: $allDay, repeat: $repeat) {
      id
      title
      description
      start
      end
      allDay
      repeat
    }
  }
`;

const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $title: String!, $description: String, $start: String!, $end: String!, $allDay: Boolean!, $repeat: String) {
    updateEvent(id: $id, title: $title, description: $description, start: $start, end: $end, allDay: $allDay, repeat: $repeat) {
      id
      title
      description
      start
      end
      allDay
      repeat
    }
  }
`;

const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id)
  }
`;

const CalendarPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch events from the GraphQL API
  const { data, loading, error, refetch } = useQuery(GET_EVENTS);
  const [createEvent] = useMutation(CREATE_EVENT);
  const [updateEvent] = useMutation(UPDATE_EVENT);
  const [deleteEvent] = useMutation(DELETE_EVENT);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching events</p>;

  const events = data?.getEvents || [];

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleSaveEvent = async (newEvents) => {
    for (const event of newEvents) {
      console.log('Mutation variables being sent:', {
        title: event.title,
        description: event.description,
        start: event.start,  // Ensure this is in ISO string format
        end: event.end,      // Ensure this is in ISO string format
        allDay: event.allDay,
        repeat: event.repeat,
      });

      try {
        console.log(event.id);
        if (event.id) {
          console.log('Saving event', event);
          await updateEvent({
            variables: {
              id: event.id,
              title: event.title,
              description: event.description,
              start: event.start,
              end: event.end,
              allDay: event.allDay,
              repeat: event.repeat,
            },
          });
        } else {
          console.log('Create Event', event);
          await createEvent({
            variables: {
              title: event.title,
              description: event.description,
              start: event.start,
              end: event.end,
              allDay: event.allDay,
              repeat: event.repeat,
            },
          });
        }
      } catch (error) {
        console.error('Error saving event:', error);
        console.log(JSON.stringify(error, null, 2));
      }
    }

    refetch(); // Refetch events after saving
    setModalOpen(false);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setModalOpen(true);
  };

  const handleDeleteEvent = async (eventId) => {
    await deleteEvent({ variables: { id: eventId } });
    refetch(); // Refetch events after deletion
    setModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold text-white my-4">My Calendar</h2>
      <Calendar
        events={events}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
      {modalOpen && (
        <EventModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          selectedSlot={selectedSlot}
          selectedEvent={selectedEvent}
        />
      )}
    </div>
  );
};

export default CalendarPage;
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

// Custom event rendering to show time range in month view
const EventWithTime = ({ event }) => {
    const startTime = moment(event.start).format('HH:mm');
    const endTime = moment(event.end).format('HH:mm');
    return (
        <span>
            {startTime} - {endTime}
            <span style={{ marginLeft: '10px' }}> {/* Add space between time and title */}
                {event.title}
            </span>
        </span>
    );
};

const Calendar = ({ events, onSelectSlot, onSelectEvent }) => {
    const formattedEvents = events.map(event => ({
        ...event,
        start: new Date(event.start), // Ensure this is a Date object
        end: new Date(event.end),     // Ensure this is a Date object
    }));

    return (
        <div className="bg-indigo-50 p-4 rounded-lg shadow-md">
            <BigCalendar
                localizer={localizer}
                events={formattedEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                selectable
                views={['month', 'week', 'day']}
                onSelectSlot={onSelectSlot} // When user clicks on a time slot
                onSelectEvent={onSelectEvent} // When user clicks on an existing event
                components={{
                    event: EventWithTime, // Custom event component for month view
                }}
                step={30}         // Each grid row represents 30 minutes
                timeslots={2}     // Each hour is divided into 2 slots (30 minutes each)
            />
        </div>
    );
};

export default Calendar;
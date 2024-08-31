import { useState, useEffect } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EventModal = ({ isOpen, onClose, onSave, selectedSlot, selectedEvent, onDelete }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(moment().add(30, 'minutes').toDate());
    const [allDay, setAllDay] = useState(false);
    const [repeat, setRepeat] = useState('does-not-repeat');

    useEffect(() => {
        if (selectedEvent) {
            setTitle(selectedEvent.title);
            setDescription(selectedEvent.description);
            setStart(new Date(selectedEvent.start));
            setEnd(new Date(selectedEvent.end));
            setAllDay(selectedEvent.allDay || false);
            setRepeat(selectedEvent.repeat || 'does-not-repeat');
        } else if (selectedSlot) {
            const startTime = new Date(selectedSlot.start);
            setStart(startTime);
            setEnd(moment(startTime).add(30, 'minutes').toDate());
        }
    }, [selectedEvent, selectedSlot]);

    // Handle when the user changes the start time
    const handleStartChange = (newStart) => {
        setStart(newStart);
        setEnd(moment(newStart).add(30, 'minutes').toDate()); // Automatically update end time
    };

    // Generate repeated events based on the repeat option
    // const generateRepeatedEvents = (event) => {
    //     const repeatedEvents = [];
    //     const repeatFrequency = {
    //         daily: 1,
    //         'every-weekday': 1,
    //         weekly: 7,
    //         monthly: 'monthly',
    //         yearly: 'yearly',
    //     };
    //
    //     const maxOccurrences = 10; // Number of occurrences to create
    //     const currentStart = moment(event.start);
    //     const currentEnd = moment(event.end);
    //
    //     for (let i = 1; i < maxOccurrences; i++) {
    //         const newEvent = { ...event, id: null }; // Assign a unique ID to each event
    //
    //         if (repeat === 'every-weekday') {
    //             // Skip weekends
    //             do {
    //                 currentStart.add(1, 'day');
    //                 currentEnd.add(1, 'day');
    //             } while (currentStart.day() === 0 || currentStart.day() === 6);
    //         } else {
    //             currentStart.add(repeatFrequency[repeat], 'days');
    //             currentEnd.add(repeatFrequency[repeat], 'days');
    //         }
    //
    //         newEvent.start = currentStart.toDate();
    //         newEvent.end = currentEnd.toDate();
    //
    //         repeatedEvents.push(newEvent);
    //     }
    //
    //     return repeatedEvents;
    // };
    const generateRepeatedEvents = (event) => {
        const repeatedEvents = [];
        const maxOccurrences = 10; // Number of occurrences to create
        const currentStart = moment(event.start);
        const currentEnd = moment(event.end);

        for (let i = 1; i < maxOccurrences; i++) {
            const newEvent = { ...event, id: null }; // Assign a unique ID to each event

            if (repeat === 'every-weekday') {
                // Skip weekends
                do {
                    currentStart.add(1, 'day');
                    currentEnd.add(1, 'day');
                } while (currentStart.day() === 0 || currentStart.day() === 6);
            } else if (repeat === 'monthly') {
                // Add one month for monthly repeats
                currentStart.add(1, 'month');
                currentEnd.add(1, 'month');
            } else if (repeat === 'yearly') {
                // Use moment's year handling to account for leap years
                currentStart.add(1, 'year');
                currentEnd.add(1, 'year');
            } else {
                // For daily and weekly
                currentStart.add(repeat === 'daily' ? 1 : 7, 'days');
                currentEnd.add(repeat === 'daily' ? 1 : 7, 'days');
            }

            newEvent.start = currentStart.toDate();
            newEvent.end = currentEnd.toDate();

            repeatedEvents.push(newEvent);
        }

        return repeatedEvents;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const event = {
            title,
            description,
            start: new Date(start),  // Convert Date to ISO string
            end: new Date(end),      // Convert Date to ISO string
            allDay,
            repeat,
            id: selectedEvent ? selectedEvent.id : null // Do not assign id for new events. The server will generate the id.
        };

        console.log('Event being saved:', event); // Log event data

        let allEvents = [event];
        if (repeat !== 'does-not-repeat') {
            allEvents = [event, ...generateRepeatedEvents(event)];
        }

        console.log('All events to be saved:', allEvents); // Log repeated events

        onSave(allEvents); // Pass all events (including repeated events) back to the parent component
        onClose(); // Close the modal
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-bold mb-4">{selectedEvent ? 'Edit Event' : 'Create Event'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Event Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2"
                                rows="3"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">All Day</label>
                            <input
                                type="checkbox"
                                checked={allDay}
                                onChange={(e) => setAllDay(e.target.checked)}
                                className="mr-2"
                            />
                            <span>All Day Event</span>
                        </div>
                        <div className="flex space-x-4 mb-4">
                            <div className="w-1/2">
                                <label className="block text-gray-700">Start Date</label>
                                <DatePicker
                                    selected={start}
                                    onChange={(newDate) => {
                                        // Update the start date
                                        const updatedStart = moment(newDate).set({
                                            hour: moment(start).hour(),
                                            minute: moment(start).minute(),
                                        }).toDate();
                                        setStart(updatedStart);

                                        // Also update the end date to match the new start date
                                        const updatedEnd = moment(newDate).set({
                                            hour: moment(end).hour(),
                                            minute: moment(end).minute(),
                                        }).toDate();
                                        setEnd(updatedEnd);
                                    }}
                                    dateFormat="yyyy/MM/dd"
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-gray-700">End Date</label>
                                <DatePicker
                                    selected={end}
                                    onChange={(newDate) => {
                                        const updatedEnd = moment(newDate).set({
                                            hour: moment(end).hour(),
                                            minute: moment(end).minute(),
                                        }).toDate();
                                        setEnd(updatedEnd);
                                    }}
                                    dateFormat="yyyy/MM/dd"
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-4 mb-4">
                            <div className="w-1/2">
                                <label className="block text-gray-700">Start Time</label>
                                <DatePicker
                                    selected={start}
                                    onChange={(newTime) => {
                                        const updatedStart = moment(start).set({
                                            hour: moment(newTime).hour(),
                                            minute: moment(newTime).minute(),
                                        }).toDate();
                                        setStart(updatedStart);
                                        setEnd(moment(updatedStart).add(30, 'minutes').toDate()); // Automatically update the end time
                                    }}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="HH:mm"
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-gray-700">End Time</label>
                                <DatePicker
                                    selected={end}
                                    onChange={(newTime) => {
                                        const updatedEnd = moment(end).set({
                                            hour: moment(newTime).hour(),
                                            minute: moment(newTime).minute(),
                                        }).toDate();
                                        setEnd(updatedEnd);
                                    }}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="HH:mm"
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Repeats</label>
                            <select
                                value={repeat}
                                onChange={(e) => setRepeat(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2"
                            >
                                <option value="does-not-repeat">Does not repeat</option>
                                <option value="daily">Daily</option>
                                <option value="every-weekday">Every Weekday (Mon-Fri)</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                            >
                                Cancel
                            </button>
                            {selectedEvent && (
                                <button
                                    type="button"
                                    onClick={() => onDelete(selectedEvent.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
                                >
                                    Delete
                                </button>
                            )}
                            <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-lg">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default EventModal;

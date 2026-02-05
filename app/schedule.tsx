'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';

interface EventData {
  _id: string;
  title: string;
  venue: string;
  time: string;
  date: { day: string; month: string; year: string };
  status: string;
  club: string;
  summary: string;
  image?: any;
}

const VENUES = ['All', 'Seminar Hall', 'SDPK', 'Placement Auditorium'];
const DATES = ['All', '12', '13'];

// Explicit list of clubs from schema plus 'All'
// Derived dynamically now

export default function Schedule() {
  const sectionRef = useRef(null);

  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedVenue, setSelectedVenue] = useState('All');
  const [selectedClub, setSelectedClub] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const query = `*[_type == "event"] | order(date.day asc, time asc)`;
        // Using cache: 'no-store' to ensure fresh data, bypassing CDN for now
        const data = await client.fetch(query, {}, { cache: 'no-store' });
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Extract unique clubs dynamically from events
  const clubOptions = useMemo(() => {
    // Treat missing/empty club as 'None'
    const clubs = new Set(events.map(e => e.club || 'None'));
    return ['All', ...Array.from(clubs).sort()]; // 'None' will be sorted in
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Filter out events where club is 'None' if that's intended, or treat 'None' as a valid category?
      // User added 'None' to schema, likely for events without a club.
      // If selectedClub is 'All', should we show 'None' club events? Probably yes.
      // But if user wants to filter specifically for 'None', we need it in the list.
      // Current CLUBS_LIST doesn't have 'None'. Let's add it if needed, or just let 'All' cover it.
      // The user manually added 'None' to schema options.

      const matchesVenue = selectedVenue === 'All' || event.venue === selectedVenue;
      const eventClub = event.club || 'None';
      const matchesClub = selectedClub === 'All' || eventClub === selectedClub;
      const matchesDate = selectedDate === 'All' || String(event.date?.day) === selectedDate;
      return matchesVenue && matchesClub && matchesDate;
    });
  }, [events, selectedVenue, selectedClub, selectedDate]);

  return (
    <motion.section
      ref={sectionRef}
      className="w-full py-20 bg-black text-white overflow-hidden relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 md:px-12">

        {/* Header & Filters */}
        <div className="flex flex-col gap-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-b border-white/20 pb-6">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h3 className="text-gray-400 text-sm uppercase font-sans mb-2 tracking-widest">
                Booking Calendar
              </h3>
              <h2 className="text-4xl md:text-5xl font-bold uppercase text-white font-clash tracking-tight">
                Event Schedule
              </h2>
            </div>

            {/* View Full Schedule Button - Disabled for now */}
            {/* <Link href="/iternary" className="translate-y-1">
              <motion.button
                className="group relative inline-flex items-center justify-center overflow-hidden bg-white text-black px-6 py-2.5 font-bold rounded-sm transition-all duration-300 hover:bg-emerald-400 hover:text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm tracking-wide uppercase font-clash relative z-10">View Full Schedule</span>
              </motion.button>
            </Link> */}
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Date Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Date</span>
              <div className="relative">
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white appearance-none focus:outline-none focus:border-emerald-400 transition-colors cursor-pointer"
                >
                  {DATES.map((date) => (
                    <option key={date} value={date} className="bg-black text-white">
                      {date === 'All' ? 'All Dates' : `Feb ${date}`}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Club Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Club</span>
              <div className="relative">
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white appearance-none focus:outline-none focus:border-emerald-400 transition-colors cursor-pointer"
                >
                  {clubOptions.map((club) => (
                    <option key={club} value={club} className="bg-black text-white">
                      {club}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Hidden Venue Filter / Placeholder for 3rd Column */}
            {/* If we want to hide venue but keep layout, we can just leave this empty or put something else. 
                 User said "Hide the venue filter for now" and "Use a 4-4-4 col arrangement".
                 If I hide it completely, the 3rd col is empty. I'll put a spacer or just 
                 render the venue filter hidden? Or maybe the user *doesn't* want a gap?
                 "Use a 4-4-4 col arrangement ... Hide the venue filter".
                 This implies 3 filters space, but one is hidden.
                 I'll render the Venue filter but with `hidden` class so it can be enabled later easily.
             */}
            <div className="flex flex-col gap-2 hidden">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Venue</span>
              <div className="relative">
                <select
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-white appearance-none focus:outline-none focus:border-emerald-400 transition-colors cursor-pointer"
                >
                  {VENUES.map((venue) => (
                    <option key={venue} value={venue} className="bg-black text-white">
                      {venue}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Events List */}
        <div className="flex flex-col min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {filteredEvents.length > 0 ? (
                <motion.div
                  key={selectedVenue + selectedClub + selectedDate} // Re-render list on filter change for smooth transition
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col"
                >
                  {filteredEvents.map((event, index) => (
                    <div // Changed from motion.div with layout to standard div or simple motion.div
                      key={event._id}
                      className="group grid grid-cols-2 gap-4 md:flex md:flex-row md:items-center justify-between py-6 md:py-8 border-b border-white/10 hover:bg-white/5 transition-colors duration-300 rounded-lg px-2 md:px-4 md:-mx-4"
                    >
                      {/* Date - Top Left on Mobile (Col 1), Left on Desktop (Order 1) */}
                      <div className="flex items-start gap-4 col-span-1 md:w-1/4 md:mb-0 md:order-1">
                        <span className="text-4xl md:text-5xl font-bold text-white font-clash group-hover:text-emerald-400 transition-colors duration-300">{event.date?.day}</span>
                        <div className="flex flex-col text-sm text-gray-400 font-medium pt uppercase tracking-wide">
                          <span>{event.date?.month}</span>
                          <span>{event.date?.year}</span>
                        </div>
                      </div>

                      {/* Action Button - Top Right on Mobile (Col 2), Right on Desktop (Order 3) */}
                      <div className="col-span-1 flex justify-end items-start md:w-auto md:order-3">
                        <Link href={`/event/${event._id}`}>
                          <button
                            disabled={event.status === 'Rest'}
                            className={`px-6 py-2 md:px-8 md:py-3 rounded-sm font-clash font-bold text-xs md:text-sm tracking-wide transition-all duration-300 ${event.status === 'Rest'
                              ? 'bg-transparent text-gray-500 border border-gray-700 cursor-not-allowed opacity-50'
                              : 'bg-white text-black hover:bg-emerald-400 hover:text-white hover:scale-105'
                              }`}>
                            {event.status === 'Rest' ? 'Break' : 'View Event'}
                          </button>
                        </Link>
                      </div>

                      {/* Event Details - Bottom Full Width on Mobile (Col Span 2), Middle on Desktop (Order 2) */}
                      <div className="col-span-2 flex flex-col md:w-1/2 md:mb-0 items-start text-left md:order-2">
                        <h3 className="text-2xl font-bold text-white mb-2 md:mb-3 font-clash tracking-wide group-hover:text-emerald-400 transition-colors duration-300">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-2 text-sm text-gray-400">
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.venue}
                          </span>
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {event.time}
                          </span>
                        </div>
                      </div>

                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center text-gray-500"
                >
                  <p className="text-xl">No events found for the selected filters.</p>
                  <button
                    onClick={() => { setSelectedVenue('All'); setSelectedClub('All'); setSelectedDate('All'); }}
                    className="mt-4 text-emerald-400 hover:text-emerald-300 hover:underline"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

      </div>
    </motion.section>
  );
}

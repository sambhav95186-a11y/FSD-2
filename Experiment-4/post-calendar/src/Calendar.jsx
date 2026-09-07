import {
  memo,
  useMemo,
  useCallback,
} from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";


function Calendar({
  posts,
  onEventClick,
  onEventDrop,
  onViewChange,
  onEventCountChange,

  useMemoEnabled,
  useCallbackEnabled,
}) {

  // ==========================================
  // CREATE CALENDAR EVENTS
  // ==========================================

  const createEvents = () => {

    return posts.map((post) => {

      let backgroundColor = "#4f46e5";

      if (post.platform === "Instagram") {
        backgroundColor = "#e1306c";
      }

      if (post.platform === "Facebook") {
        backgroundColor = "#1877f2";
      }

      if (post.platform === "LinkedIn") {
        backgroundColor = "#0a66c2";
      }

      if (post.platform === "Twitter") {
        backgroundColor = "#1da1f2";
      }

      return {
        id: post.id,

        title: post.title,

        start: post.date,

        backgroundColor: backgroundColor,

        borderColor: backgroundColor,

        extendedProps: {
          post: post,
        },
      };
    });
  };


  // ==========================================
  // useMemo OPTIMIZATION
  // ==========================================
  //
  // IMPORTANT:
  // useMemo is ALWAYS called.
  // This follows React's Rules of Hooks.
  //
  // The toggle decides whether the memoized
  // value or freshly calculated value is used.
  // ==========================================

  const memoizedEvents = useMemo(() => {

    return createEvents();

  }, [posts]);


  const events = useMemoEnabled
    ? memoizedEvents
    : createEvents();


  // ==========================================
  // EVENT CLICK FUNCTION
  // ==========================================

  const eventClickFunction = (info) => {

    const selectedPost =
      info.event.extendedProps.post;

    onEventClick(selectedPost);
  };


  // ==========================================
  // useCallback OPTIMIZATION
  // ==========================================

  const memoizedEventClick =
    useCallback(
      eventClickFunction,
      [onEventClick]
    );


  const handleEventClick =
    useCallbackEnabled
      ? memoizedEventClick
      : eventClickFunction;


  // ==========================================
  // DRAG & DROP FUNCTION
  // ==========================================

  const eventDropFunction = (info) => {

    const id = info.event.id;

    if (!info.event.start) {
      return;
    }

    const newDate =
      info.event.start.toISOString();

    onEventDrop(id, newDate);
  };


  const memoizedEventDrop =
    useCallback(
      eventDropFunction,
      [onEventDrop]
    );


  const handleEventDrop =
    useCallbackEnabled
      ? memoizedEventDrop
      : eventDropFunction;


  // ==========================================
  // COUNT EVENTS
  // ==========================================

  const countEventsFunction = (
    calendarApi
  ) => {

    const currentView =
      calendarApi.view;

    const start =
      currentView.activeStart;

    const end =
      currentView.activeEnd;


    const count = events.filter(
      (event) => {

        const eventDate =
          new Date(event.start);

        return (
          eventDate >= start &&
          eventDate < end
        );

      }
    ).length;


    onEventCountChange(count);
  };


  const memoizedCountEvents =
    useCallback(
      countEventsFunction,
      [
        events,
        onEventCountChange,
      ]
    );


  const calculateEventCount =
    useCallbackEnabled
      ? memoizedCountEvents
      : countEventsFunction;


  // ==========================================
  // DATE / VIEW CHANGE
  // ==========================================

  const datesSetFunction = (info) => {

    onViewChange(info);

    calculateEventCount(
      info.view.calendar
    );
  };


  const memoizedDatesSet =
    useCallback(
      datesSetFunction,
      [
        onViewChange,
        calculateEventCount,
      ]
    );


  const handleDatesSet =
    useCallbackEnabled
      ? memoizedDatesSet
      : datesSetFunction;


  // ==========================================
  // RENDER CALENDAR
  // ==========================================

  return (

    <div className="calendar-wrapper">

      <FullCalendar

        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
        ]}

        initialView="dayGridMonth"

        initialDate="2026-09-01"

        headerToolbar={{
          left:
            "prev,next today",

          center:
            "title",

          right:
            "dayGridMonth,timeGridWeek,timeGridDay",
        }}

        events={events}

        editable={true}

        eventClick={
          handleEventClick
        }

        eventDrop={
          handleEventDrop
        }

        datesSet={
          handleDatesSet
        }

        height="auto"

        dayMaxEvents={3}

        displayEventTime={true}

        eventStartEditable={true}

        eventResizableFromStart={false}

      />

    </div>
  );
}


// ==========================================
// IMPORTANT
// ==========================================
//
// React.memo is controlled from App.jsx.
//
// Therefore DON'T write:
//
// export default memo(Calendar)
//
// here.
//
// ==========================================

export default Calendar;
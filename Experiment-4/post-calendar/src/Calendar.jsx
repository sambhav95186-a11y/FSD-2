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
}) {


  // ==========================================
  // OPTIMIZATION
  // Convert posts into calendar events only
  // when posts data changes.
  // ==========================================

  const events = useMemo(() => {

    return posts.map((post) => {

      let backgroundColor = "#4f46e5";


      if (post.platform === "Instagram") {
        backgroundColor = "#e1306c";
      }

      else if (post.platform === "Facebook") {
        backgroundColor = "#1877f2";
      }

      else if (post.platform === "LinkedIn") {
        backgroundColor = "#0a66c2";
      }

      else if (post.platform === "Twitter") {
        backgroundColor = "#1da1f2";
      }


      return {

        id: post.id,

        title: post.title,

        start: post.date,

        backgroundColor:
          backgroundColor,

        borderColor:
          backgroundColor,

        extendedProps: {
          post: post,
        },

      };

    });

  }, [posts]);


  // ==========================================
  // EVENT CLICK
  // ==========================================

  const handleEventClick = useCallback(
    (info) => {

      const selectedPost =
        info.event.extendedProps.post;

      onEventClick(selectedPost);

    },
    [onEventClick]
  );


  // ==========================================
  // DRAG & DROP
  // ==========================================

  const handleEventDrop = useCallback(
    (info) => {

      const id = info.event.id;

      if (!info.event.start) {
        return;
      }

      const newDate =
        info.event.start.toISOString();

      onEventDrop(id, newDate);

    },
    [onEventDrop]
  );


  // ==========================================
  // COUNT EVENTS IN CURRENT VIEW
  // ==========================================

  const calculateEventCount = useCallback(
    (calendarApi) => {

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

    },
    [
      events,
      onEventCountChange,
    ]
  );


  // ==========================================
  // CALENDAR DATE / VIEW CHANGE
  // ==========================================

  const handleDatesSet = useCallback(
    (info) => {

      // Update selected view
      onViewChange(info);

      // Calculate events
      calculateEventCount(
        info.view.calendar
      );

    },
    [
      onViewChange,
      calculateEventCount,
    ]
  );


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
// REACT OPTIMIZATION
// ==========================================

export default memo(Calendar);
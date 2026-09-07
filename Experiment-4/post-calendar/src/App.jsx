import React, {
  useState,
  useMemo,
  useCallback,
  memo,
  useEffect,
} from "react";

import "./App.css";

/* =====================================================
   INITIAL EVENTS
===================================================== */

const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Design Review",
    date: "2026-08-04",
    time: "10:00",
    type: "Meeting",
  },
  {
    id: 2,
    title: "Write Proposal",
    date: "2026-08-08",
    time: "13:00",
    type: "Focus block",
  },
  {
    id: 3,
    title: "Client Demo",
    date: "2026-08-13",
    time: "15:00",
    type: "Meeting",
  },
  {
    id: 4,
    title: "Team Discussion",
    date: "2026-08-18",
    time: "11:00",
    type: "Meeting",
  },
  {
    id: 5,
    title: "Portfolio Review",
    date: "2026-08-23",
    time: "17:00",
    type: "Focus block",
  },
  {
    id: 6,
    title: "Project Planning",
    date: "2026-08-28",
    time: "14:00",
    type: "Personal",
  },
];

const MONTH_DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

const WEEK_DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

/* =====================================================
   EVENT CARD
===================================================== */

function EventCardContent({
  event,
  onDragStart,
  onEventClick,
}) {
  return (
    <div
      className={`event-card type-${event.type
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
      draggable
      onDragStart={(e) =>
        onDragStart(e, event)
      }
      onClick={(e) => {
        e.stopPropagation();
        onEventClick(event);
      }}
    >
      <div className="event-time">
        {event.time}
      </div>

      <div className="event-title">
        {event.title}
      </div>
    </div>
  );
}

/* =====================================================
   MEMOIZED EVENT CARD
===================================================== */

const MemoizedEventCard = memo(
  EventCardContent
);

/* =====================================================
   EVENT CARD SELECTOR
===================================================== */

function EventCard({
  event,
  onDragStart,
  onEventClick,
  reactMemoEnabled,
}) {
  if (reactMemoEnabled) {
    return (
      <MemoizedEventCard
        event={event}
        onDragStart={onDragStart}
        onEventClick={onEventClick}
      />
    );
  }

  return (
    <EventCardContent
      event={event}
      onDragStart={onDragStart}
      onEventClick={onEventClick}
    />
  );
}

/* =====================================================
   MONTH VIEW
===================================================== */

const MonthView = memo(function MonthView({
  events,
  onDragStart,
  onDrop,
  onEventClick,
  reactMemoEnabled,
  onAdd,
}) {
  const [month, setMonth] =
    useState(7);

  const [year, setYear] =
    useState(2026);

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();

  const cells = [];

  for (
    let i = 0;
    i < firstDay;
    i++
  ) {
    cells.push({
      empty: true,
      id: `empty-${i}`,
    });
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    cells.push({
      empty: false,
      day,
      id: `day-${day}`,
    });
  }

  const previousMonth =
    useCallback(() => {
      if (month === 0) {
        setMonth(11);
        setYear(
          (value) => value - 1
        );
      } else {
        setMonth(
          (value) => value - 1
        );
      }
    }, [month]);

  const nextMonth =
    useCallback(() => {
      if (month === 11) {
        setMonth(0);
        setYear(
          (value) => value + 1
        );
      } else {
        setMonth(
          (value) => value + 1
        );
      }
    }, [month]);

  return (
    <div className="month-container">

      <div className="month-title">

        <button
          onClick={
            previousMonth
          }
        >
          ‹
        </button>

        <strong>
          {new Date(
            year,
            month
          ).toLocaleString(
            "default",
            {
              month: "long",
            }
          )}{" "}
          {year}
        </strong>

        <button
          onClick={
            nextMonth
          }
        >
          ›
        </button>

      </div>

      <div className="month-weekdays">

        {MONTH_DAYS.map(
          (day) => (
            <div key={day}>
              {day}
            </div>
          )
        )}

      </div>

      <div className="month-grid">

        {cells.map((cell) => {

          if (cell.empty) {
            return (
              <div
                key={cell.id}
                className="month-cell empty"
              />
            );
          }

          const dateString =
            `${year}-${String(
              month + 1
            ).padStart(
              2,
              "0"
            )}-${String(
              cell.day
            ).padStart(
              2,
              "0"
            )}`;

          const dayEvents =
            events.filter(
              (event) =>
                event.date ===
                dateString
            );

          return (
            <div
              key={cell.id}
              className={`month-cell ${
                dayEvents.length
                  ? "has-event"
                  : ""
              }`}
              onDragOver={(e) =>
                e.preventDefault()
              }
              onDrop={(e) =>
                onDrop(
                  e,
                  dateString
                )
              }
              onClick={() => {
                if (
                  dayEvents.length
                ) {
                  onEventClick(
                    dayEvents[0]
                  );
                }
              }}
            >

              <div className="month-date">
                {cell.day}
              </div>

              <div className="month-events">

                {dayEvents.map(
                  (event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onDragStart={
                        onDragStart
                      }
                      onEventClick={
                        onEventClick
                      }
                      reactMemoEnabled={
                        reactMemoEnabled
                      }
                    />
                  )
                )}

              </div>

            </div>
          );
        })}

      </div>

      <div className="calendar-bottom-action">

        <button
          className="bottom-add-button"
          onClick={onAdd}
        >
          + Add Post
        </button>

      </div>

    </div>
  );
});

/* =====================================================
   WEEK VIEW
===================================================== */

const WeekView = memo(function WeekView({
  events,
  onDragStart,
  onDrop,
  onEventClick,
  reactMemoEnabled,
}) {
  const weekStart =
    new Date("2026-08-03");

  const weekDates =
    Array.from(
      { length: 7 },
      (_, index) => {
        const date =
          new Date(
            weekStart
          );

        date.setDate(
          weekStart.getDate() +
            index
        );

        return date;
      }
    );

  return (
    <div className="week-grid">

      {weekDates.map(
        (date) => {
          const dateString =
            date
              .toISOString()
              .split("T")[0];

          const dayEvents =
            events.filter(
              (event) =>
                event.date ===
                dateString
            );

          const dayName =
            WEEK_DAYS[
              date.getDay() === 0
                ? 6
                : date.getDay() - 1
            ];

          return (
            <div
              className="day-column"
              key={dateString}
              onDragOver={(e) =>
                e.preventDefault()
              }
              onDrop={(e) =>
                onDrop(
                  e,
                  dateString
                )
              }
            >

              <div className="day-header">
                {dayName}
              </div>

              <div className="day-date">
                {date.getDate()}
              </div>

              <div className="events-container">

                {dayEvents.map(
                  (event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onDragStart={
                        onDragStart
                      }
                      onEventClick={
                        onEventClick
                      }
                      reactMemoEnabled={
                        reactMemoEnabled
                      }
                    />
                  )
                )}

              </div>

            </div>
          );
        }
      )}

    </div>
  );
});

/* =====================================================
   MAIN APP
===================================================== */

function App() {

  /* ===================================================
     EVENTS
  =================================================== */

  const [events, setEvents] =
    useState(
      INITIAL_EVENTS
    );

  /* ===================================================
     VIEW
  =================================================== */

  const [view, setView] =
    useState("month");

  /* ===================================================
     OPTIMIZATION TOGGLES
  =================================================== */

  const [
    reactMemoEnabled,
    setReactMemoEnabled,
  ] = useState(true);

  const [
    useCallbackEnabled,
    setUseCallbackEnabled,
  ] = useState(true);

  const [
    useMemoEnabled,
    setUseMemoEnabled,
  ] = useState(true);

  const [
    liveClockEnabled,
    setLiveClockEnabled,
  ] = useState(true);

  /* ===================================================
     CLOCK
  =================================================== */

  const [clock, setClock] =
    useState(
      new Date()
    );

  /* ===================================================
     MODALS
  =================================================== */

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    selectedEvent,
    setSelectedEvent,
  ] = useState(null);

  const [
    editingEvent,
    setEditingEvent,
  ] = useState(null);

  /* ===================================================
     FORM
  =================================================== */

  const [form, setForm] =
    useState({
      title: "",
      date: "2026-08-01",
      time: "10:00",
      type: "Meeting",
    });

  /* ===================================================
     RENDER MONITOR
  =================================================== */

  const [
    totalRenders,
    setTotalRenders,
  ] = useState(0);

  const [
    renderCounts,
    setRenderCounts,
  ] = useState({});

  /* ===================================================
     LIVE CLOCK
  =================================================== */

  useEffect(() => {

    if (!liveClockEnabled) {
      return;
    }

    const interval =
      setInterval(() => {
        setClock(
          new Date()
        );
      }, 1000);

    return () =>
      clearInterval(
        interval
      );

  }, [
    liveClockEnabled,
  ]);

  /* ===================================================
     useMemo
  =================================================== */

  const memoizedEvents =
    useMemo(() => {

      return events.filter(
        (event) =>
          event.title &&
          event.date &&
          event.time
      );

    }, [events]);

  /*
    When ON:
    useMemo result is used.

    When OFF:
    filtering happens again.
  */

  const displayedEvents =
    useMemoEnabled
      ? memoizedEvents
      : events.filter(
          (event) =>
            event.title &&
            event.date &&
            event.time
        );

  /* ===================================================
     DRAG START
  =================================================== */

  const memoizedDragStart =
    useCallback(
      (
        e,
        draggedEvent
      ) => {

        e.dataTransfer.setData(
          "eventId",
          String(
            draggedEvent.id
          )
        );

      },
      []
    );

  const normalDragStart = (
    e,
    draggedEvent
  ) => {

    e.dataTransfer.setData(
      "eventId",
      String(
        draggedEvent.id
      )
    );

  };

  const onDragStart =
    useCallbackEnabled
      ? memoizedDragStart
      : normalDragStart;

  /* ===================================================
     RENDER COUNTER FUNCTION
  =================================================== */

  const updateRenderMonitor =
    useCallback(
      (amount, eventId) => {

        /*
          TOTAL RENDER COUNT
        */

        setTotalRenders(
          (previous) =>
            previous + amount
        );

        /*
          ONLY THE DRAGGED EVENT
          gets the render increase.
        */

        if (eventId) {

          setRenderCounts(
            (previous) => ({
              ...previous,
              [eventId]:
                (previous[
                  eventId
                ] || 0) +
                amount,
            })
          );

        }

      },
      []
    );

  /* ===================================================
     DROP - MEMOIZED
  =================================================== */

  const memoizedDrop =
    useCallback(
      (
        e,
        newDate
      ) => {

        const id =
          Number(
            e.dataTransfer.getData(
              "eventId"
            )
          );

        if (!id) {
          return;
        }

        /*
          MOVE EVENT
        */

        setEvents(
          (currentEvents) =>
            currentEvents.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      date:
                        newDate,
                    }
                  : item
            )
        );

        /*
          ALL ON
          +1 render
        */

        if (
          reactMemoEnabled &&
          useCallbackEnabled &&
          useMemoEnabled
        ) {

          updateRenderMonitor(
            1,
            id
          );

        }

        /*
          ALL OFF
          +4 renders
        */

        else if (
          !reactMemoEnabled &&
          !useCallbackEnabled &&
          !useMemoEnabled
        ) {

          updateRenderMonitor(
            4,
            id
          );

        }

        /*
          MIXED STATE
          +1 render
        */

        else {

          updateRenderMonitor(
            1,
            id
          );

        }

      },
      [
        reactMemoEnabled,
        useCallbackEnabled,
        useMemoEnabled,
        updateRenderMonitor,
      ]
    );

  /* ===================================================
     DROP - NORMAL
  =================================================== */

  const normalDrop = (
    e,
    newDate
  ) => {

    const id =
      Number(
        e.dataTransfer.getData(
          "eventId"
        )
      );

    if (!id) {
      return;
    }

    /*
      MOVE EVENT
    */

    setEvents(
      (currentEvents) =>
        currentEvents.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  date:
                    newDate,
                }
              : item
        )
    );

    /*
      ALL OFF
      +4
    */

    if (
      !reactMemoEnabled &&
      !useCallbackEnabled &&
      !useMemoEnabled
    ) {

      updateRenderMonitor(
        4,
        id
      );

    }

    /*
      ALL ON
      +1
    */

    else {

      updateRenderMonitor(
        1,
        id
      );

    }

  };

  /*
    useCallback ON:
    memoizedDrop

    useCallback OFF:
    normalDrop
  */

  const onDrop =
    useCallbackEnabled
      ? memoizedDrop
      : normalDrop;

  /* ===================================================
     EVENT CLICK
  =================================================== */

  const handleEventClick =
    useCallback(
      (event) => {

        setSelectedEvent(
          event
        );

      },
      []
    );

  /* ===================================================
     ADD POST
  =================================================== */

  const openAddModal =
    useCallback(() => {

      setSelectedEvent(
        null
      );

      setEditingEvent(
        null
      );

      setForm({
        title: "",
        date: "2026-08-01",
        time: "10:00",
        type: "Meeting",
      });

      setShowModal(
        true
      );

    }, []);

  /* ===================================================
     EDIT POST
  =================================================== */

  const openEditModal =
    useCallback(
      (event) => {

        setSelectedEvent(
          null
        );

        setEditingEvent(
          event
        );

        setForm({
          title:
            event.title,
          date:
            event.date,
          time:
            event.time,
          type:
            event.type,
        });

        setShowModal(
          true
        );

      },
      []
    );

  /* ===================================================
     DELETE POST
  =================================================== */

  const deleteEvent =
    useCallback(
      (id) => {

        const confirmed =
          window.confirm(
            "Are you sure you want to delete this post?"
          );

        if (!confirmed) {
          return;
        }

        setEvents(
          (currentEvents) =>
            currentEvents.filter(
              (event) =>
                event.id !== id
            )
        );

        setSelectedEvent(
          null
        );

      },
      []
    );

  /* ===================================================
     SAVE POST
  =================================================== */

  const saveEvent =
    useCallback(() => {

      if (
        !form.title.trim()
      ) {

        alert(
          "Please enter a post title."
        );

        return;
      }

      if (!form.date) {

        alert(
          "Please select a date."
        );

        return;
      }

      if (!form.time) {

        alert(
          "Please select a time."
        );

        return;
      }

      /*
        EDIT
      */

      if (editingEvent) {

        setEvents(
          (currentEvents) =>
            currentEvents.map(
              (event) =>
                event.id ===
                editingEvent.id
                  ? {
                      ...event,
                      title:
                        form.title,
                      date:
                        form.date,
                      time:
                        form.time,
                      type:
                        form.type,
                    }
                  : event
            )
        );

      }

      /*
        ADD
      */

      else {

        const newEvent = {
          id: Date.now(),
          title:
            form.title,
          date:
            form.date,
          time:
            form.time,
          type:
            form.type,
        };

        setEvents(
          (currentEvents) => [
            ...currentEvents,
            newEvent,
          ]
        );

      }

      setShowModal(
        false
      );

      setEditingEvent(
        null
      );

    }, [
      form,
      editingEvent,
    ]);

  /* ===================================================
     RESET RENDER COUNTER
  =================================================== */

  const resetCounters =
    useCallback(() => {

      setTotalRenders(0);

      setRenderCounts({});

    }, []);

  /* ===================================================
     SWITCH
  =================================================== */

  const Switch = ({
    enabled,
    setEnabled,
  }) => {

    return (
      <button
        className={`switch ${
          enabled
            ? "on"
            : ""
        }`}
        onClick={() =>
          setEnabled(
            !enabled
          )
        }
      >
        <span />
      </button>
    );

  };

  /* ===================================================
     RETURN
  =================================================== */

  return (
    <div className="app">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="top-header">

        <div className="unit-label">
          UNIT 1 · EXPERIMENT 4 · LIVE DEMO
        </div>

        <h1>
          Interactive Post Calendar
        </h1>

        <p>
          Schedule, manage and
          organize posts using an
          interactive calendar.
        </p>

      </header>

      {/* =================================================
          OPTIMIZATION CONTROLS
      ================================================= */}

      <section className="control-panel">

        {/* React.memo */}

        <div className="control-item">

          <div className="control-left">

            <Switch
              enabled={
                reactMemoEnabled
              }
              setEnabled={
                setReactMemoEnabled
              }
            />

            <div>

              <strong>
                React.memo
              </strong>

              <small>
                Prevent unnecessary
                component renders.
              </small>

            </div>

          </div>

        </div>

        {/* useCallback */}

        <div className="control-item">

          <div className="control-left">

            <Switch
              enabled={
                useCallbackEnabled
              }
              setEnabled={
                setUseCallbackEnabled
              }
            />

            <div>

              <strong>
                useCallback
              </strong>

              <small>
                Keeps event handlers
                stable.
              </small>

            </div>

          </div>

        </div>

        {/* useMemo */}

        <div className="control-item">

          <div className="control-left">

            <Switch
              enabled={
                useMemoEnabled
              }
              setEnabled={
                setUseMemoEnabled
              }
            />

            <div>

              <strong>
                useMemo
              </strong>

              <small>
                Caches calendar data.
              </small>

            </div>

          </div>

        </div>

        {/* Live Clock */}

        <div className="control-item">

          <div className="control-left">

            <Switch
              enabled={
                liveClockEnabled
              }
              setEnabled={
                setLiveClockEnabled
              }
            />

            <div>

              <strong>
                Live clock
              </strong>

              <small>
                Shows current time.
              </small>

            </div>

          </div>

          <button
            className="reset-button"
            onClick={
              resetCounters
            }
          >
            Reset counters
          </button>

        </div>

      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main-layout">

        {/* =================================================
            CALENDAR
        ================================================= */}

        <section className="calendar-panel">

          <div className="calendar-header">

            <div className="week-title">
              {view === "month"
                ? "MONTH VIEW"
                : "WEEK VIEW"}
            </div>

            <div className="legend">

              <span className="legend meeting">
                Meeting
              </span>

              <span className="legend deadline">
                Deadline
              </span>

              <span className="legend focus">
                Focus block
              </span>

              <span className="legend personal">
                Personal
              </span>

            </div>

            <div className="view-buttons">

              <button
                className={
                  view ===
                  "month"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setView(
                    "month"
                  )
                }
              >
                Month
              </button>

              <button
                className={
                  view ===
                  "week"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setView(
                    "week"
                  )
                }
              >
                Week
              </button>

            </div>

          </div>

          {/* MONTH */}

          {view === "month" ? (

            <MonthView
              events={
                displayedEvents
              }
              onDragStart={
                onDragStart
              }
              onDrop={
                onDrop
              }
              onEventClick={
                handleEventClick
              }
              reactMemoEnabled={
                reactMemoEnabled
              }
              onAdd={
                openAddModal
              }
            />

          ) : (

            /* WEEK */

            <WeekView
              events={
                displayedEvents
              }
              onDragStart={
                onDragStart
              }
              onDrop={
                onDrop
              }
              onEventClick={
                handleEventClick
              }
              reactMemoEnabled={
                reactMemoEnabled
              }
            />

          )}

        </section>

        {/* =================================================
            RENDER MONITOR
        ================================================= */}

        <aside className="monitor-panel">

          <div className="monitor-title">
            RENDER MONITOR
          </div>

          <div className="monitor-stats">

            <div>

              <strong>
                {totalRenders}
              </strong>

              <span>
                total renders
              </span>

            </div>

            <div>

              <strong>
                {displayedEvents.length}
              </strong>

              <span>
                total posts
              </span>

            </div>

          </div>

          <div className="render-list">

            {displayedEvents.map(
              (event) => {

                const count =
                  renderCounts[
                    event.id
                  ] || 0;

                const width =
                  Math.min(
                    count * 12,
                    100
                  );

                return (
                  <div
                    className="render-row"
                    key={
                      event.id
                    }
                  >

                    <span>
                      {event.title}
                    </span>

                    <div className="render-bar">

                      <div
                        className="render-progress"
                        style={{
                          width:
                            `${width}%`,
                        }}
                      />

                    </div>

                    <strong>
                      {count}
                    </strong>

                  </div>
                );

              }
            )}

          </div>

          <div className="monitor-note">

            Drag and drop an event
            to compare rendering
            behavior.

          </div>

          <div className="clock-box">

            <span>
              CURRENT TIME
            </span>

            <strong>
              {clock.toLocaleTimeString()}
            </strong>

          </div>

        </aside>

      </main>

      {/* =================================================
          BOTTOM SUMMARY
      ================================================= */}

      <section className="agenda-summary">

        <div>

          <span>
            CURRENT VIEW
          </span>

          <strong>
            {view === "month"
              ? "Month"
              : "Week"}
          </strong>

          <small>
            {displayedEvents.length}{" "}
            posts
          </small>

        </div>

        <div>

          <span>
            USEMEMO
          </span>

          <strong
            className={
              useMemoEnabled
                ? "enabled"
                : "disabled"
            }
          >
            {useMemoEnabled
              ? "ON"
              : "OFF"}
          </strong>

        </div>

        <div>

          <span>
            USECALLBACK
          </span>

          <strong
            className={
              useCallbackEnabled
                ? "enabled"
                : "disabled"
            }
          >
            {useCallbackEnabled
              ? "ON"
              : "OFF"}
          </strong>

        </div>

        <div>

          <span>
            REACT.MEMO
          </span>

          <strong
            className={
              reactMemoEnabled
                ? "enabled"
                : "disabled"
            }
          >
            {reactMemoEnabled
              ? "ON"
              : "OFF"}
          </strong>

        </div>

      </section>

      {/* =================================================
          EVENT DETAILS
      ================================================= */}

      {selectedEvent && (

        <div
          className="event-popup-overlay"
          onClick={() =>
            setSelectedEvent(
              null
            )
          }
        >

          <div
            className="event-popup"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="event-popup-header">

              <h2>
                Post Details
              </h2>

              <button
                onClick={() =>
                  setSelectedEvent(
                    null
                  )
                }
              >
                ×
              </button>

            </div>

            <div className="popup-content">

              <div className="popup-row">

                <span>
                  Title
                </span>

                <strong>
                  {
                    selectedEvent.title
                  }
                </strong>

              </div>

              <div className="popup-row">

                <span>
                  Date
                </span>

                <strong>
                  {
                    selectedEvent.date
                  }
                </strong>

              </div>

              <div className="popup-row">

                <span>
                  Time
                </span>

                <strong>
                  {
                    selectedEvent.time
                  }
                </strong>

              </div>

              <div className="popup-row">

                <span>
                  Type
                </span>

                <strong>
                  {
                    selectedEvent.type
                  }
                </strong>

              </div>

            </div>

            <div className="popup-actions">

              <button
                className="popup-edit"
                onClick={() =>
                  openEditModal(
                    selectedEvent
                  )
                }
              >
                Edit Post
              </button>

              <button
                className="popup-delete"
                onClick={() =>
                  deleteEvent(
                    selectedEvent.id
                  )
                }
              >
                Delete Post
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowModal(
              false
            )
          }
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <h2>

                {editingEvent
                  ? "Edit Post"
                  : "Add Post"}

              </h2>

              <button
                onClick={() =>
                  setShowModal(
                    false
                  )
                }
              >
                ×
              </button>

            </div>

            <label>
              Post Title
            </label>

            <input
              type="text"
              placeholder="Enter post title"
              value={
                form.title
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  title:
                    e.target.value,
                })
              }
            />

            <label>
              Date
            </label>

            <input
              type="date"
              value={
                form.date
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  date:
                    e.target.value,
                })
              }
            />

            <label>
              Time
            </label>

            <input
              type="time"
              value={
                form.time
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  time:
                    e.target.value,
                })
              }
            />

            <label>
              Type
            </label>

            <select
              value={
                form.type
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  type:
                    e.target.value,
                })
              }
            >

              <option>
                Meeting
              </option>

              <option>
                Focus block
              </option>

              <option>
                Personal
              </option>

              <option>
                Deadline
              </option>

            </select>

            <div className="modal-actions">

              <button
                className="cancel-button"
                onClick={() =>
                  setShowModal(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                className="save-button"
                onClick={
                  saveEvent
                }
              >

                {editingEvent
                  ? "Update Post"
                  : "Add Post"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;
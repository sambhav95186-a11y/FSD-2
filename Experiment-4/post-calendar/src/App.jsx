import { useState, useCallback } from "react";
import Calendar from "./Calendar";
import PostForm from "./PostForm";
import "./App.css";

function App() {
  // Calendar entries
  const [calendarEntries, setCalendarEntries] = useState([
    {
      id: "1",
      title: "Product Launch",
      date: "2026-09-02T10:00:00",
      platform: "Instagram",
      description: "Product launch announcement.",
    },
    {
      id: "2",
      title: "Company Update",
      date: "2026-09-04T14:00:00",
      platform: "LinkedIn",
      description: "Share the latest company updates.",
    },
    {
      id: "3",
      title: "Event Announcement",
      date: "2026-09-07T12:00:00",
      platform: "Twitter",
      description: "Announcement for the upcoming event.",
    },
    {
      id: "4",
      title: "New Feature",
      date: "2026-09-10T11:00:00",
      platform: "Facebook",
      description: "Announcement about a new feature.",
    },
  ]);

  // Selected calendar entry
  const [selectedEntry, setSelectedEntry] =
    useState(null);

  // Show form
  const [showForm, setShowForm] =
    useState(false);

  // Entry being edited
  const [editingEntry, setEditingEntry] =
    useState(null);

  // Current calendar view
  const [calendarView, setCalendarView] =
    useState("month");

  // Number of events in current view
  const [visibleEventCount, setVisibleEventCount] =
    useState(0);

  // Text displayed above count
  const [viewLabel, setViewLabel] =
    useState("This Month");


  // ==========================================
  // CALENDAR VIEW CHANGE
  // ==========================================

  const handleViewChange = useCallback(
    (viewInfo) => {
      setCalendarView(viewInfo.viewType);

      if (viewInfo.viewType === "dayGridMonth") {
        setViewLabel("This Month");
      } else if (
        viewInfo.viewType === "timeGridWeek"
      ) {
        setViewLabel("This Week");
      } else if (
        viewInfo.viewType === "timeGridDay"
      ) {
        setViewLabel("Today");
      }
    },
    []
  );


  // ==========================================
  // UPDATE EVENT COUNT
  // ==========================================

  const handleEventCountChange = useCallback(
    (count) => {
      setVisibleEventCount(count);
    },
    []
  );


  // ==========================================
  // ADD ENTRY
  // ==========================================

  const addEntry = useCallback((entry) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
    };

    setCalendarEntries((previousEntries) => [
      ...previousEntries,
      newEntry,
    ]);

    setShowForm(false);
  }, []);


  // ==========================================
  // UPDATE ENTRY
  // ==========================================

  const updateEntry = useCallback(
    (updatedEntry) => {
      setCalendarEntries(
        (previousEntries) =>
          previousEntries.map((entry) =>
            entry.id === updatedEntry.id
              ? updatedEntry
              : entry
          )
      );

      setEditingEntry(null);
      setSelectedEntry(null);
      setShowForm(false);
    },
    []
  );


  // ==========================================
  // REMOVE ENTRY
  // ==========================================

  const removeEntry = useCallback((id) => {
    const confirmation = window.confirm(
      "Remove this entry from the calendar?"
    );

    if (!confirmation) {
      return;
    }

    setCalendarEntries(
      (previousEntries) =>
        previousEntries.filter(
          (entry) => entry.id !== id
        )
    );

    setSelectedEntry(null);
  }, []);


  // ==========================================
  // DRAG & DROP
  // ==========================================

  const moveEntry = useCallback(
    (id, newDate) => {
      setCalendarEntries(
        (previousEntries) =>
          previousEntries.map((entry) =>
            entry.id === id
              ? {
                  ...entry,
                  date: newDate,
                }
              : entry
          )
      );
    },
    []
  );


  // ==========================================
  // SELECT EVENT
  // ==========================================

  const selectEntry = useCallback((entry) => {
    setSelectedEntry(entry);
  }, []);


  // ==========================================
  // CLOSE DETAILS
  // ==========================================

  const closeDetails = useCallback(() => {
    setSelectedEntry(null);
  }, []);


  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = useCallback(() => {
    setEditingEntry(null);
    setShowForm(true);
  }, []);


  // ==========================================
  // EDIT ENTRY
  // ==========================================

  const editCalendarEntry = useCallback(() => {
    if (!selectedEntry) {
      return;
    }

    setEditingEntry(selectedEntry);
    setSelectedEntry(null);
    setShowForm(true);
  }, [selectedEntry]);


  // ==========================================
  // CLOSE FORM
  // ==========================================

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditingEntry(null);
  }, []);


  return (
    <div className="app">

      {/* ================================
          HEADER
      ================================= */}

      <header className="header">

        <div className="header-content">

          <h1>Post Calendar</h1>

          <p>
            Organize and manage scheduled posts
            using an interactive calendar
          </p>

        </div>

        <button
          className="calendar-action-button"
          onClick={openAddForm}
        >
          + Add Calendar Entry
        </button>

      </header>


      {/* ================================
          MAIN
      ================================= */}

      <main className="main-content">


        {/* ================================
            OPTIMIZED CALENDAR SUMMARY
        ================================= */}

        <section className="calendar-summary">

          <div className="summary-icon">
            📅
          </div>

          <div className="summary-content">

            <span>
              Total Events {viewLabel}
            </span>

            <strong>
              {visibleEventCount}
            </strong>

          </div>

        </section>


        {/* ================================
            CALENDAR
        ================================= */}

        <section className="calendar-card">

          <div className="calendar-heading">

            <div>

              <h2>Content Calendar</h2>

              <p>
                View, organize and manage posts
                by date and time.
              </p>

            </div>

          </div>


          <Calendar
            posts={calendarEntries}
            onEventClick={selectEntry}
            onEventDrop={moveEntry}
            onViewChange={handleViewChange}
            onEventCountChange={
              handleEventCountChange
            }
          />

        </section>


        {/* ================================
            SELECTED EVENT DETAILS
        ================================= */}

        {selectedEntry && (

          <section className="entry-details">

            <div className="details-header">

              <div>

                <h2>Calendar Entry</h2>

                <p>
                  Details of the selected
                  calendar event
                </p>

              </div>

              <button
                className="details-close"
                onClick={closeDetails}
              >
                ×
              </button>

            </div>


            <div className="detail-item">

              <span>Title</span>

              <strong>
                {selectedEntry.title}
              </strong>

            </div>


            <div className="detail-item">

              <span>Platform</span>

              <strong>
                {selectedEntry.platform}
              </strong>

            </div>


            <div className="detail-item">

              <span>Date & Time</span>

              <strong>
                {new Date(
                  selectedEntry.date
                ).toLocaleString()}
              </strong>

            </div>


            <div className="detail-item">

              <span>Description</span>

              <p>
                {selectedEntry.description ||
                  "No description available."}
              </p>

            </div>


            <div className="details-actions">

              <button
                className="edit-button"
                onClick={editCalendarEntry}
              >
                Edit Entry
              </button>

              <button
                className="delete-button"
                onClick={() =>
                  removeEntry(
                    selectedEntry.id
                  )
                }
              >
                Remove Entry
              </button>

            </div>

          </section>

        )}


      </main>


      {/* ================================
          FORM
      ================================= */}

      {showForm && (

        <PostForm
          post={editingEntry}
          onAdd={addEntry}
          onUpdate={updateEntry}
          onClose={closeForm}
        />

      )}

    </div>
  );
}

export default App;
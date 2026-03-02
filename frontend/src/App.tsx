import { useState } from "react";
import ContactList from "./components/ContactList";
import AddTaskModal from "./components/AddTaskModal";
import "./App.css";

type Tab = "home" | "contacts";

function App() {
  const [tab, setTab] = useState<Tab>("contacts");
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__brand">CRM POC</div>
        <nav className="app-header__nav">
          <button className={`nav-tab ${tab === "home" ? "nav-tab--active" : ""}`} onClick={() => setTab("home")}>Home</button>
          <button className={`nav-tab ${tab === "contacts" ? "nav-tab--active" : ""}`} onClick={() => setTab("contacts")}>Contacts</button>
        </nav>
        <button className="btn-add-task" onClick={() => { setSelectedContact(null); setTaskModalOpen(true); }}>
          + Add Task
        </button>
      </header>

      <main className="app-main">
        {tab === "home" && (
          <div className="home-placeholder">
            <h2>Dashboard</h2>
            <p>Activity summary &amp; tasks coming soon (Gemini — Ticket 1)</p>
          </div>
        )}
        {tab === "contacts" && (
          <ContactList onSelectContact={(c: any) => setSelectedContact(c)} />
        )}
      </main>

      {selectedContact && (
        <div className="contact-detail-banner">
          Selected: <strong>{selectedContact.first_name} {selectedContact.last_name}</strong>
          <button onClick={() => { setTaskModalOpen(true); }}>+ Task for this contact</button>
          <button onClick={() => setSelectedContact(null)}>✕</button>
        </div>
      )}

      <AddTaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={(task) => { console.log("Task payload (Ticket 6 will POST this):", task); }}
        contactId={selectedContact?.id ?? null}
      />
    </div>
  );
}

export default App;

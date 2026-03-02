import { useEffect, useState } from "react";
import ContactList from "./components/ContactList";
import AddTaskModal from "./components/AddTaskModal";
import { fetchCustomers } from "./api/customers";
import "./App.css";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type Tab = "home" | "contacts";

function App() {
  const [tab, setTab] = useState<Tab>("contacts");
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    fetchCustomers().then(setContacts).catch(() => {});
  }, []);

  async function handleAddTask(task: any) {
    await fetch(`${API}/tasks/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    alert(`Task "${task.description}" created!`);
  }

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
            <p>Activity summary &amp; tasks coming soon.</p>
          </div>
        )}
        {tab === "contacts" && (
          <ContactList onSelectContact={(c: any) => setSelectedContact(c)} />
        )}
      </main>

      {selectedContact && (
        <div className="contact-detail-banner">
          Selected: <strong>{selectedContact.first_name} {selectedContact.last_name}</strong>
          <button onClick={() => setTaskModalOpen(true)}>+ Task for this contact</button>
          <button onClick={() => setSelectedContact(null)}>✕</button>
        </div>
      )}

      <AddTaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleAddTask}
        contacts={contacts}
        contactId={selectedContact?.id ?? null}
      />
    </div>
  );
}

export default App;

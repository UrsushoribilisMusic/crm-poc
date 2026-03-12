import React, { useState, useEffect } from 'react';
import ContactList from './components/ContactList';
import AddTaskModal from './components/AddTaskModal';
import LogActivityModal from './components/LogActivityModal';
import EditContactModal from './components/EditContactModal';
import CalendarView from './components/CalendarView';
import { fetchCustomers } from './api/customers';

const App = () => {
  const [activeUser, setActiveUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const refreshData = async () => {
    console.log('Refreshing all data...');
    
    try {
      const uRes = await fetch('./api/users/');
      if (uRes.ok) {
        const uData = await uRes.json();
        setUsers(uData);
        if (uData.length > 0) {
          setActiveUser(prev => {
            const stillExists = uData.find(u => u.id === prev?.id);
            if (stillExists) return stillExists;
            return uData.find(u => u.email === 'demo@example.com') || uData[0];
          });
        }
      }
    } catch (e) { console.error('Users fetch failed:', e); }

    fetchCustomers().then(setContacts).catch(e => console.error('Contacts fetch failed:', e));
    fetch('./api/tasks/').then(res => res.ok ? res.json() : []).then(setTasks).catch(e => console.error('Tasks fetch failed:', e));
    fetch('./api/activities/?limit=50').then(res => res.ok ? res.json() : []).then(setActivities).catch(e => console.error('Activities fetch failed:', e));
    fetch('./api/opportunities/').then(res => res.ok ? res.json() : []).then(setOpportunities).catch(e => console.error('Opportunities fetch failed:', e));
  };

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['home', 'contacts', 'pipeline', 'calendar', 'users'].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    if (urlParams.get('auth') === 'success') {
      alert("Successfully connected to Google Calendar!");
      // Clean up URL
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  useEffect(() => {
    if (showTaskModal) {
      fetchCustomers().then(setContacts).catch(console.error);
    }
  }, [showTaskModal]);

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const moveTask = async (taskId, newStatus) => {
    try {
      const res = await fetch(`/tasks/${taskId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, assigned_to_id: activeUser?.id })
      });
      if (res.ok) refreshData();
    } catch (e) {
      console.error('Error moving task:', e);
    }
  };

  const renderHome = () => {
    const activeTasks = tasks.filter(t => t.status !== 'Closed');
    return (
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header"><span className="card-title">Recent Activities</span></div>
          <div className="card-body">
            <ul className="activity-list">
              {activities.length > 0 ? activities.map(activity => {
                const actor = users.find(u => u.id === activity.user_id);
                return (
                  <li key={activity.id} className="activity-item">
                    <span className={`badge badge-${activity.type.toLowerCase()}`}>{activity.type}</span>
                    <strong> {contacts.find(c => c.id === activity.customer_id)?.first_name || 'Customer'}</strong>
                    <div className="item-meta">{activity.summary} {actor && <span style={{fontSize: '0.7rem'}}> (by {actor.full_name})</span>}</div>
                    <div className="item-meta">{new Date(activity.created_at).toLocaleDateString()}</div>
                  </li>
                );
              }) : <li className="item-meta">No recent activities.</li>}
            </ul>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">My Tasks (Active)</span>
            <button className="btn btn-primary" style={{ fontSize: '0.8rem' }} onClick={() => { setSelectedTask(null); setShowTaskModal(true); }}>+ Add Task</button>
          </div>
          <div className="card-body">
            <ul className="task-list">
              {activeTasks.length > 0 ? activeTasks.map(task => {
                const contact = contacts.find(c => c.id === task.customer_id);
                const assignee = users.find(u => u.id === task.assigned_to_id);
                return (
                  <li key={task.id} className="task-item" onClick={() => handleEditTask(task)} style={{ cursor: 'pointer' }}>
                    <div><strong>{task.description}</strong></div>
                    <div className="item-meta">
                      {task.category} • {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                      {contact && <span style={{ color: 'var(--accent)', marginLeft: '10px' }}>👤 {contact.first_name} {contact.last_name}</span>}
                      {assignee && <span className="badge" style={{ marginLeft: '10px', backgroundColor: '#e3f2fd' }}>Assignee: {assignee.full_name}</span>}
                    </div>
                  </li>
                );
              }) : <li className="item-meta">No active tasks.</li>}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderContacts = () => (
    <div className="card"><div className="card-body">
      <ContactList onSelectContact={(contact) => { setSelectedContact(contact); setActiveTab('contact-detail'); }} />
    </div></div>
  );

  const renderPipeline = () => {
    const taskStages = ['To Do', 'In Progress', 'Closed'];
    const groupedTasks = taskStages.reduce((acc, stage) => {
      acc[stage] = tasks.filter(t => (t.status || 'To Do') === stage);
      return acc;
    }, {});
    return (
      <div className="pipeline-board" style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
        {taskStages.map(stage => (
          <div key={stage} className="card" style={{ minWidth: '300px', flex: 1, backgroundColor: '#f4f5f7' }}>
            <div className="card-header" style={{ borderTop: '4px solid #dfe1e6' }}>
              <span className="card-title">{stage}</span>
              <span className="badge" style={{ backgroundColor: '#dfe1e6' }}>{groupedTasks[stage]?.length || 0}</span>
            </div>
            <div className="card-body" style={{ minHeight: '400px' }}>
              {groupedTasks[stage]?.map(task => {
                const contact = contacts.find(c => c.id === task.customer_id);
                return (
                  <div key={task.id} className="card" style={{ marginBottom: '12px', padding: '12px', borderLeft: '4px solid var(--accent)', cursor: 'pointer' }} onClick={() => handleEditTask(task)}>
                    <div style={{ marginBottom: '8px' }}><strong>{task.description}</strong></div>
                    <div className="item-meta" style={{ fontSize: '0.75rem' }}>👤 {contact ? `${contact.first_name} ${contact.last_name}` : 'No contact'}</div>
                    <div className="item-meta" style={{ fontSize: '0.7rem' }}>📅 {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}</div>
                    <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                      {stage !== 'To Do' && <button className="btn" style={{ fontSize: '0.65rem', padding: '2px 6px', backgroundColor: '#eee' }} onClick={(e) => { e.stopPropagation(); moveTask(task.id, 'To Do'); }}>← To Do</button>}
                      {stage !== 'In Progress' && <button className="btn" style={{ fontSize: '0.65rem', padding: '2px 6px', backgroundColor: '#eee' }} onClick={(e) => { e.stopPropagation(); moveTask(task.id, 'In Progress'); }}>Work on</button>}
                      {stage !== 'Closed' && <button className="btn btn-primary" style={{ fontSize: '0.65rem', padding: '2px 6px' }} onClick={(e) => { e.stopPropagation(); moveTask(task.id, 'Closed'); }}>Close ✓</button>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleEditUser = async (user) => {
    const newName = prompt("Edit Full Name:", user.full_name);
    if (newName && newName !== user.full_name) {
      const res = await fetch(`/users/${user.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: newName })
      });
      if (res.ok) refreshData();
    }
  };

  const renderUsers = () => (
    <div className="card">
      <div className="card-header"><span className="card-title">Team Management</span></div>
      <div className="card-body">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
            <th style={{ padding: '10px' }}>Name</th>
            <th style={{ padding: '10px' }}>Email</th>
            <th style={{ padding: '10px' }}>Role</th>
            <th style={{ padding: '10px' }}>Actions</th>
          </tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px' }}>{u.full_name}</td>
                <td style={{ padding: '10px' }}>{u.email}</td>
                <td style={{ padding: '10px' }}>{u.role}</td>
                <td style={{ padding: '10px' }}>
                  <button className="btn" style={{ fontSize: '0.7rem', padding: '4px 8px' }} onClick={() => handleEditUser(u)}>✏️ Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => {
          const name = prompt("Enter user full name:");
          const email = prompt("Enter user email:");
          if (name && email) {
            fetch('/users/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ full_name: name, email: email })
            }).then(refreshData);
          }
        }}>+ Add Team Member</button>
      </div>
    </div>
  );

  const renderContactDetail = () => {
    const contactTasks = tasks.filter(t => t.customer_id === selectedContact?.id);
    return (
      <div className="card">
        <div className="card-header">
          <span className="card-title">{selectedContact?.first_name} {selectedContact?.last_name}</span>
          <div>
            <button className="btn btn-secondary" style={{ marginRight: '10px' }} onClick={() => setShowEditContactModal(true)}>✏️ Edit Contact</button>
            <button className="btn btn-primary" style={{ marginRight: '10px' }} onClick={() => setShowActivityModal(true)}>Log Activity</button>
            <button className="btn btn-secondary" onClick={() => setActiveTab('contacts')}>Back to List</button>
          </div>
        </div>
        <div className="card-body"><div className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Contact Tasks</span>
              <button className="btn btn-primary" style={{ fontSize: '0.8rem' }} onClick={() => setShowTaskModal(true)}>+ Create Task</button>
            </div>
            <div className="card-body"><ul className="task-list">
              {contactTasks.length > 0 ? contactTasks.map(task => (
                <li key={task.id} className="task-item" onClick={() => handleEditTask(task)} style={{ cursor: 'pointer' }}>
                  <div><strong>{task.description}</strong></div>
                  <div className="item-meta">{task.category} • {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}</div>
                </li>
              )) : <p className="item-meta">No tasks for this contact yet.</p>}
            </ul></div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Contact Info</span></div>
            <div className="card-body">
              <div className="item-meta"><strong>Email:</strong> {selectedContact?.email}</div>
              <div className="item-meta"><strong>Company:</strong> {selectedContact?.company}</div>
              <div className="item-meta"><strong>Phone:</strong> {selectedContact?.phone || 'N/A'}</div>
              <div className="item-meta"><strong>Status:</strong> {selectedContact?.status}</div>
              <div className="item-meta"><strong>Location:</strong> {selectedContact?.location || 'Not set'}</div>
            </div>
          </div>
        </div></div>
      </div>
    );
  };

  const renderCalendar = () => (
    <CalendarView 
      tasks={tasks} 
      contacts={contacts} 
      activeUser={activeUser}
      onEditTask={handleEditTask} 
    />
  );

  return (
    <div className="app-container">
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? '✕' : '☰'}
      </button>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src="/crm/assets/icon.svg" alt="Fleet Hub" />
          <span>Fleet Hub</span>
        </div>
        <nav className="nav-menu">
          <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => handleTabChange('home')}>🏠 Home Dashboard</div>
          <div className={`nav-item ${activeTab === 'contacts' || activeTab === 'contact-detail' ? 'active' : ''}`} onClick={() => handleTabChange('contacts')}>👥 Lead Discovery</div>
          <div className={`nav-item ${activeTab === 'pipeline' ? 'active' : ''}`} onClick={() => handleTabChange('pipeline')}>📋 Sales Pipeline</div>
          <div className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => handleTabChange('calendar')}>📅 Content Calendar</div>
          <div className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => handleTabChange('users')}>⚙️ Fleet Access</div>
        </nav>
        <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            © 2025 <a href="https://bigbearengineering.com" target="_blank" rel="noreferrer" style={{ color: 'var(--teal-bright)', textDecoration: 'none' }}>Big Bear Engineering GmbH</a>
          </p>
        </div>
      </div>
      <div className="main-content">
        <header className="header">
          <h2>{activeTab === 'home' ? 'Home' : activeTab === 'pipeline' ? 'Task Kanban' : activeTab === 'calendar' ? 'Calendar' : activeTab === 'users' ? 'Team Management' : 'Contacts'}</h2>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Active User:</span>
            <select 
              value={activeUser?.id || ""} 
              onChange={(e) => setActiveUser(users.find(u => u.id === Number(e.target.value)))}
              style={{ padding: '5px', borderRadius: '4px', border: '1px solid var(--border)' }}
            >
              {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
            </select>
          </div>
        </header>
        <main className="content-area">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'contacts' && renderContacts()}
          {activeTab === 'contact-detail' && renderContactDetail()}
          {activeTab === 'pipeline' && renderPipeline()}
          {activeTab === 'calendar' && renderCalendar()}
          {activeTab === 'users' && renderUsers()}
        </main>
      </div>

      <AddTaskModal 
        open={showTaskModal} 
        onClose={() => setShowTaskModal(false)}
        onSubmit={async (task) => {
          const isEdit = !!task.id;
          const url = isEdit ? `/tasks/${task.id}/` : '/tasks/';
          const method = isEdit ? 'PATCH' : 'POST';
          try {
            const response = await fetch(url, {
              method: method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                description: task.description,
                due_date: task.due_date ? new Date(task.due_date).toISOString() : null,
                category: task.category,
                assigned_to_id: activeUser?.id,
                customer_id: task.contact_id,
                status: task.status
              })
            });
            if (response.ok) { refreshData(); setShowTaskModal(false); }
          } catch (e) { console.error('Task error:', e); }
        }}
        contacts={contacts}
        contactId={activeTab === 'contact-detail' ? selectedContact?.id : null}
        task={selectedTask}
        currentUser={activeUser?.full_name}
      />

      <LogActivityModal
        open={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        contactName={selectedContact ? `${selectedContact.first_name} ${selectedContact.last_name}` : ''}
        onSubmit={async (activity) => {
          try {
            const response = await fetch('/activities/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                customer_id: selectedContact.id,
                user_id: activeUser?.id,
                type: activity.type,
                summary: activity.note,
                details: activity.note
              })
            });
            if (response.ok) { refreshData(); setShowActivityModal(false); }
          } catch (e) { console.error('Activity error:', e); }
        }}
      />

      <EditContactModal
        open={showEditContactModal}
        contact={selectedContact}
        onClose={() => setShowEditContactModal(false)}
        onSubmit={async (form) => {
          const res = await fetch(`/customers/${selectedContact.id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
          });
          if (res.ok) {
            const updated = await res.json();
            setSelectedContact(updated);
            setShowEditContactModal(false);
            refreshData();
          } else {
            const err = await res.text();
            alert(`Error: ${err}`);
          }
        }}
      />
    </div>
  );
};

export default App;

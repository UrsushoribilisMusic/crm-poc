import React, { useState } from 'react';
import ContactList from './components/ContactList';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedContact, setSelectedContact] = useState(null);

  const mockActivities = [
    { id: 1, type: 'Call', customer: 'Alice Johnson', summary: 'Discussed project timeline', time: '2 hours ago' },
    { id: 2, type: 'Note', customer: 'Bob Smith', summary: 'Wants to schedule a demo', time: '4 hours ago' },
    { id: 3, type: 'Meeting', customer: 'Charlie Brown', summary: 'Quarterly review completed', time: 'Yesterday' },
  ];

  const mockTasks = [
    { id: 1, description: 'Follow up with Alice', category: 'Call', dueDate: 'Today, 4:00 PM' },
    { id: 2, description: 'Send proposal to Bob', category: 'Email', dueDate: 'Tomorrow, 10:00 AM' },
    { id: 3, description: 'Prepare for Charlie review', category: 'Meeting', dueDate: 'Mar 5, 2:00 PM' },
  ];

  const renderHome = () => (
    <div className="dashboard-grid">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Activities</span>
        </div>
        <div className="card-body">
          <ul className="activity-list">
            {mockActivities.map(activity => (
              <li key={activity.id} className="activity-item">
                <span className={`badge badge-${activity.type.toLowerCase()}`}>{activity.type}</span>
                <strong> {activity.customer}</strong>
                <div className="item-meta">{activity.summary}</div>
                <div className="item-meta">{activity.time}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <span className="card-title">My Tasks</span>
          <button className="btn btn-primary" style={{ fontSize: '0.8rem' }}>+ Add Task</button>
        </div>
        <div className="card-body">
          <ul className="task-list">
            {mockTasks.map(task => (
              <li key={task.id} className="task-item">
                <div><strong>{task.description}</strong></div>
                <div className="item-meta">{task.category} • {task.dueDate}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="card">
      <div className="card-body">
        <ContactList onSelectContact={(contact) => {
          setSelectedContact(contact);
          setActiveTab('contact-detail');
        }} />
      </div>
    </div>
  );

  const renderContactDetail = () => (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{selectedContact?.first_name} {selectedContact?.last_name}</span>
        <button className="btn btn-secondary" onClick={() => setActiveTab('contacts')}>Back to List</button>
      </div>
      <div className="card-body">
        <div className="dashboard-grid">
          <div className="card">
            <div className="card-header"><span className="card-title">Contact Tasks</span></div>
            <div className="card-body">
              <p className="item-meta">No tasks for this contact yet.</p>
              <button className="btn btn-primary">+ Create Task</button>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Contact Info</span></div>
            <div className="card-body">
              <div className="item-meta"><strong>Email:</strong> {selectedContact?.email}</div>
              <div className="item-meta"><strong>Company:</strong> {selectedContact?.company}</div>
              <div className="item-meta"><strong>Status:</strong> {selectedContact?.status}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">CRM POC</div>
        <nav className="nav-menu">
          <div 
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            🏠 Home Dashboard
          </div>
          <div 
            className={`nav-item ${activeTab === 'contacts' || activeTab === 'contact-detail' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            👥 Contacts
          </div>
          <div className="nav-item">📈 Pipeline</div>
        </nav>
      </div>
      <div className="main-content">
        <header className="header">
          <h2>{activeTab === 'home' ? 'Home' : 'Contacts'}</h2>
          <div className="user-profile">Demo User</div>
        </header>
        <main className="content-area">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'contacts' && renderContacts()}
          {activeTab === 'contact-detail' && renderContactDetail()}
        </main>
      </div>
    </div>
  );
};

export default App;

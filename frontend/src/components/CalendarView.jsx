import React, { useState } from 'react';
import './CalendarView.css';

const today = new Date();

const CalendarView = ({ tasks, contacts, activeUser, onEditTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i);
  }

  const getTasksForDay = (day) => {
    if (!day) return [];
    return tasks.filter(task => {
      if (!task.due_date) return false;
      const d = new Date(task.due_date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const handleSyncGCal = async () => {
    if (!activeUser) return alert("Please select an active user first.");
    
    setIsSyncing(true);
    try {
      const response = await fetch(`http://localhost:8000/sync-calendar/${activeUser.id}`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || `Successfully synced ${data.synced_count} tasks to Google Calendar!`);
      } else {
        if (response.status === 400) {
            // Not authenticated, trigger OAuth flow
            const authRes = await fetch(`http://localhost:8000/google-auth/${activeUser.id}`);
            const authData = await authRes.json();
            if (authData.url) {
                window.location.href = authData.url;
            }
        } else {
            alert(`Sync failed: ${data.detail}`);
        }
      }
    } catch (e) {
      console.error('Sync error:', e);
      alert('Error connecting to sync service.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="calendar-container card">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button className="btn" onClick={prevMonth}>&lt;</button>
          <span className="calendar-title">{monthNames[month]} {year}</span>
          <button className="btn" onClick={nextMonth}>&gt;</button>
        </div>
        <button 
          className={`btn btn-primary ${isSyncing ? 'loading' : ''}`} 
          onClick={handleSyncGCal}
          disabled={isSyncing}
        >
          {isSyncing ? '🔄 Syncing...' : '📅 Sync to Google Calendar'}
        </button>
      </div>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        {calendarDays.map((day, idx) => {
          const dayTasks = getTasksForDay(day);
          const isToday = day &&
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;
          return (
            <div key={idx} className={`calendar-day ${day ? '' : 'empty'}${isToday ? ' today' : ''}`}>
              {day && (
                <>
                  <div className="day-number">{day}</div>
                  <div className="day-tasks">
                    {dayTasks.slice(0, 3).map(task => {
                      const contact = contacts.find(c => c.id === task.customer_id);
                      return (
                        <div
                          key={task.id}
                          className={`calendar-task status-${task.status.replace(' ', '-').toLowerCase()}`}
                          onClick={() => onEditTask(task)}
                        >
                          {task.description}
                          {contact && <div className="task-contact">👤 {contact.first_name}</div>}
                        </div>
                      );
                    })}
                    {dayTasks.length > 3 && (
                      <div className="task-overflow">+{dayTasks.length - 3} more</div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;

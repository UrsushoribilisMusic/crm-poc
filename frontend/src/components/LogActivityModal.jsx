import { useEffect, useRef, useState } from "react";
import "./AddTaskModal.css"; // Reuse the professional modal styles

const TYPES = ["Call", "Meeting", "Note"];
const TODAY = new Date().toISOString().split('T')[0];

export default function LogActivityModal({ open, onClose, onSubmit, contactName = "" }) {
  const [form, setForm] = useState({ type: "Call", date: TODAY, note: "" });
  const [submitting, setSubmitting] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setForm({ type: "Call", date: TODAY, note: "" });
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.note.trim()) { alert("Please enter a note."); return; }
    setSubmitting(true);
    try {
      await onSubmit?.(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal__header">
          <h2 className="modal__title">Log Activity for {contactName}</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label>Activity Type *</label>
              <select 
                ref={firstInputRef}
                value={form.type} 
                onChange={(e) => setForm({...form, type: e.target.value})}
              >
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Date *</label>
              <input 
                type="date" 
                value={form.date} 
                onChange={(e) => setForm({...form, date: e.target.value})}
              />
            </div>
          </div>

          <div className="form-field">
            <label>Note *</label>
            <textarea
              rows="4"
              value={form.note}
              onChange={(e) => setForm({...form, note: e.target.value})}
              placeholder="What happened during this interaction?"
            />
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? "Logging…" : "Log Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import "./AddTaskModal.css";

const CATEGORIES = ["Call", "Meeting", "Follow-up", "Email", "Demo", "Other"];
const EMPTY_FORM = { description: "", due_date: "", category: "", assigned_to: "", contact_id: null };

/**
 * AddTaskModal — Global "Add Task" modal.
 * Props:
 *   open        {boolean}   controls visibility
 *   onClose     {function}  called when dismissed
 *   onSubmit    {function}  called with task payload on save
 *   contacts    {array}     [{ id, first_name, last_name }] for the contact dropdown
 *   contactId   {number}    if set, pre-selects and locks the contact (Contact Detail context)
 */
export default function AddTaskModal({ open, onClose, onSubmit, contacts = [], contactId = null }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, contact_id: contactId });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY_FORM, contact_id: contactId });
      setErrors({});
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [open, contactId]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.description.trim()) errs.description = "Description is required.";
    if (!form.due_date) errs.due_date = "Due date is required.";
    if (!form.category) errs.category = "Category is required.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await onSubmit?.({ ...form });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  const lockedContact = contactId ? contacts.find((c) => c.id === contactId) : null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal__header">
          <h2 className="modal__title" id="modal-title">Add Task</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit} noValidate>
          <div className={`form-field ${errors.description ? "form-field--error" : ""}`}>
            <label htmlFor="task-desc">Description *</label>
            <textarea
              id="task-desc"
              ref={firstInputRef}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What needs to be done?"
            />
            {errors.description && <span className="form-field__error-msg">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className={`form-field ${errors.due_date ? "form-field--error" : ""}`}>
              <label htmlFor="task-date">Due Date *</label>
              <input
                id="task-date"
                type="date"
                value={form.due_date}
                onChange={(e) => set("due_date", e.target.value)}
              />
              {errors.due_date && <span className="form-field__error-msg">{errors.due_date}</span>}
            </div>

            <div className={`form-field ${errors.category ? "form-field--error" : ""}`}>
              <label htmlFor="task-cat">Category *</label>
              <select id="task-cat" value={form.category} onChange={(e) => set("category", e.target.value)}>
                <option value="">Select…</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <span className="form-field__error-msg">{errors.category}</span>}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="task-contact">Linked Contact</label>
            {lockedContact ? (
              <input id="task-contact" type="text" value={`${lockedContact.first_name} ${lockedContact.last_name}`} disabled />
            ) : (
              <select id="task-contact" value={form.contact_id ?? ""} onChange={(e) => set("contact_id", e.target.value ? Number(e.target.value) : null)}>
                <option value="">None</option>
                {contacts.map((c) => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
              </select>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="task-assigned">Assigned To</label>
            <input
              id="task-assigned"
              type="text"
              value={form.assigned_to}
              onChange={(e) => set("assigned_to", e.target.value)}
              placeholder="Name or team member"
            />
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? "Saving…" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

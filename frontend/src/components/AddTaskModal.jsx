import { useEffect, useRef, useState } from "react";
import "./AddTaskModal.css";

const CATEGORIES = ["Call", "Meeting", "Follow-up", "Email", "Demo", "Other"];
const STAGES = ["To Do", "In Progress", "Closed"];
const EMPTY_FORM = { description: "", due_date: "", category: "", assigned_to: "", contact_id: null, status: "To Do" };

export default function AddTaskModal({ open, onClose, onSubmit, contacts = [], contactId = null, task = null, currentUser = "" }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, contact_id: contactId, assigned_to: currentUser });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (task) {
        setForm({
          description: task.description,
          due_date: task.due_date ? task.due_date.split('T')[0] : "",
          category: task.category,
          assigned_to: task.assigned_to || currentUser,
          contact_id: task.customer_id,
          status: task.status || "To Do"
        });
      } else {
        setForm({ ...EMPTY_FORM, contact_id: contactId, assigned_to: currentUser });
      }
      setErrors({});
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [open, contactId, task, currentUser]);

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
      await onSubmit?.({ ...form, id: task?.id });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  const lockedContact = contactId ? contacts.find((c) => c.id === contactId) : null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal__header">
          <h2 className="modal__title">{task ? 'Edit Task' : 'Add Task'}</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label>Description *</label>
            <textarea
              ref={firstInputRef}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What needs to be done?"
            />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Due Date *</label>
              <input type="date" value={form.due_date} onChange={(e) => set("due_date", e.target.value)} />
              {errors.due_date && <span className="error">{errors.due_date}</span>}
            </div>
            <div className="form-field">
              <label>Category *</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}>
                <option value="">Select…</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <span className="error">{errors.category}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Assigned To</label>
              <input type="text" value={form.assigned_to} onChange={(e) => set("assigned_to", e.target.value)} />
            </div>
          </div>

          <div className="form-field">
            <label>Linked Contact</label>
            {lockedContact ? (
              <input type="text" value={`${lockedContact.first_name} ${lockedContact.last_name}`} disabled />
            ) : (
              <select value={form.contact_id ?? ""} onChange={(e) => set("contact_id", e.target.value ? Number(e.target.value) : null)}>
                <option value="">None</option>
                {contacts.map((c) => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
              </select>
            )}
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? "Saving…" : task ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

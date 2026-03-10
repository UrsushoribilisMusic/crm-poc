import { useEffect, useState } from "react";

const STATUSES = ["active", "lead", "inactive"];

export default function EditContactModal({ open, contact, onClose, onSubmit }) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && contact) {
      setForm({
        first_name: contact.first_name ?? "",
        last_name: contact.last_name ?? "",
        email: contact.email ?? "",
        phone: contact.phone ?? "",
        company: contact.company ?? "",
        location: contact.location ?? "",
        status: contact.status ?? "active",
        notes: contact.notes ?? "",
      });
      setErrors({});
    }
  }, [open, contact]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open || !contact) return null;

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.first_name.trim()) errs.first_name = "Required.";
    if (!form.last_name.trim()) errs.last_name = "Required.";
    if (!form.email.trim()) errs.email = "Required.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  const field = (id, label, type = "text", required = false) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label htmlFor={id} style={{ fontSize: "0.8rem", fontWeight: 500, color: "#374151" }}>
        {label}{required && " *"}
      </label>
      <input
        id={id}
        type={type}
        value={form[id] ?? ""}
        onChange={(e) => set(id, e.target.value)}
        style={{
          padding: "0.45rem 0.65rem",
          border: `1px solid ${errors[id] ? "#dc2626" : "#d1d5db"}`,
          borderRadius: "6px",
          fontSize: "0.875rem",
        }}
      />
      {errors[id] && <span style={{ fontSize: "0.75rem", color: "#dc2626" }}>{errors[id]}</span>}
    </div>
  );

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      }}
    >
      <div style={{
        background: "#fff", borderRadius: "10px", padding: "1.75rem",
        width: "100%", maxWidth: "520px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        fontFamily: "sans-serif", maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>Edit Contact</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "#6b7280" }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }} noValidate>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {field("first_name", "First Name", "text", true)}
            {field("last_name", "Last Name", "text", true)}
          </div>

          {field("email", "Email", "email", true)}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {field("phone", "Phone")}
            {field("location", "Location")}
          </div>

          {field("company", "Company")}

          {/* Status dropdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label htmlFor="status" style={{ fontSize: "0.8rem", fontWeight: 500, color: "#374151" }}>Status</label>
            <select
              id="status"
              value={form.status ?? "active"}
              onChange={(e) => set("status", e.target.value)}
              style={{ padding: "0.45rem 0.65rem", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "0.875rem", background: "#fff" }}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label htmlFor="notes" style={{ fontSize: "0.8rem", fontWeight: 500, color: "#374151" }}>Notes</label>
            <textarea
              id="notes"
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
              style={{ padding: "0.45rem 0.65rem", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "0.875rem", resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button type="button" onClick={onClose}
              style={{ padding: "0.5rem 1.25rem", borderRadius: "6px", border: "none", background: "#f3f4f6", cursor: "pointer", fontWeight: 500 }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              style={{ padding: "0.5rem 1.25rem", borderRadius: "6px", border: "none", background: submitting ? "#93c5fd" : "#2563eb", color: "#fff", cursor: submitting ? "not-allowed" : "pointer", fontWeight: 500 }}>
              {submitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState, useMemo } from "react";
import { fetchCustomers } from "../api/customers";
import "./ContactList.css";

const SORT_FIELDS = {
  name: (a, b) => `${a.last_name}${a.first_name}`.localeCompare(`${b.last_name}${b.first_name}`),
  company: (a, b) => (a.company || "").localeCompare(b.company || ""),
};

export default function ContactList({ onSelectContact }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCustomers({ search })
      .then(setCustomers)
      .finally(() => setLoading(false));
  }, [search]);

  const sorted = useMemo(() => {
    return [...customers].sort(SORT_FIELDS[sortField]);
  }, [customers, sortField]);

  return (
    <div className="contact-list-container">
      <div className="contact-list-header">
        <input
          type="text"
          placeholder="Search Alice, Bob, or Company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={sortField} onChange={(e) => setSortField(e.target.value)} className="sort-select">
          <option value="name">Sort by Name</option>
          <option value="company">Sort by Company</option>
        </select>
      </div>

      {loading ? (
        <p>Loading contacts...</p>
      ) : (
        <table className="contact-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Tags</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => (
              <tr 
                key={c.id} 
                onClick={() => onSelectContact?.(c)} 
                style={{ cursor: 'pointer' }}
              >
                <td>{c.first_name} {c.last_name}</td>
                <td>{c.company ?? "—"}</td>
                <td>{c.email}</td>
                <td>{c.phone ?? "—"}</td>
                <td>{c.location ?? "—"}</td>
                <td>
                  {(c.tags ?? []).map((t) => (
                    <span key={t.id} className="tag-badge">{t.name}</span>
                  ))}
                </td>
                <td>
                  <span className={`status-badge status-badge--${c.status}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

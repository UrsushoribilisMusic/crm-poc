import { useEffect, useState, useMemo } from "react";
import { fetchCustomers } from "../api/customers";
import "./ContactList.css";

const SORT_FIELDS = {
  name: (a, b) => `${a.last_name}${a.first_name}`.localeCompare(`${b.last_name}${b.first_name}`),
  company: (a, b) => (a.company ?? "").localeCompare(b.company ?? ""),
};

export default function ContactList({ onSelectContact }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchCustomers({ search, status: statusFilter })
      .then(setCustomers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [search, statusFilter]);

  const sorted = useMemo(() => {
    const fn = SORT_FIELDS[sortField];
    return [...customers].sort((a, b) => (sortAsc ? fn(a, b) : fn(b, a)));
  }, [customers, sortField, sortAsc]);

  function handleSort(field) {
    if (sortField === field) setSortAsc((v) => !v);
    else { setSortField(field); setSortAsc(true); }
  }

  function SortIcon({ field }) {
    if (sortField !== field) return <span className="sort-icon">↕</span>;
    return <span className="sort-icon active">{sortAsc ? "↑" : "↓"}</span>;
  }

  return (
    <div className="contact-list">
      <div className="contact-list__toolbar">
        <input
          className="contact-list__search"
          placeholder="Search name, company, email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="contact-list__filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="lead">Lead</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && <div className="contact-list__error">{error}</div>}

      {!error && (
        <table className="contact-list__table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort("name")}>
                Name <SortIcon field="name" />
              </th>
              <th className="sortable" onClick={() => handleSort("company")}>
                Company <SortIcon field="company" />
              </th>
              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Tags</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="contact-list__empty">Loading…</td>
              </tr>
            )}
            {!loading && sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="contact-list__empty">No contacts found.</td>
              </tr>
            )}
            {!loading && sorted.map((c) => (
              <tr key={c.id} onClick={() => onSelectContact?.(c)} style={{ cursor: 'pointer' }}>
                <td>{c.first_name} {c.last_name}</td>
                <td>{c.company ?? "—"}</td>
                <td>{c.email}</td>
                <td>{c.phone ?? "—"}</td>
                <td>{c.location ?? "—"}</td>
                <td>
                  {(c.tags ?? []).map((t) => (
                    <span key={t.id} className="tag" style={{ 
                      display: 'inline-block', 
                      padding: '2px 6px', 
                      backgroundColor: '#eee', 
                      borderRadius: '4px', 
                      marginRight: '4px', 
                      fontSize: '0.75rem' 
                    }}>
                      {t.name}
                    </span>
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

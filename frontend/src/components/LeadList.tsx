import { Link } from "react-router-dom";
import type { Lead } from "../types";
import StatusBadge from "./StatusBadge";

interface LeadListProps {
  leads: Lead[];
  onDelete: (id: number) => void;
}

export default function LeadList({ leads, onDelete }: LeadListProps) {
  if (leads.length === 0) {
    return <p className="state-message">No leads found. Try adjusting your search or filters.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr
              key={lead.id}
              className={`row-${lead.status}`}
              style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
            >
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.phone}</td>
              <td>
                <StatusBadge status={lead.status} />
              </td>
              <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="row-actions">
                  <Link to={`/leads/${lead.id}`}>View</Link>
                  <button type="button" className="btn-text-danger" onClick={() => onDelete(lead.id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

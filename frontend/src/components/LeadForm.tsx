import { FormEvent, useState } from "react";
import { LEAD_STATUSES, LeadFormData, LeadStatus } from "../types";

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => Promise<void>;
  submitting: boolean;
  errors: string[];
}

export default function LeadForm({ onSubmit, submitting, errors }: LeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<LeadStatus>("new");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ name, email, phone, status });
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div className="error-message">
          <strong>Please fix the following:</strong>
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input id="phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select id="status" className="select" value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)}>
          {LEAD_STATUSES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn" disabled={submitting}>
        {submitting ? "Saving..." : "Create Lead"}
      </button>
    </form>
  );
}

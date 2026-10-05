import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createLead } from "../services/api";
import { LeadFormData } from "../types";
import LeadForm from "../components/LeadForm";
import axios from "axios";

export default function CreateLeadPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleSubmit(data: LeadFormData) {
    setSubmitting(true);
    setErrors([]);
    try {
      const lead = await createLead(data);
      navigate(`/leads/${lead.id}`, { state: { created: true } });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const body = err.response.data as { message?: string; errors?: string[] };
        setErrors(body.errors ?? [body.message ?? "Failed to create lead."]);
      } else {
        setErrors(["Failed to create lead. Please try again."]);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Link to="/" className="back-link">
        &larr; Back to Leads
      </Link>
      <div className="page-header">
        <h1>Add Lead</h1>
      </div>
      <LeadForm onSubmit={handleSubmit} submitting={submitting} errors={errors} />
    </div>
  );
}

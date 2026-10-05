import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { createNote, fetchLead, fetchNotes } from "../services/api";
import { Lead, Note } from "../types";
import StatusBadge from "../components/StatusBadge";
import NoteList from "../components/NoteList";
import ToastStack from "../components/Toast";
import { useToasts } from "../hooks/useToasts";

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [noteContent, setNoteContent] = useState("");
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [noteError, setNoteError] = useState("");
  const { toasts, showToast, dismissToast } = useToasts();
  const createdToastShown = useRef(false);

  useEffect(() => {
    if (!id) return;
    loadLead(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if ((location.state as { created?: boolean } | null)?.created && !createdToastShown.current) {
      createdToastShown.current = true;
      showToast("Lead created", "success");
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadLead(leadId: string) {
    setLoading(true);
    setError("");
    try {
      const [leadData, notesData] = await Promise.all([fetchLead(leadId), fetchNotes(leadId)]);
      setLead(leadData);
      setNotes(notesData);
    } catch (err) {
      setError("Failed to load lead details.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddNote(event: FormEvent) {
    event.preventDefault();
    if (!id) return;
    setNoteError("");

    if (!noteContent.trim()) {
      setNoteError("Note content is required.");
      return;
    }

    setNoteSubmitting(true);
    try {
      const note = await createNote(id, noteContent.trim());
      setNotes((prev) => [note, ...prev]);
      setNoteContent("");
      showToast("Note added", "success");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const body = err.response.data as { message?: string };
        setNoteError(body.message ?? "Failed to add note.");
      } else {
        setNoteError("Failed to add note.");
      }
    } finally {
      setNoteSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="state-message">
        <div className="spinner" />
        Loading lead...
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div>
        <Link to="/" className="back-link">
          &larr; Back to Leads
        </Link>
        <div className="error-message">{error || "Lead not found."}</div>
      </div>
    );
  }

  return (
    <div>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <Link to="/" className="back-link">
        &larr; Back to Leads
      </Link>

      <div className="page-header">
        <h1>{lead.name}</h1>
        <StatusBadge status={lead.status} />
      </div>

      <div className="card">
        <div className="detail-grid">
          <div className="detail-item">
            <span>Email</span>
            {lead.email}
          </div>
          <div className="detail-item">
            <span>Phone</span>
            {lead.phone}
          </div>
          <div className="detail-item">
            <span>Status</span>
            <StatusBadge status={lead.status} />
          </div>
          <div className="detail-item">
            <span>Created</span>
            {new Date(lead.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      <h2 className="section-title">Notes</h2>
      <NoteList notes={notes} />

      {noteError && <div className="error-message">{noteError}</div>}

      <form className="note-form" onSubmit={handleAddNote}>
        <textarea
          className="textarea"
          placeholder="Write a note..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />
        <button type="submit" className="btn" disabled={noteSubmitting}>
          {noteSubmitting ? "Adding..." : "Add Note"}
        </button>
      </form>
    </div>
  );
}

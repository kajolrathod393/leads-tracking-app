import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteLead, fetchLeads } from "../services/api";
import { LEAD_STATUSES, Lead, LeadStatus } from "../types";
import LeadList from "../components/LeadList";
import ConfirmDialog from "../components/ConfirmDialog";
import ToastStack from "../components/Toast";
import StatsBar from "../components/StatsBar";
import { useToasts } from "../hooks/useToasts";

const PAGE_SIZE_OPTIONS = [5, 10, 50, 100];

function LeadsTableSkeleton() {
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
          {[0, 1, 2, 3].map((row) => (
            <tr className="skeleton-row" key={row}>
              {[0, 1, 2, 3, 4, 5].map((cell) => (
                <td key={cell}>
                  <div className="skeleton skeleton-line" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Lead | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<LeadStatus, number>>({
    new: 0,
    contacted: 0,
    qualified: 0,
    lost: 0,
  });
  const { toasts, showToast, dismissToast } = useToasts();

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, limit]);

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, status, page, limit]);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadLeads() {
    setLoading(true);
    setError("");
    try {
      const response = await fetchLeads({ search: debouncedSearch || undefined, status: status || undefined, page, limit });
      setLeads(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalLeads(response.pagination.total);
    } catch (err) {
      setError("Failed to load leads. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const [allRes, newRes, contactedRes, qualifiedRes, lostRes] = await Promise.all([
        fetchLeads({ limit: 1 }),
        fetchLeads({ status: "new", limit: 1 }),
        fetchLeads({ status: "contacted", limit: 1 }),
        fetchLeads({ status: "qualified", limit: 1 }),
        fetchLeads({ status: "lost", limit: 1 }),
      ]);
      setTotalLeads(allRes.pagination.total);
      setStatusCounts({
        new: newRes.pagination.total,
        contacted: contactedRes.pagination.total,
        qualified: qualifiedRes.pagination.total,
        lost: lostRes.pagination.total,
      });
    } catch (err) {
      // Stats are a nice-to-have; failing silently keeps the main list usable.
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const lead = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteLead(lead.id);
      showToast(`Deleted "${lead.name}"`, "success");
      loadLeads();
      loadStats();
    } catch (err) {
      showToast("Failed to delete lead. Please try again.", "error");
    }
  }

  return (
    <div>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <div className="page-header">
        <h1>Leads</h1>
        <Link to="/leads/new" className="btn">
          + Add Lead
        </Link>
      </div>

      <StatsBar total={totalLeads} counts={statusCounts} />

      <div className="toolbar">
        <input
          className="input"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value as LeadStatus | "")}>
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <LeadsTableSkeleton />
      ) : (
        <LeadList leads={leads} onDelete={(id) => setPendingDelete(leads.find((l) => l.id === id) ?? null)} />
      )}

      {!loading && leads.length > 0 && (
        <div className="pagination-bar">
          <div className="page-size-group">
            Show
            <select className="select" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            per page &middot; {totalLeads} total
          </div>

          <div className="page-controls">
            <button
              type="button"
              className="page-btn"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              &lsaquo;
            </button>
            Page {page} of {totalPages}
            <button
              type="button"
              className="page-btn"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
            >
              &rsaquo;
            </button>
          </div>
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this lead?"
          message={`"${pendingDelete.name}" and all of its notes will be permanently removed.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}

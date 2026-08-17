import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  useGetContactSubmissionsQuery,
  useUpdateContactSubmissionStatusMutation,
  type ContactSubmission,
  type ContactSubmissionStatus,
} from "@/features/contact/api/contactApi";
import { StatusBadge } from "@/features/admin/components/StatusBadge";

const NEXT_ACTIONS: Record<ContactSubmissionStatus, ContactSubmissionStatus[]> = {
  New: ["Read", "Archived"],
  Read: ["Responded", "Archived"],
  Responded: ["Archived"],
  Archived: [],
};

export function ContactInboxPage() {
  const { data: submissions, isLoading, isError, refetch } = useGetContactSubmissionsQuery();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Contact Submissions</h1>
          <p className="mt-1 text-sm text-ink-soft">Messages sent through the public Contact form.</p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-xs font-bold uppercase tracking-wide text-gold-dark"
        >
          Refresh
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        {isLoading && <p className="p-6 text-sm text-ink-soft">Loading…</p>}
        {isError && (
          <p className="p-6 text-sm text-danger">Couldn't load submissions. Is the API running and are you signed in?</p>
        )}
        {!isLoading && !isError && submissions?.length === 0 && (
          <p className="p-6 text-sm text-ink-soft">No submissions yet.</p>
        )}

        {submissions?.map((s) => (
          <SubmissionRow
            key={s.id}
            submission={s}
            expanded={expandedId === s.id}
            onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
          />
        ))}
      </div>
    </div>
  );
}

function SubmissionRow({
  submission,
  expanded,
  onToggle,
}: {
  submission: ContactSubmission;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [updateStatus, { isLoading: isUpdating }] = useUpdateContactSubmissionStatusMutation();

  return (
    <div className="border-b border-line last:border-b-0">
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-4 p-4 text-left hover:bg-paper">
        {expanded ? <ChevronUp size={16} className="flex-none text-steel" /> : <ChevronDown size={16} className="flex-none text-steel" />}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink">{submission.subject}</p>
          <p className="truncate text-xs text-steel">
            {submission.name} · {submission.email} · {new Date(submission.createdAt).toLocaleString()}
          </p>
        </div>
        <StatusBadge status={submission.status} />
      </button>

      {expanded && (
        <div className="border-t border-line bg-paper/50 p-4">
          {submission.phone && <p className="text-sm text-ink-soft">Phone: {submission.phone}</p>}
          {submission.serviceOfInterest && (
            <p className="text-sm text-ink-soft">Service of interest: {submission.serviceOfInterest}</p>
          )}
          <p className="mt-2 whitespace-pre-wrap text-sm text-ink">{submission.message}</p>

          {NEXT_ACTIONS[submission.status].length > 0 && (
            <div className="mt-4 flex gap-2">
              {NEXT_ACTIONS[submission.status].map((next) => (
                <button
                  key={next}
                  type="button"
                  disabled={isUpdating}
                  onClick={() => updateStatus({ id: submission.id, status: next })}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink-soft hover:border-gold-dark hover:text-gold-dark disabled:opacity-50"
                >
                  Mark as {next}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

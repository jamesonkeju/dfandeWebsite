const STYLES: Record<string, string> = {
  New: "bg-gold/20 text-gold-dark",
  Read: "bg-steel/15 text-ink-soft",
  Responded: "bg-verify/15 text-verify",
  Archived: "bg-line text-steel",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`flex-none rounded-full px-2.5 py-1 text-xs font-bold ${STYLES[status] ?? STYLES.Read}`}>
      {status}
    </span>
  );
}

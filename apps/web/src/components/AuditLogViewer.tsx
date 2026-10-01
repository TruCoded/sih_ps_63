import React, { useState, useEffect } from 'react';
import { UserCheck, ShieldCheck, Clock, FileText, Search, AlertCircle } from 'lucide-react';
import { AuditEvent, UserRole } from '../../../../packages/shared-types/index.js';

interface AuditLogViewerProps {
  userRole: UserRole;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    fetch('/api/audit-events')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvents(data.data);
        }
      })
      .catch(err => console.error('Failed to load audit logs:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = filterAction === 'ALL'
    ? events
    : events.filter(e => e.action === filterAction);

  return (
    <div className="page-container py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="section-kicker">
            <span>08</span>
            <span>Governance</span>
          </div>
          <h2 className="editorial-title">
            System Audit &amp; <em className="font-serif italic font-normal text-[var(--signal)]">access logs.</em>
          </h2>
          <p className="page-intro-desc">
            Tamper-evident chronological audit log recording every asset upload, virus scan, embargo modification, and reviewer approval.
          </p>
        </div>

        {/* Action Filter */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] self-start md:self-auto shadow-2xs">
          {['ALL', 'PUBLISHED', 'EMBARGO_MODIFIED', 'DRAFT_APPROVED', 'UPLOAD_INITIATED'].map(act => (
            <button
              key={act}
              onClick={() => setFilterAction(act)}
              className={`px-3 py-1.5 rounded-[var(--radius)] text-xs font-mono transition-all cursor-pointer ${
                filterAction === act
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-xs'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]'
              }`}
            >
              {act.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Events Table */}
      <div className="bg-[var(--card)] rounded-[var(--radius)] overflow-hidden border border-[var(--border)] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)] text-[11px] bg-[var(--secondary)]/60">
                <th className="py-3 px-4">TIMESTAMP (UTC)</th>
                <th className="py-3 px-4">ACTOR / ROLE</th>
                <th className="py-3 px-4">ACTION</th>
                <th className="py-3 px-4">TARGET</th>
                <th className="py-3 px-4">NOTES / BEFORE → AFTER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
              {filteredEvents.map(ev => {
                let badgeClass = "bg-[var(--secondary)] text-[var(--foreground)] border-[var(--border)]";
                if (ev.action === 'PUBLISHED') badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold";
                if (ev.action === 'EMBARGO_MODIFIED') badgeClass = "bg-amber-50 text-amber-700 border-amber-300 font-bold";
                if (ev.action === 'DRAFT_APPROVED') badgeClass = "bg-purple-50 text-purple-700 border-purple-300 font-bold";
                if (ev.action === 'ANTIVIRUS_PASSED') badgeClass = "bg-blue-50 text-blue-700 border-blue-300 font-bold";

                return (
                  <tr key={ev.id} className="hover:bg-[var(--secondary)]/40 transition-colors">
                    <td className="py-3 px-4 text-[var(--muted-foreground)] whitespace-nowrap">
                      {new Date(ev.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[var(--foreground)]">{ev.actor.name}</div>
                      <div className="text-[10px] text-[var(--muted-foreground)]">{ev.actor.role} • {ev.actor.email}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] border uppercase ${badgeClass}`}>
                        {ev.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[var(--primary)] whitespace-nowrap">
                      {ev.targetType}: {ev.targetId}
                    </td>
                    <td className="py-3 px-4 text-[var(--foreground)] max-w-md">
                      <div>{ev.notes}</div>
                      {ev.beforeState && ev.afterState && (
                        <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                          Diff: {JSON.stringify(ev.beforeState)} → {JSON.stringify(ev.afterState)}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Standardized Bottom Container */}
      <div className="bottom-box-container">
        <div className="flex items-start gap-3.5">
          <div className="bottom-box-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[var(--foreground)]">W3C PROV-O & ISO 19115 Governance Audit Chain</h4>
            <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
              All events are cryptographically timestamped and tamper-evident under INCOIS/NCPOR Data Governance Policy v3.1. Logs are retained for a minimum of 10 years and are admissible for FAIR compliance verification and scientific reproducibility audits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

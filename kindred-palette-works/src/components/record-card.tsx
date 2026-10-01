import { ArrowUpRight } from 'lucide-react';
import type { records } from '@/lib/content';

type Record = (typeof records)[number];
export function RecordCard({ record }: { record: Record }) {
  return <a className="record-card" href={record.url} target="_blank" rel="noreferrer" aria-label={`Open ${record.title} at ${record.source} (external site)`}>
    <div className="record-image"><img src={record.image} alt="Illustrative polar research landscape" loading="lazy"/><span className="record-type">{record.type}</span></div>
    <div className="record-body"><div className="record-source">{record.source} <span>·</span> {record.region}</div><div className="record-title-row"><h3>{record.title}</h3><ArrowUpRight size={20} aria-hidden="true"/></div><p>{record.description}</p><div className="record-bottom"><span>{record.access}</span><span>View source ↗</span></div></div>
  </a>;
}

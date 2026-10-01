import { createFileRoute } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PageIntro } from '@/components/page-intro';
import { RecordCard } from '@/components/record-card';
import { records, pageHead } from '@/lib/content';

export const Route = createFileRoute('/library')({ head: () => pageHead('Knowledge library', 'Search curated official entry points for polar data, expeditions, station observations and research activities.'), component: Library });
function Library() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All regions');
  const [type, setType] = useState('All types');
  const results = useMemo(() => records.filter(record => (region === 'All regions' || record.region === region || record.region === 'All regions') && (type === 'All types' || record.type === type) && `${record.title} ${record.description} ${record.source} ${record.region} ${record.type}`.toLowerCase().includes(query.toLowerCase().trim())), [query, region, type]);
  return <main><PageIntro index="02" eyebrow="Discover" title="Knowledge library" description="A considered starting point for polar research. Search a curated selection of authoritative resources and continue to the original source for the full record."/><section className="page-container section-tight page-divider"><div className="library-controls"><div className="search-wrap"><Search size={19} aria-hidden="true"/><input aria-label="Search resources" placeholder="Search resources..." value={query} onChange={e => setQuery(e.target.value)}/></div><div className="filter-wrap"><label htmlFor="region">Region</label><select id="region" value={region} onChange={e => setRegion(e.target.value)}><option>All regions</option><option>Antarctica</option><option>Southern Ocean</option></select><label htmlFor="type">Type</label><select id="type" value={type} onChange={e => setType(e.target.value)}><option>All types</option>{[...new Set(records.map(r => r.type))].map(item => <option key={item}>{item}</option>)}</select></div></div><p className="result-count">Showing {results.length} {results.length === 1 ? 'resource' : 'resources'}</p>{results.length ? <div className="record-grid">{results.map(record => <RecordCard key={record.id} record={record}/>)}</div> : <div className="notice"><strong>No matching resources.</strong> Try a broader search or select another region or type.</div>}<div className="notice"><strong>Curated links, not mirrored data.</strong> These entries point to original providers. Check the source for current availability, attribution, licence and access conditions.</div></section></main>;
}

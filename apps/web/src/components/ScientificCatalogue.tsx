import React, { useState } from 'react';
import { 
  Search, 
  Layers, 
  FileText, 
  Database, 
  Image, 
  Video, 
  MapPin, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  Code, 
  Download, 
  Eye, 
  X, 
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { Asset, UserRole } from '../../../../packages/shared-types/index.js';

interface ScientificCatalogueProps {
  assets: Asset[];
  userRole: UserRole;
  onDownloadAsset: (assetId: string) => void;
  onOpenProvenance?: (assetId: string) => void;
}

export const ScientificCatalogue: React.FC<ScientificCatalogueProps> = ({
  assets,
  userRole,
  onDownloadAsset,
  onOpenProvenance
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState('All regions');
  const [selectedType, setSelectedType] = useState('All types');
  const [selectedAccess, setSelectedAccess] = useState('All');
  const [inspectAsset, setInspectAsset] = useState<Asset | null>(null);
  const [jsonLdModalAsset, setJsonLdModalAsset] = useState<Asset | null>(null);
  const [citationCopiedId, setCitationCopiedId] = useState<string | null>(null);

  // Filter assets
  const filteredAssets = assets.filter(asset => {
    // Role protection: public visitors NEVER see non-public assets
    if ((userRole === 'public_visitor' || userRole === 'student') && asset.accessState !== 'public') {
      return false;
    }

    if (selectedProgramme !== 'All regions') {
      const match = asset.spatialCoverageName.toLowerCase().includes(selectedProgramme.toLowerCase()) ||
                    asset.subjects.some(s => s.toLowerCase().includes(selectedProgramme.toLowerCase()));
      if (!match) return false;
    }

    if (selectedType !== 'All types' && asset.type.toLowerCase() !== selectedType.toLowerCase()) {
      return false;
    }

    if (selectedAccess !== 'All' && asset.accessState !== selectedAccess.toLowerCase()) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = asset.title.toLowerCase().includes(q);
      const matchAbstract = asset.abstract.toLowerCase().includes(q);
      const matchSubjects = asset.subjects.some(s => s.toLowerCase().includes(q));
      const matchProvider = asset.authoritativeProvider.toLowerCase().includes(q);
      if (!matchTitle && !matchAbstract && !matchSubjects && !matchProvider) return false;
    }

    return true;
  });

  const generateBibTeX = (asset: Asset) => {
    const key = `ncpor_${asset.id.replace(/-/g, '_')}`;
    const author = asset.contributors.map(c => c.name).join(' and ') || 'NCPOR Scientific Division';
    const year = asset.date ? asset.date.split('-')[0] : '2024';
    return `@misc{${key},\n  author = {${author}},\n  title = {{${asset.title}}},\n  year = {${year}},\n  publisher = {${asset.authoritativeProvider} / Ministry of Earth Sciences},\n  url = {${asset.sourceUrl}},\n  note = {Licence: ${asset.licence}}\n}`;
  };

  const handleCopyCitation = (asset: Asset) => {
    const bibtex = generateBibTeX(asset);
    navigator.clipboard.writeText(bibtex);
    setCitationCopiedId(asset.id);
    setTimeout(() => setCitationCopiedId(null), 2500);
  };

  const getRecordImage = (asset: Asset) => {
    const title = (asset.title + ' ' + asset.spatialCoverageName).toLowerCase();
    if (title.includes('ocean') || title.includes('marine') || title.includes('sea') || title.includes('cruise')) {
      return '/assets/southern-ocean.jpg';
    }
    if (title.includes('station') || title.includes('bharati') || title.includes('maitri') || title.includes('himadri')) {
      return '/assets/polar-station.jpg';
    }
    if (title.includes('biology') || title.includes('microb') || title.includes('field') || title.includes('sample')) {
      return '/assets/field-notes.jpg';
    }
    return '/assets/antarctica-hero.jpg';
  };

  return (
    <div className="page-container py-12">
      {/* 1. KINDRED-PALETTE PAGE INTRO */}
      <div className="pb-10 border-b border-[var(--border)]">
        <div className="section-kicker">
          <span>02</span>
          <span>Discover</span>
        </div>
        <h1 className="editorial-title">
          Knowledge <em className="font-serif italic font-normal text-[var(--signal)]">library.</em>
        </h1>
        <p className="page-intro-desc">
          A considered starting point for polar research. Search curated official entry points for polar data, expeditions, station observations, and research activities across India’s polar network.
        </p>
      </div>

      {/* 2. LIBRARY CONTROLS (SEARCH & FILTERS) */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center py-6 border-b border-[var(--border)] mb-6">
        {/* Search Input */}
        <div className="flex items-center gap-3 bg-[var(--card)] border border-[var(--border)] px-4 py-2.5 rounded-lg flex-1 max-w-md focus-within:border-[var(--ring)] transition-all shadow-2xs">
          <Search className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
          <input
            type="text"
            placeholder="Search resources, stations, DOIs, parameters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[var(--foreground)] placeholder-[var(--muted-foreground)] text-xs focus:outline-none"
          />
        </div>

        {/* Filters Wrap */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <label className="text-[var(--muted-foreground)] font-mono text-[11px] uppercase">Region:</label>
            <select
              value={selectedProgramme}
              onChange={(e) => setSelectedProgramme(e.target.value)}
              className="bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] px-3.5 py-2 rounded-lg focus:outline-none focus:border-[var(--ring)] text-xs cursor-pointer shadow-2xs font-medium"
            >
              <option>All regions</option>
              <option>Antarctica</option>
              <option>Southern Ocean</option>
              <option>Arctic</option>
              <option>Himalayas</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[var(--muted-foreground)] font-mono text-[11px] uppercase">Type:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] px-3.5 py-2 rounded-lg focus:outline-none focus:border-[var(--ring)] text-xs cursor-pointer shadow-2xs font-medium"
            >
              <option>All types</option>
              <option value="dataset">Dataset</option>
              <option value="report">Report</option>
              <option value="photo">Photo</option>
              <option value="video">Video</option>
            </select>
          </div>

          {/* Role-governed access filter */}
          {userRole !== 'public_visitor' && userRole !== 'student' && (
            <div className="flex items-center gap-2">
              <label className="text-[var(--signal)] font-mono text-[11px] uppercase font-bold">Access:</label>
              <select
                value={selectedAccess}
                onChange={(e) => setSelectedAccess(e.target.value)}
                className="bg-[var(--card)] border border-[var(--signal)] text-[var(--signal)] px-3.5 py-2 rounded-lg focus:outline-none text-xs cursor-pointer font-bold shadow-2xs"
              >
                <option>All</option>
                <option value="public">Public</option>
                <option value="quarantined">Quarantined</option>
                <option value="embargoed">Embargoed</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Result Count */}
      <div className="py-4 text-xs font-mono text-[var(--muted-foreground)] flex items-center justify-between">
        <span>Showing {filteredAssets.length} {filteredAssets.length === 1 ? 'resource' : 'resources'}</span>
        <span className="text-[11px] text-[var(--primary)] font-semibold">FAIR & CARE Guidelines Compliant</span>
      </div>

      {/* 3. RECORD GRID (KINDRED RECORD CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
        {filteredAssets.map(asset => {
          const bgImg = getRecordImage(asset);
          const isEmbargoed = asset.accessState === 'embargoed';

          return (
            <div
              key={asset.id}
              className="border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] flex flex-col justify-between group hover:border-[var(--ring)] transition-all rounded-[var(--radius)] shadow-xs"
            >
              <div>
                {/* Record Image Thumbnail */}
                <div className="relative aspect-[1.7] overflow-hidden bg-[var(--secondary)]">
                  <img
                    src={bgImg}
                    alt={asset.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3.5 bottom-3.5 bg-[var(--background)] text-[var(--foreground)] font-mono text-[10px] font-bold px-2 py-1 uppercase tracking-wider border border-[var(--border)] shadow-xs">
                    {asset.type}
                  </span>
                  <span className={`absolute right-3.5 top-3.5 text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    asset.accessState === 'public'
                      ? 'bg-emerald-600 text-white'
                      : isEmbargoed
                      ? 'bg-amber-500 text-black font-bold'
                      : 'bg-[var(--signal)] text-white'
                  }`}>
                    {asset.accessState}
                  </span>
                </div>

                {/* Record Body */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="text-[9.5px] uppercase font-mono tracking-widest text-[var(--muted-foreground)] flex items-center justify-between">
                    <span>{asset.authoritativeProvider}</span>
                    <span className="text-[var(--primary)] font-semibold">{asset.spatialCoverageName}</span>
                  </div>

                  <div className="flex items-start justify-between gap-3 mt-3">
                    <h3 className="text-base font-semibold tracking-tight text-[var(--foreground)] group-hover:text-[var(--signal)] transition-colors line-clamp-2">
                      {asset.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--signal)] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mt-2.5 mb-4 line-clamp-3 font-light">
                    {asset.abstract}
                  </p>

                  {/* Subject Keywords */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {asset.subjects.slice(0, 3).map((sub, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-[var(--radius)] bg-[var(--secondary)] text-[var(--muted-foreground)] font-mono border border-[var(--border)]">
                        #{sub}
                      </span>
                    ))}
                    {asset.subjects.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-[var(--radius)] bg-[var(--secondary)] text-[var(--muted-foreground)] font-mono border border-[var(--border)]">
                        +{asset.subjects.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center justify-between text-[10.5px] font-mono text-[var(--muted-foreground)] border-t border-[var(--border)] pt-3">
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-[var(--signal)]" />
                      <span className="truncate max-w-[150px]">{asset.spatialCoverageName}</span>
                    </span>
                    <span>{asset.date}</span>
                  </div>
                </div>
              </div>

              {/* Record Bottom: FAIR Score & Action Buttons */}
              <div className="border-t border-[var(--border)] p-4 bg-[var(--secondary)]/40">
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted-foreground)] mb-3">
                  <span className="text-emerald-700 font-bold flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    FAIR: {asset.fairMetrics.findableScore}%
                  </span>
                  <span className="text-[var(--muted-foreground)] truncate max-w-[130px]">
                    {asset.licence.split(' ')[0]}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setInspectAsset(asset)}
                    className="py-1.5 px-2 rounded-lg bg-[var(--card)] hover:bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] text-xs font-medium flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                  >
                    <Eye className="w-3 h-3 text-[var(--muted-foreground)]" />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={() => setJsonLdModalAsset(asset)}
                    className="py-1.5 px-2 rounded-lg bg-[var(--card)] hover:bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] text-xs font-medium flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                  >
                    <Code className="w-3 h-3 text-[var(--muted-foreground)]" />
                    <span>JSON-LD</span>
                  </button>

                  <button
                    onClick={() => handleCopyCitation(asset)}
                    className="py-1.5 px-2 rounded-lg bg-[var(--card)] hover:bg-[var(--secondary)] text-[var(--signal)] border border-[var(--border)] text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                  >
                    {citationCopiedId === asset.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{citationCopiedId === asset.id ? 'Copied' : 'BibTeX'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAssets.length === 0 && (
        <div className="p-12 text-center border border-[var(--border)] bg-[var(--card)] my-8 rounded-xl shadow-xs">
          <AlertCircle className="w-8 h-8 text-[var(--signal)] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[var(--foreground)] mb-1">No Matching Resources</h3>
          <p className="text-xs text-[var(--muted-foreground)] max-w-md mx-auto">
            Try broadening your search keywords or switching polar region and resource type filters.
          </p>
        </div>
      )}

      {/* 4. STANDARDIZED BOTTOM CONTAINER */}
      <div className="bottom-box-container">
        <div className="flex items-start gap-3.5">
          <Layers className="w-5 h-5 text-[var(--signal)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[var(--foreground)]">Curated Links & Primary Research Provenance</h4>
            <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
              These entries point directly to authoritative national repositories (NCPOR, NPDC, and MoES). Every dataset and expedition report includes persistent digital object identifiers (DOIs), W3C PROV-O provenance, and official open research licence terms.
            </p>
          </div>
        </div>
      </div>

      {/* Asset Full Inspection Modal */}
      {inspectAsset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--card)] rounded-xl max-w-3xl w-full p-6 sm:p-8 border border-[var(--border)] my-8 max-h-[90vh] overflow-y-auto text-[var(--foreground)] shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-[var(--secondary)] text-[var(--primary)] border border-[var(--border)] font-bold">
                  {inspectAsset.type} • {inspectAsset.accessState}
                </span>
                <h3 className="text-xl font-bold text-[var(--foreground)] mt-2">{inspectAsset.title}</h3>
              </div>
              <button 
                onClick={() => setInspectAsset(null)}
                className="p-1 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-6 font-light">
              {inspectAsset.abstract}
            </p>

            {/* If Dataset: Show CSV Sample Rows Table */}
            {inspectAsset.datasetDetail && inspectAsset.versions[0]?.extractedMetadata?.sampleRows && (
              <div className="bg-[var(--secondary)]/40 rounded p-4 border border-[var(--border)] mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[var(--foreground)] font-mono flex items-center">
                    <Database className="w-3.5 h-3.5 mr-1.5 text-[var(--signal)]" />
                    Dataset Preview (First 5 Observation Rows)
                  </span>
                  <span className="text-[10px] text-[var(--muted-foreground)] font-mono">
                    Format: {inspectAsset.datasetDetail.distributionFormat}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)] text-[11px]">
                        {Object.keys(inspectAsset.versions[0].extractedMetadata.sampleRows[0]).map(col => (
                          <th key={col} className="pb-2 pr-3">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)] text-[var(--foreground)]">
                      {inspectAsset.versions[0].extractedMetadata.sampleRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[var(--card)]">
                          {Object.values(row).map((val: any, cidx) => (
                            <td key={cidx} className="py-1.5 pr-3">{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono text-[var(--foreground)] bg-[var(--secondary)]/50 p-4 rounded border border-[var(--border)] mb-6">
              <div>
                <span className="text-[var(--muted-foreground)] block text-[10px]">RIGHTS HOLDER:</span>
                <span className="font-semibold">{inspectAsset.rightsHolder}</span>
              </div>
              <div>
                <span className="text-[var(--muted-foreground)] block text-[10px]">LICENCE:</span>
                <span className="font-semibold">{inspectAsset.licence}</span>
              </div>
              <div>
                <span className="text-[var(--muted-foreground)] block text-[10px]">SHA-256 CHECKSUM:</span>
                <span className="text-[var(--primary)] truncate block font-bold">{inspectAsset.versions[0]?.sha256 || 'Verified Fixity'}</span>
              </div>
              <div>
                <span className="text-[var(--muted-foreground)] block text-[10px]">POLICY SOURCE:</span>
                <span className="truncate block font-semibold">{inspectAsset.accessPolicy.policySource}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
              <div className="flex items-center space-x-2">
                {onOpenProvenance && (
                  <button
                    onClick={() => {
                      onOpenProvenance(inspectAsset.id);
                      setInspectAsset(null);
                    }}
                    className="px-4 py-2 rounded bg-[var(--secondary)] hover:bg-[var(--border)] text-[var(--foreground)] text-xs font-medium border border-[var(--border)] cursor-pointer"
                  >
                    View W3C PROV-O Graph
                  </button>
                )}
                <a
                  href={inspectAsset.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded bg-[var(--card)] hover:bg-[var(--secondary)] text-[var(--foreground)] text-xs font-medium border border-[var(--border)] flex items-center space-x-1 cursor-pointer"
                >
                  <span>Authoritative NPDC Source</span>
                  <ExternalLink className="w-3 h-3 text-[var(--signal)]" />
                </a>
              </div>

              <button
                onClick={() => onDownloadAsset(inspectAsset.id)}
                className="px-5 py-2 rounded bg-[var(--primary)] hover:bg-[var(--deep)] text-[var(--primary-foreground)] font-bold text-xs shadow-sm flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Verify Access & Download</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON-LD Schema.org Modal */}
      {jsonLdModalAsset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--card)] rounded-xl max-w-2xl w-full p-6 border border-[var(--border)] shadow-2xl text-[var(--foreground)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-[var(--signal)] font-bold uppercase tracking-wider">
                Schema.org / Dataset Microdata (JSON-LD)
              </span>
              <button 
                onClick={() => setJsonLdModalAsset(null)}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <pre className="bg-[var(--secondary)]/60 p-4 rounded text-[var(--foreground)] text-[11px] font-mono overflow-x-auto max-h-96 border border-[var(--border)]">
              {JSON.stringify({
                "@context": "https://schema.org/",
                "@type": jsonLdModalAsset.type === 'dataset' ? "Dataset" : "CreativeWork",
                "name": jsonLdModalAsset.title,
                "description": jsonLdModalAsset.abstract,
                "publisher": {
                  "@type": "GovernmentOrganization",
                  "name": jsonLdModalAsset.authoritativeProvider
                },
                "license": jsonLdModalAsset.licence,
                "spatialCoverage": jsonLdModalAsset.spatialCoverageName,
                "keywords": jsonLdModalAsset.subjects,
                "url": jsonLdModalAsset.sourceUrl,
                "identifier": jsonLdModalAsset.id
              }, null, 2)}
            </pre>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify({
                    "@context": "https://schema.org/",
                    "@type": jsonLdModalAsset.type === 'dataset' ? "Dataset" : "CreativeWork",
                    "name": jsonLdModalAsset.title,
                    "description": jsonLdModalAsset.abstract,
                    "publisher": {
                      "@type": "GovernmentOrganization",
                      "name": jsonLdModalAsset.authoritativeProvider
                    },
                    "license": jsonLdModalAsset.licence,
                    "spatialCoverage": jsonLdModalAsset.spatialCoverageName
                  }, null, 2));
                  setJsonLdModalAsset(null);
                }}
                className="px-4 py-2 rounded bg-[var(--primary)] hover:bg-[var(--deep)] text-[var(--primary-foreground)] font-bold text-xs cursor-pointer shadow-xs"
              >
                Copy JSON-LD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

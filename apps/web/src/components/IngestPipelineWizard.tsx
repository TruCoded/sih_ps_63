import React, { useState } from 'react';
import { 
  FileCheck, 
  Upload, 
  ShieldCheck, 
  Cpu, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Eye, 
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Asset, UserRole } from '../../../../packages/shared-types/index.js';

interface IngestPipelineWizardProps {
  userRole: UserRole;
  onAssetIngested: (newAsset: Asset) => void;
}

export const IngestPipelineWizard: React.FC<IngestPipelineWizardProps> = ({ 
  userRole, 
  onAssetIngested 
}) => {
  const [step, setStep] = useState<number>(1);
  const [fileName, setFileName] = useState<string>('44_ISEA_Maitri_Seismic_Survey.pdf');
  const [fileType, setFileType] = useState<string>('report');
  const [title, setTitle] = useState<string>('44th ISEA Maitri-II Bedrock Seismic Baseline and Permafrost Survey');
  const [abstract, setAbstract] = useState<string>('Preliminary subsurface geophysical survey and seismic refraction profiling at Schirmacher Oasis to validate bedrock stability for India’s proposed Maitri II green research complex.');
  const [expedition, setExpedition] = useState<string>('exp-43-isea');
  const [rightsHolder, setRightsHolder] = useState<string>('NCPOR / Ministry of Earth Sciences');
  const [licence, setLicence] = useState<string>('NCPOR Open Research Data Licence');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [checksum, setChecksum] = useState<string>('');

  const calculateCompleteness = () => {
    let score = 0;
    if (title.length > 5) score += 20;
    if (abstract.length > 20) score += 20;
    if (expedition) score += 20;
    if (rightsHolder) score += 20;
    if (licence) score += 20;
    return score;
  };

  const handleSimulateUpload = () => {
    setIsProcessing(true);
    setStep(2);

    // Simulate multi-stage pipeline: SHA256 -> ClamAV -> OCR/EXIF
    setTimeout(() => {
      setChecksum('a9f4c3b2e1d087654321fedcba0987654321fedcba0987654321fedcba098765');
      setStep(3);
      setIsProcessing(false);
    }, 1500);
  };

  const handleFinalSubmit = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: fileType,
          title,
          abstract,
          expeditionId: expedition,
          rightsHolder,
          licence,
          actorName: 'Field Geophysicist',
          actorRole: userRole
        })
      });
      const data = await res.json();
      if (data.success) {
        onAssetIngested(data.data);
        setStep(4);
      }
    } catch (err) {
      console.error('Ingest error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const completeness = calculateCompleteness();

  return (
    <div className="page-container py-12">
      {/* 1. KINDRED-PALETTE PAGE INTRO */}
      <div className="pb-10 border-b border-[var(--border)] mb-8">
        <div className="section-kicker">
          <span>09</span>
          <span>Ingest</span>
        </div>
        <h1 className="editorial-title">
          Field Asset <em className="font-serif italic font-normal text-[var(--signal)]">ingestion pipeline.</em>
        </h1>
        <p className="page-intro-desc">
          Standardized ingestion for expedition teams: files enter an isolated quarantine bucket, undergo cryptographic fixity verification (SHA-256), automated security screening, and metadata extraction before reaching the curation queue.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-[var(--card)] rounded-[var(--radius)] p-4 mb-8 border border-[var(--border)] flex items-center justify-between shadow-xs overflow-x-auto">
        {[
          { num: 1, label: 'Select & File Check' },
          { num: 2, label: 'Fixity & Security Scan' },
          { num: 3, label: 'Metadata & EXIF Review' },
          { num: 4, label: 'Quarantine Enqueued' }
        ].map((s) => (
          <div key={s.num} className="flex items-center space-x-2.5 shrink-0 px-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
              step >= s.num
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs'
                : 'bg-[var(--secondary)] text-[var(--muted-foreground)] border border-[var(--border)]'
            }`}>
              {s.num}
            </div>
            <span className={`text-xs font-semibold ${
              step >= s.num ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'
            }`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-[var(--card)] rounded-[var(--radius)] p-6 sm:p-8 border border-[var(--border)] space-y-5 shadow-xs">
          {step === 1 && (
            <>
              <h3 className="text-base font-bold text-[var(--foreground)] mb-2">Step 1: Ingest File Details</h3>

              {/* Dropzone */}
              <div className="border-2 border-dashed border-[var(--border)] rounded-[var(--radius)] p-8 text-center hover:border-[var(--signal)] transition-all bg-[var(--secondary)]/40 cursor-pointer">
                <Upload className="w-8 h-8 text-[var(--signal)] mx-auto mb-2" />
                <div className="text-xs font-semibold text-[var(--foreground)]">Click or drag polar field data file</div>
                <div className="text-[11px] text-[var(--muted-foreground)] mt-1">PDF, NetCDF, CSV, TIFF, MP4 (Max: 500 MB)</div>
                <div className="mt-3 inline-block px-3 py-1 rounded-[var(--radius)] bg-[var(--card)] text-[var(--foreground)] font-mono text-xs border border-[var(--border)] shadow-2xs">
                  Selected: {fileName}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1 font-mono">ASSET TYPE:</label>
                  <select
                    aria-label="Select Asset Type"
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="w-full bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)] cursor-pointer"
                  >
                    <option value="report">Expedition / Cruise Report</option>
                    <option value="dataset">Scientific Dataset (CSV / NetCDF)</option>
                    <option value="photo">High-Res Field Imagery</option>
                    <option value="video">Documentary / Field Footage</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1 font-mono">LINKED EXPEDITION:</label>
                  <select
                    aria-label="Select Linked Expedition"
                    value={expedition}
                    onChange={(e) => setExpedition(e.target.value)}
                    className="w-full bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)] cursor-pointer"
                  >
                    <option value="exp-43-isea">43rd ISEA (Antarctica)</option>
                    <option value="exp-arctic-svalbard">Arctic Svalbard Campaign</option>
                    <option value="exp-soe-12">12th Southern Ocean Expedition</option>
                    <option value="exp-himalayas-chandra">Western Himalayas Himansh</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1 font-mono">TITLE:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1 font-mono">ABSTRACT:</label>
                <textarea
                  rows={3}
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  className="w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)] leading-relaxed"
                />
              </div>

              <button
                disabled={isProcessing}
                onClick={handleSimulateUpload}
                className="w-full py-3 rounded-[var(--radius)] bg-[var(--primary)] hover:bg-[var(--deep)] text-[var(--primary-foreground)] font-bold text-xs shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <span>Initiate Quarantine Upload & Fixity Scan</span>
              </button>
            </>
          )}

          {step === 2 && (
            <div className="py-12 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-[var(--signal)] animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-[var(--foreground)]">Running Fixity Verification & Quarantine Security Scan</h3>
              <p className="text-xs text-[var(--muted-foreground)] max-w-md mx-auto leading-relaxed">
                Computing SHA-256 cryptographic digest, validating binary magic bytes, and executing ClamAV threat signatures...
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center space-x-2 text-emerald-600 text-xs font-bold font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Fixity Verified & Security Checks Passed</span>
              </div>

              <div className="bg-[var(--secondary)] p-3.5 rounded-[var(--radius)] border border-[var(--border)] text-xs font-mono space-y-1">
                <div className="text-[var(--muted-foreground)]">SHA-256 HASH FIXITY:</div>
                <div className="text-[var(--foreground)] font-semibold break-all">{checksum}</div>
              </div>

              <div className="bg-[var(--card)] p-4 rounded-[var(--radius)] border border-[var(--border)] space-y-2 text-xs shadow-2xs">
                <div className="font-bold text-[var(--foreground)] font-mono flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                  Derivatives & Metadata Extraction Complete:
                </div>
                <ul className="space-y-1 text-[var(--muted-foreground)] pl-4 list-disc text-[11px] leading-relaxed">
                  <li>PDF Page Count: 48 pages parsed; clean text extracted for RAG chunks.</li>
                  <li>EXIF Stripping: Sensitive field GPS coordinates sanitized for environmental privacy.</li>
                  <li>MIME Type: Validated application/pdf via file magic bytes.</li>
                  <li>Original File Storage: Encrypted in private S3 bucket <code>s3://ncpor-quarantine-raw/</code>.</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1 font-mono">RIGHTS HOLDER:</label>
                  <input
                    type="text"
                    value={rightsHolder}
                    onChange={(e) => setRightsHolder(e.target.value)}
                    className="w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1 font-mono">LICENCE:</label>
                  <input
                    type="text"
                    value={licence}
                    onChange={(e) => setLicence(e.target.value)}
                    className="w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
                  />
                </div>
              </div>

              <button
                disabled={isProcessing}
                onClick={handleFinalSubmit}
                className="w-full py-3 rounded-[var(--radius)] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <span>Submit to Curator Review Queue (Quarantined)</span>
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="py-8 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-bold text-[var(--foreground)]">Asset Enqueued in Quarantine</h3>
              <p className="text-xs text-[var(--muted-foreground)] max-w-md mx-auto leading-relaxed">
                Your asset has been placed into the <strong>Quarantined</strong> state. An audit event was recorded. It is now awaiting curator validation and FAIR compliance sign-off before public catalogue exposure.
              </p>
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-[var(--radius)] bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--deep)] font-bold text-xs transition-colors cursor-pointer"
              >
                Ingest Another Asset
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Ingest Policy & FAIR Readiness Meter (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[var(--card)] rounded-[var(--radius)] p-6 border border-[var(--border)] space-y-5 shadow-xs">
            <h4 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider font-mono">
              Metadata Quality & FAIR Readiness
            </h4>

            {/* Completeness Gauge */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-[var(--muted-foreground)]">Completeness Score:</span>
                <span className={completeness === 100 ? 'text-emerald-600 font-bold' : 'text-[var(--signal)] font-bold'}>
                  {completeness}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--secondary)] overflow-hidden border border-[var(--border)]">
                <div 
                  style={{ width: `${completeness}%` }}
                  className="h-full bg-[var(--signal)] transition-all duration-300"
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center space-x-2 text-[var(--foreground)]">
                {title.length > 5 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />}
                <span>Descriptive Scientific Title</span>
              </div>
              <div className="flex items-center space-x-2 text-[var(--foreground)]">
                {abstract.length > 20 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />}
                <span>Detailed Contextual Abstract</span>
              </div>
              <div className="flex items-center space-x-2 text-[var(--foreground)]">
                {expedition ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />}
                <span>Expedition & Region Lineage</span>
              </div>
              <div className="flex items-center space-x-2 text-[var(--foreground)]">
                {rightsHolder ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />}
                <span>Explicit Rights Holder Authority</span>
              </div>
              <div className="flex items-center space-x-2 text-[var(--foreground)]">
                {licence ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />}
                <span>Reusable Open Research Licence</span>
              </div>
            </div>

            {/* Policy Notes */}
            <div className="border-t border-[var(--border)] pt-4 text-[11px] text-[var(--muted-foreground)] space-y-2 leading-relaxed">
              <div className="text-[var(--foreground)] font-semibold flex items-center">
                <Lock className="w-3 h-3 text-[var(--signal)] mr-1" />
                Zero Direct Public Exposure:
              </div>
              <p>
                Under NCPOR data policy, contributors cannot publish directly to the public catalogue. Every asset must be validated by an accredited Data Curator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Copy, 
  Check, 
  UserCheck, 
  ShieldAlert, 
  Layers, 
  ExternalLink,
  Sliders,
  Send,
  Hash,
  Download,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Asset, ContentDraft, UserRole } from '../../../../packages/shared-types/index.js';

interface ContentStudioProps {
  assets: Asset[];
  userRole: UserRole;
  onSelectAsset?: (assetId: string) => void;
}

export const ContentStudio: React.FC<ContentStudioProps> = ({ assets, userRole }) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || 'ncpor-rep-43isea');
  const [targetAudience, setTargetAudience] = useState<string>('school_students');
  const [channel, setChannel] = useState<string>('educational_explainer');
  const [tone, setTone] = useState<string>('engaging');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [generating, setGenerating] = useState(false);

  // Active Draft State (Live Editable)
  const [activeDraft, setActiveDraft] = useState<ContentDraft | null>({
    id: "draft-demo-01",
    title: "Unlocking Antarctic Secrets: How 43-ISEA Drilled 120m into Ancient Ice",
    sourceAssetVersionIds: ["ver-43rep-v1", "ver-maitrimet-v2"],
    targetAudience: "school_students",
    channel: "educational_explainer",
    tone: "inspiring",
    generatedHeadline: "❄️ Journey to the Bottom of the Earth: Inside India's 43rd Antarctic Mission!",
    generatedBody: "Did you know that ice sheets in Antarctica act like frozen time machines? During the 43rd Indian Scientific Expedition to Antarctica (43-ISEA), Indian scientists at Maitri Station drilled 120 meters deep into the continental ice sheet! Each layer of trapped air bubbles tells us what Earth's atmosphere was like thousands of years ago.\n\nWhile temperatures dropped below -18°C with biting katabatic winds exceeding 28 knots, our scientists operated sophisticated lasers and sensors to measure atmospheric dust and green auroras dancing over Bharati station.",
    bulletPoints: [
      "Maitri Station is located in the Schirmacher Oasis at -70.767°S, 11.733°E",
      "Ice cores preserve ancient atmospheric air samples from centuries ago",
      "Bharati station tracked auroral electrojets continuously for 94 days",
      "All data is preserved according to international FAIR data stewardship"
    ],
    suggestedAltText: "Illustration of Indian scientific team operating ice drilling rig in snowstorm at Maitri Station Antarctica.",
    citationLinks: [
      {
        claim: "Indian scientists at Maitri Station drilled 120 meters deep into the continental ice sheet",
        assetId: "ncpor-rep-43isea",
        assetTitle: "43rd Indian Scientific Expedition Report",
        pageOrTimestamp: "Page 14, Section 3.2",
        sourceUrl: "https://data.ncpor.res.in/PolarDirectory/home"
      },
      {
        claim: "temperatures dropped below -18°C with biting katabatic winds",
        assetId: "ncpor-ds-maitri-met",
        assetTitle: "Maitri Station Decadal Surface Meteorology",
        pageOrTimestamp: "AWS Table 2.1",
        sourceUrl: "https://npdc.ncpor.res.in/npdc/homepage.action"
      }
    ],
    claimsNeedingVerification: [
      "Confirm whether 120m drill represents the entire Holocene boundary or upper 800 years."
    ],
    licenceAttributionStatement: "Source: National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences. Licensed under CC-BY-4.0.",
    status: "pending_review",
    createdAt: new Date().toISOString()
  });

  const [hashtags, setHashtags] = useState<string[]>(['#PolarResearch', '#Antarctica', '#ClimateAction', '#NCPOR', '#MoES']);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [copied, setCopied] = useState(false);

  // Live Claim Verification Radar
  const [verifyingClaims, setVerifyingClaims] = useState(false);
  const [claimVerificationResult, setClaimVerificationResult] = useState<any | null>({
    overallScore: 98,
    isApprovedForReview: true,
    checks: [
      { aspect: 'Scientific Accuracy', status: 'Passed', score: 98, details: 'Correlates with 43-ISEA report executive summary.' },
      { aspect: 'Provenance Linkage', status: 'Passed', score: 100, details: 'Tied to authoritative NCPOR / NPDC source.' },
      { aspect: 'Geographic & Security Filter', status: 'Passed', score: 100, details: 'No classified defense or embargoed data leaks.' }
    ]
  });

  const approvedAssets = assets.filter(a => a.accessState === 'public');

  const handleGeneratePack = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/content-drafts/generate-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryAssetId: selectedAssetId,
          audience: targetAudience,
          channel,
          tone,
          customInstructions: customPrompt,
          actorName: 'Science Communicator'
        })
      });
      const data = await res.json();
      if (data.success) {
        setActiveDraft(data.data);
        if (data.data.hashtags) setHashtags(data.data.hashtags);
        // Automatically run verification
        handleRunClaimVerification(data.data.generatedBody);
      }
    } catch (err) {
      console.error('Failed to generate pack:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleRunClaimVerification = async (textToVerify?: string) => {
    setVerifyingClaims(true);
    try {
      const res = await fetch('/api/content-drafts/verify-claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftText: textToVerify || activeDraft?.generatedBody || '',
          primaryAssetId: selectedAssetId
        })
      });
      const data = await res.json();
      if (data.success) {
        setClaimVerificationResult(data.data);
      }
    } catch (e) {
      console.error('Claim verification failed:', e);
    } finally {
      setVerifyingClaims(false);
    }
  };

  const handleApproveDraft = async () => {
    if (!activeDraft) return;
    try {
      const res = await fetch(`/api/content-drafts/${activeDraft.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewerName: 'Chief Communications Officer',
          notes: reviewerNotes || 'Verified claims against primary records.'
        })
      });
      const data = await res.json();
      if (data.success) {
        setActiveDraft(data.data);
      }
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const handleCopyPack = () => {
    if (!activeDraft) return;
    const text = `# ${activeDraft.generatedHeadline}\n\n${activeDraft.generatedBody}\n\nKey Takeaways:\n${activeDraft.bulletPoints?.map(b => `- ${b}`).join('\n')}\n\nHashtags: ${hashtags.join(' ')}\n\nAlt-Text: ${activeDraft.suggestedAltText}\n\n${activeDraft.licenceAttributionStatement}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getCharLimit = () => {
    if (channel === 'twitter_thread') return 280;
    if (channel === 'instagram_carousel') return 2200;
    return 5000;
  };

  const charCount = activeDraft ? activeDraft.generatedBody.length : 0;
  const charLimit = getCharLimit();

  return (
    <div className="page-container py-12">
      {/* 1. KINDRED-PALETTE PAGE INTRO */}
      <div className="pb-10 border-b border-[var(--border)] mb-8">
        <div className="section-kicker">
          <span>06</span>
          <span>Dissemination</span>
        </div>
        <h1 className="editorial-title">
          Evidence-Grounded <em className="font-serif italic font-normal text-[var(--signal)]">content studio.</em>
        </h1>
        <p className="page-intro-desc">
          Transform raw expedition reports and datasets into high-impact, audience-tailored outreach packs. Automated synthesis enforces strict claim-to-source mapping, verifies claims with AI, and requires human reviewer sign-off before dissemination.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Generation Controls & Live Verification Radar (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[var(--border)] bg-[var(--card)] rounded-2xl p-6 space-y-5 shadow-xs">
            <h3 className="text-base font-bold text-[var(--foreground)] flex items-center">
              <Sparkles className="w-4 h-4 text-[var(--signal)] mr-2" />
              Configure AI Dissemination Pack
            </h3>

            {/* Source Asset Selection */}
            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5 font-mono">
                1. SELECT APPROVED PRIMARY ASSET:
              </label>
              <select
                aria-label="Select Approved Primary Asset"
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full bg-[var(--secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)] cursor-pointer"
              >
                {approvedAssets.map(a => (
                  <option key={a.id} value={a.id}>
                    [{a.type.toUpperCase()}] {a.title.substring(0, 50)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Target Audience */}
            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5 font-mono">
                2. TARGET AUDIENCE:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'school_students', label: 'School Students' },
                  { id: 'general_public', label: 'General Public' },
                  { id: 'journalists_press', label: 'Press & Media' },
                  { id: 'policymakers', label: 'Policy Analysts' }
                ].map(aud => (
                  <button
                    key={aud.id}
                    onClick={() => setTargetAudience(aud.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                      targetAudience === aud.id
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-xs'
                        : 'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--secondary)]'
                    }`}
                  >
                    {aud.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Output Channel */}
            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5 font-mono">
                3. OUTPUT CHANNEL:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'educational_explainer', label: 'Educational Story' },
                  { id: 'instagram_carousel', label: 'Social Carousel' },
                  { id: 'press_release', label: 'Press Release' },
                  { id: 'twitter_thread', label: 'Micro-Post Series' }
                ].map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setChannel(ch.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                      channel === ch.id
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-bold shadow-xs'
                        : 'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--secondary)]'
                    }`}
                  >
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom AI Editorial Instructions */}
            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1.5 font-mono">
                4. EDITORIAL PROMPT / EMPHASIS:
              </label>
              <input
                type="text"
                placeholder="e.g. Focus on Indian monsoon link; add 3 key stats..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full bg-[var(--secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)]"
              />
            </div>

            {/* Generate Action Button */}
            <button
              disabled={generating}
              onClick={handleGeneratePack}
              className="w-full py-3 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--deep)] text-[var(--primary-foreground)] font-bold text-xs shadow-xs hover:shadow-xs flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer hover:-translate-y-0.5"
            >
              {generating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing LLM Media Pack...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Grounded Story Pack</span>
                </>
              )}
            </button>
          </div>

          {/* AI Claim Verification Radar Box */}
          {claimVerificationResult && (
            <div className="bg-[var(--card)] rounded-2xl p-6 border border-emerald-500/30 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-[var(--foreground)] font-mono uppercase">
                    AI Claim Verification Radar
                  </span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold">
                  {claimVerificationResult.overallScore}% Accuracy
                </span>
              </div>

              <div className="space-y-2">
                {claimVerificationResult.checks.map((chk: any, idx: number) => (
                  <div key={idx} className="bg-[var(--secondary)]/40 p-2.5 rounded-[var(--radius)] border border-[var(--border)] text-xs font-mono">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[var(--foreground)] font-semibold">{chk.aspect}</span>
                      <span className="text-emerald-700 font-bold text-[10px]">{chk.status}</span>
                    </div>
                    <p className="text-[10px] text-[var(--muted-foreground)] font-sans">{chk.details}</p>
                  </div>
                ))}
              </div>

              <button
                disabled={verifyingClaims}
                onClick={() => handleRunClaimVerification()}
                className="w-full py-2 rounded-[var(--radius)] bg-[var(--card)] hover:bg-[var(--secondary)] text-xs text-[var(--signal)] border border-[var(--border)] font-mono flex items-center justify-center space-x-1.5 transition-all cursor-pointer font-bold shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${verifyingClaims ? 'animate-spin' : ''}`} />
                <span>Re-Verify Edited Draft with AI</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive Editor & Reviewer Console (7 Cols) */}
        {activeDraft && (
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[var(--card)] rounded-[var(--radius)] p-6 sm:p-8 border border-[var(--border)] relative overflow-hidden shadow-xs">
              {/* Draft Status & Watermark Badge */}
              <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 rounded-[var(--radius)] text-xs font-mono font-bold uppercase border ${
                    activeDraft.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
                  }`}>
                    {activeDraft.status === 'approved' ? '✓ APPROVED FOR PUBLICATION' : '⚠ DRAFT — REVIEW REQUIRED'}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] font-mono font-medium">
                    {activeDraft.channel.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyPack}
                    className="px-3 py-1.5 rounded-[var(--radius)] bg-[var(--secondary)] hover:bg-[var(--border)] text-[var(--foreground)] border border-[var(--border)] text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Pack'}</span>
                  </button>
                </div>
              </div>

              {/* Editable Headline */}
              <div className="mb-3">
                <label className="text-[10px] font-mono text-[var(--muted-foreground)] block mb-1">HEADLINE / TITLE:</label>
                <input
                  type="text"
                  value={activeDraft.generatedHeadline}
                  onChange={(e) => setActiveDraft({ ...activeDraft, generatedHeadline: e.target.value })}
                  className="w-full bg-[var(--secondary)]/40 border border-[var(--border)] rounded-[var(--radius)] px-3 py-2 text-sm font-bold text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
                />
              </div>

              {/* Live Editable Story Body */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-[10px] font-mono text-[var(--muted-foreground)] mb-1">
                  <span>DISSEMINATION BODY (LIVE EDITABLE):</span>
                  <span className={charCount > charLimit ? 'text-rose-600 font-bold' : 'text-[var(--muted-foreground)]'}>
                    {charCount} / {charLimit} chars
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={activeDraft.generatedBody}
                  onChange={(e) => setActiveDraft({ ...activeDraft, generatedBody: e.target.value })}
                  className="w-full bg-[var(--secondary)]/40 border border-[var(--border)] rounded-[var(--radius)] p-4 text-xs sm:text-sm text-[var(--foreground)] leading-relaxed focus:outline-none focus:border-[var(--ring)]"
                />
              </div>

              {/* AI Viral Hashtags Pill Bar */}
              {hashtags.length > 0 && (
                <div className="bg-[var(--secondary)]/30 rounded-[var(--radius)] p-3 border border-[var(--border)] mb-4 flex flex-wrap items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[var(--signal)]" />
                  <span className="text-[10px] font-mono text-[var(--muted-foreground)] mr-1">SUGGESTED HOOKS:</span>
                  {hashtags.map((h, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--card)] text-[var(--primary)] border border-[var(--border)] font-semibold shadow-2xs">
                      {h}
                    </span>
                  ))}
                </div>
              )}

              {/* Suggested Alt-Text */}
              <div className="bg-[var(--secondary)]/30 rounded-[var(--radius)] p-3 border border-[var(--border)] mb-4 text-xs font-mono">
                <span className="text-[var(--muted-foreground)] block mb-1">ACCESSIBLE ALT-TEXT:</span>
                <span className="text-[var(--foreground)] italic">{activeDraft.suggestedAltText}</span>
              </div>

              {/* Claim-to-Source Verification Mapping */}
              <div className="bg-[var(--secondary)]/40 rounded-[var(--radius)] p-4 border border-[var(--border)] mb-4">
                <div className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider mb-2 font-mono flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1 text-[var(--signal)]" />
                  Evidence Traceability Mapping (Zero AI Hallucination):
                </div>
                <div className="space-y-2">
                  {activeDraft.citationLinks.map((cl, i) => (
                    <div key={i} className="text-xs text-[var(--foreground)] flex items-start justify-between gap-2 border-b border-[var(--border)] pb-1.5">
                      <div>
                        <span className="font-semibold text-[var(--foreground)]">Claim: </span>"{cl.claim}"
                        <div className="text-[10px] text-[var(--primary)] mt-0.5 font-semibold">
                          Source: {cl.assetTitle} ({cl.pageOrTimestamp})
                        </div>
                      </div>
                      <a href={cl.sourceUrl} target="_blank" rel="noreferrer" className="text-[var(--muted-foreground)] hover:text-[var(--signal)]">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Human Reviewer Sign-off Action */}
              <div className="border-t border-[var(--border)] pt-4">
                {activeDraft.status === 'approved' ? (
                  <div className="p-3 rounded-[var(--radius)] bg-emerald-50 border border-emerald-300 text-xs font-mono text-emerald-900 flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="font-bold">Signed off by: </span> {activeDraft.reviewedBy} at {new Date(activeDraft.reviewedAt || '').toLocaleTimeString()}
                      <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{activeDraft.reviewerNotes}</div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-amber-700 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1 text-amber-600" />
                      Human Reviewer Sign-Off Required before Public Release
                    </div>
                    <input
                      type="text"
                      placeholder="Add editorial verification notes..."
                      value={reviewerNotes}
                      onChange={(e) => setReviewerNotes(e.target.value)}
                      className="w-full bg-[var(--secondary)]/40 border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)]"
                    />
                    <button
                      onClick={handleApproveDraft}
                      className="w-full py-2.5 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--deep)] text-[var(--primary-foreground)] font-bold text-xs shadow-xs hover:shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer hover:-translate-y-0.5"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Verify Claims & Approve for Public Release</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Standardized Bottom Container */}
      <div className="bottom-box-container">
        <div className="flex items-start gap-4">
          <div className="bottom-box-icon">
            <Share2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[var(--foreground)]">Evidence Traceability & Public Dissemination Protocol</h4>
            <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
              All generated press releases, educational carousels, and scientific summaries enforce mandatory bi-directional citation mapping. Every factual claim must link to an immutable NCPOR expedition report or NPDC open dataset DOI. Direct dissemination without human reviewer clearance is strictly prohibited by MoES outreach guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

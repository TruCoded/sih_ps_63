# SIH26063 — research pack and implementation plan

## 1. Scope and product position

**Problem:** Integrated Polar Science Outreach, Knowledge Repository and Media Dissemination Portal for the Ministry of Earth Sciences / National Centre for Polar and Ocean Research (NCPOR).

This plan treats the portal as an **outreach and discovery layer**, connected to—not a replacement for—the National Polar Data Centre (NPDC). The long-term system must preserve provenance, versioning, access conditions, and rights; the student prototype must prove one complete flow from expedition asset to a public, reviewed science story.

### Why this framing matters

NCPOR already exposes station observations, polar datasets, project/technical-report and expedition directory fields, cruise summaries, and data-submission guidance. Its Arctic call for proposals says metadata and expedition reports are compulsory and final project data must be submitted; its cited polar policies also include lock-in/embargo conditions. Therefore, build for **federated discovery and controlled linking** first. Do not bulk-copy source data, bypass download terms, or assume every NCPOR asset is open.

The portal's distinct value is:

- a single, public-facing expedition narrative across reports, datasets, papers, media, and activities;
- simple discovery for students, journalists, educators and researchers;
- rights-aware media reuse; and
- evidence-grounded, human-approved communications output.

## 2. Curated data-source catalogue

“All” possible polar data sources cannot be exhaustively enumerated: collections, licences, availability and APIs change. This is the implementable, authoritative shortlist to put in the proposal, demo, and future integrations. Each source must be rechecked for its licence, attribution, API terms, rate limits, and access restrictions at integration time.

### A. NCPOR and Indian sources — first priority

| Source | What it contributes | Prototype use | Integration posture |
|---|---|---|---|
| [NCPOR / NPDC home and data portal](https://npdc.ncpor.res.in/npdc/homepage.action) | Polar datasets, station observations, science keywords, locations, data-submission guidance and expedition-related resources | Use a small manually curated list of public dataset records and links; show that the portal routes users to the authoritative source | Deep-link and retain NPDC source URL, identifier, access condition and attribution. Ask NCPOR before harvesting or caching. |
| [NCPOR Polar Directory](https://data.ncpor.res.in/PolarDirectory/home) | Indian Antarctic expedition, project/technical report, member/contributor, station and keyword discovery | Build an expedition card model around these fields | Future read-only adapter after NCPOR approval; no scraping of authenticated areas. |
| [NPDC cruise summaries](https://npdc.ncpor.res.in/npdc/cruiseSummary.jsp) | Ship, cruise number, dates, chief scientist, area, objective and report link | Excellent seed data for a “Voyage to impact” demo timeline | Record source report URL; link rather than mirror PDF unless permitted. |
| [NCPOR station weather/data](https://data.ncpor.res.in/) | Current and historical station observation discovery for Maitri, Bharati, Himadri and Himansh | A small live weather widget, clearly labelled “source: NCPOR” | Cache briefly only if terms permit; resilient fallback to last successful reading. |
| [NCPOR Southern Ocean programme](https://www.ncpor.res.in/pages/display/270-southern-ocean) | Programme context, expedition reports, publications and scientific highlights | Curate one Southern Ocean project as the demo story | Editorial source; retain publication date and source URL. |
| [NCPOR news archive](https://ncpor.res.in/news/archive/page%3A1?day=&month=05&year=) | Official institutional activities and expedition updates | Seed “Activities” records and show content-generation workflow | RSS/API if officially offered; otherwise manual editorial intake. |
| [data.gov.in](https://www.data.gov.in/) | Future national open-data discovery and catalogue exposure | Mention as phase-3 interoperability, not a dependency for the MVP | Publish selected open metadata/data only after institutional approval. |

**Important policy observation.** NCPOR material found during research describes different programme-specific periods (for example, an Arctic proposal document states public release may occur after five years; an older Antarctic policy mentions a two-year lock-in). This is a strong reason to store `accessPolicy`, `embargoUntil`, `rightsHolder`, and `policySource` on each asset—never a hard-coded “publish after N years” rule.

### B. International scientific reference/discovery sources

| Source | Suitable use | API / access note |
|---|---|---|
| [SCAR Antarctic Master Directory](https://www.scar.org/data-products/amd/) | Discovery of Antarctic datasets and projects | Use as an external catalogue link; preserve provider attribution. |
| [SOOSmap / Southern Ocean Observing System](https://soos.aq/soosmap/) | Discover standardised Southern Ocean datasets and observing activities | Use map overlays/links only after checking source licences. |
| [PANGAEA](https://www.pangaea.de/) | Citable Earth and environmental-science datasets, especially polar/ocean research | Search and link to dataset landing pages/DOIs; do not republish data without licence review. |
| [NASA Earthdata CMR](https://cmr.earthdata.nasa.gov/search/site/docs/search/api.html) | Search NASA Earth-observation collection metadata, including polar satellite products | Use collection metadata search; an Earthdata login may be required for data access. |
| [Copernicus Climate Data Store API](https://cds.climate.copernicus.eu/how-to-api) | ERA5/reanalysis data, climate visualisations and reproducible data requests | Requires an account/API key and acceptance of dataset licences. Good for a future “context layer,” not hackathon ingestion. |
| [Argo Global Data Assembly Centres](https://argo.ucsd.edu/data/argo-data-products/) | Quality-controlled temperature/salinity profile context for Southern Ocean stories | Link/download selected, properly cited profiles; do not claim NCPOR ownership. |
| [OBIS](https://portal.obis.org/data/access/) | Marine biodiversity occurrence data, summaries and map overlays | API is appropriate for small queries; OBIS recommends AWS Open Data for large downloads. |
| [GBIF Occurrence API](https://techdocs.gbif.org/en/openapi/v1/occurrence) | Species occurrence checking, taxonomy look-up and public biodiversity context | `occurrence/search` is suitable for filtered exploration; bulk downloads require a registered account and attribution. |
| [OpenAlex](https://developers.openalex.org/api-reference/introduction) | Related works, authors, topics and institutions | Public scholarly-discovery enrichment; store source ID and retrieval date. |
| [Crossref REST API](https://api.crossref.org/) | DOI lookup and citation metadata | Use DOI lookup, not automated truth correction; author records may be incomplete. |
| [ORCID](https://info.orcid.org/documentation/) | Persistent researcher identity | Link contributors with consent; avoid presenting an unverified name match as an ORCID assertion. |
| [DataCite REST API](https://support.datacite.org/docs/api) | DOI metadata retrieval and later DOI workflow | Public retrieval is separate from authenticated DOI creation/updating. |

### C. Basemap, geographic and educational media sources

| Resource | Use | Caution |
|---|---|---|
| [Natural Earth](https://www.naturalearthdata.com/) | Lightweight public-domain map boundaries for local/offline prototype | Attribute according to its terms; simplify geometries for performance. |
| [OpenStreetMap](https://www.openstreetmap.org/copyright) | General base map outside polar regions | Follow attribution and tile-service policy; do not use public tiles for heavy production traffic. |
| [OpenAerialMap](https://openaerialmap.org/) | Optional discoverable open imagery | Verify each image collection’s licence and spatial suitability. |
| [Wikimedia Commons](https://commons.wikimedia.org/) | Carefully chosen educational/supporting imagery | Every file has its own licence and attribution requirements. It is not a substitute for NCPOR-owned media. |

### D. What belongs in the hackathon demo corpus

Use only assets with clear permission, public NCPOR links, or team-created media. Make a `demo-corpus-manifest.csv` containing `assetId, title, sourceURL, owner, licence, accessLevel, attribution, consentStatus, allowedUses`. The recommended set is:

1. One publicly linkable NCPOR cruise/expedition report.
2. One small public environmental CSV/NetCDF excerpt or a synthetic, clearly labelled sample derived from it.
3. Six team-created photos or openly licensed images with attribution.
4. One 30–60 second team-created narration/video, plus a transcript.
5. Two official NCPOR news/activity records linked back to the archive.
6. A geographically safe route GeoJSON with non-sensitive points.

Never present downloaded data as NCPOR-owned merely because the team used it in a map.

## 3. Research papers and standards to cite

### Essential reading and design justification

| Reference | Why it matters to SIH26063 | Design decision it supports |
|---|---|---|
| Wilkinson, M. et al. (2016), [“The FAIR Guiding Principles for scientific data management and stewardship”](https://doi.org/10.1038/sdata.2016.18), *Scientific Data*, 3, 160018. | The canonical basis for making research data findable, accessible, interoperable and reusable. | Persistent identifiers; rich metadata; searchable catalogue; explicit licences; provenance; machine-readable exports. |
| ISO (2025), [ISO 14721:2025 OAIS reference model](https://committee.iso.org/cms/live/live/en/sites/isoorg/contents/data/standard/08/74/87471.html?browse=ics). | Defines the archival perspective: ingest, preservation/storage, data management, access and dissemination. | Preserve originals, hashes, versions, fixity checks, and derivatives separately. Do not equate “upload” with preservation. |
| W3C (2013), [PROV overview](https://www.w3.org/TR/prov-overview/). | Defines interoperable provenance representation. | Implement `derivedFrom`, `used`, `wasGeneratedBy`, actor, time and source links; expose a lightweight provenance graph. |
| Carroll, S. et al. (2020), [“The CARE Principles for Indigenous Data Governance”](https://doi.org/10.5334/dsj-2020-043), *Data Science Journal*, 19, 43. | FAIR alone does not decide who should control sensitive/community knowledge. | Add community/ethics restrictions, consent and authority-to-control fields; do not publish cultural/sensitive knowledge by default. |
| Lewis, P. et al. (2020), [“Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks”](https://papers.neurips.cc/paper/2020/hash/6b493230205f780e1bc26945df7481e5-Abstract.html), NeurIPS 33. | Establishes the retrieve-then-generate model used for grounded answers. | Retrieve approved source chunks, attach citations and refuse unsupported claims. |
| Gao, Y. et al. (2024), [“Retrieval-Augmented Generation for Large Language Models: A Survey”](https://arxiv.org/abs/2312.10997). | Useful survey of naive, advanced and modular RAG patterns and open challenges. | Use metadata filters, hybrid retrieval, reranking, evaluation set and source citations—not a “chat with PDFs” demo. |
| Phogat, P., Rab, S. & Wan, M. (2025), [“Science communication in the digital age”](https://doi.org/10.1177/18758789251342896). | Reviews public engagement, media and digital-science-communication research. | Make communications audience/channel-specific, interactive and measurable—not only one-way auto-posting. |
| JCOM (2025), [“How does social-media-based science communication affect young audiences?”](https://jcom.sissa.it/article/pubid/JCOM_2405_2025_V02/). | Useful evidence review for the Smart Education framing. | Add explainers, visual stories, captions, quizzes and feedback—not just formal PDFs. |

### Domain-specific institutional reading

- [NPDC user manual](https://npdc.ncpor.res.in/npdc/static/npdc_user_manual.pdf): explains that NPDC manages and disseminates India’s polar-program data and covers varied fields including glacier, meteorology, oceanography and atmospheric science.
- [NCPOR Arctic expedition call/data policy](https://ncpor.res.in/files/Arctic%202024-25/Call%20for%20Proposals_Arctic%20Expedition_2024-25.pdf): source for metadata/report submission requirements and programme-specific release policy.
- [NCPOR older Antarctic expedition data-policy notice](https://ncpor.res.in/files/39ISEA/39-ISEA-Advt-24-01-19.pdf): valuable evidence that data and full metadata must be archived after return and that ownership/lock-in conditions exist.
- [NCPOR Southern Ocean programme](https://www.ncpor.res.in/pages/display/270-southern-ocean): domain context and expedition/publication entry point.

## 4. Detailed implementation plan

### 4.1 Product boundaries

**MVP does:** ingest approved assets; preserve source/version metadata; create one expedition microsite; searchable catalogue; evidence-cited Q&A; generate reviewable content packs; link users to authoritative scientific data.

**MVP does not:** mint DOIs; replace NPDC; scrape protected sources; silently repost media; publish to social networks without approval; guarantee long-term certified preservation; expose sensitive locations; perform original scientific analysis.

### 4.2 Roles and access matrix

| Role | Main permissions |
|---|---|
| Public visitor | View public records, story pages and approved downloads/links. |
| Registered researcher | Request/access approved restricted resources; save searches. |
| Contributor / expedition team | Create draft records and upload assets to their project only. |
| Data curator | Validate metadata, change access state, publish versions, manage embargoes. |
| Communications reviewer | Create/edit/approve content drafts using only approved public assets. |
| Administrator | Manage users, policy templates, integrations and audit export. |

Access states: `draft`, `quarantined`, `private`, `restricted`, `embargoed`, `public`, `withdrawn`. An asset can be public while its original file stays restricted and only an approved derivative is public.

### 4.3 Technical architecture

```text
React/Next.js public + staff portal
              |
          Express TypeScript API
              |
  +-----------+------------+------------------+
  |           |            |                  |
MongoDB     S3 storage   Redis/BullMQ      Meilisearch
records     originals    background jobs   faceted catalogue
audit       derivatives        |
                      OCR, EXIF, FFmpeg, Sharp, transcript
                                          |
                                       Qdrant/Atlas Vector Search
                                          |
                                     RAG + content-draft service
```

**Minimal local Docker services:** MongoDB, Redis, MinIO/S3-compatible storage, Meilisearch, Qdrant, API, and frontend. If this is too much for the team, keep MongoDB Atlas + Atlas Search/Vector Search and a cloud object bucket; retain Redis only for jobs.

### 4.4 Repository layout

```text
polar-outreach/
  apps/
    web/                 # React/Next.js interface
    api/                 # Express routes, auth, policies
    worker/              # BullMQ processors
  packages/
    shared-types/        # Zod schemas and TypeScript types
    metadata/            # profiles, validators, JSON-LD mapping
    ui/                  # reusable components
  infra/
    docker-compose.yml
    seed/                # manifest and lawful demo fixture data
  docs/
    architecture.md
    api-contract.md
    data-governance.md
    demo-script.md
```

### 4.5 Core collections / entities

| Entity | Required fields |
|---|---|
| `expeditions` | slug, title, programme, region, start/end date, route GeoJSON, lead, status, public summary |
| `assets` | type, title, abstract, expeditionId, source URL, contributors, subjects, date, spatial/temporal coverage, licence, rights holder, access state, current version |
| `assetVersions` | assetId, version, object key, SHA-256, byte size, MIME type, original filename, created by/time, processing state |
| `derivatives` | parent version, type, object key, format, dimensions/duration, public visibility |
| `datasets` | assetId, distribution links, schema/columns, units, method, quality notes, citation, DOI if known |
| `relationships` | from ID, predicate, to ID: `partOf`, `documents`, `usesDataset`, `depicts`, `derivedFrom`, `publishedAs` |
| `contentDrafts` | source versions, audience/channel, prompt version, body, citations, status, reviewer and final output |
| `auditEvents` | actor, action, target, time, before/after summary, request ID |

Use a generic `Asset` plus type-specific profile. This avoids writing disconnected workflows for PDFs, images, datasets and videos.

### 4.6 API contract

| Endpoint | Purpose |
|---|---|
| `POST /uploads/initiate` | Validate actor/type/size; return presigned or tus upload target. |
| `POST /uploads/:id/complete` | Create quarantined version; enqueue validation/processing. |
| `POST /assets` / `PATCH /assets/:id` | Create/edit metadata draft with server-side schema validation. |
| `POST /assets/:id/submit-review` | Freeze proposed version and request curation. |
| `POST /assets/:id/publish` | Curator-only access transition; index public-safe fields. |
| `GET /catalogue` | Filters: type, programme, date, region, keyword, licence, access. |
| `GET /expeditions/:slug` | Public expedition story model; only published assets. |
| `GET /assets/:id/download` | Enforce entitlement and return short-lived signed URL or authoritative source link. |
| `POST /ask` | Permission-filtered RAG answer with citations/page/time locators. |
| `POST /content-drafts` | Generate draft from explicit approved source-version IDs. |
| `POST /content-drafts/:id/approve` | Reviewer-only approval and immutable approval event. |

### 4.7 Ingest and media-processing specification

1. Authorised user initiates upload; server checks type, size and project scope.
2. Browser uploads directly using tus/presigned multipart upload.
3. Completion event creates `assetVersion` in `quarantined` state and calculates SHA-256.
4. Worker checks file signature (not only extension), antivirus scan, file-size policy and duplicate hash.
5. Store untouched original in a private bucket/prefix; use server-generated object keys.
6. Extract technical metadata:
   - PDF: page count, text by page, optional OCR for image-only pages.
   - CSV/XLSX: columns, inferred type, missingness, sample rows; never send whole sensitive data to an LLM.
   - Photo: dimensions, EXIF; strip GPS and camera identifiers from public derivative unless approved.
   - Video: duration, poster, 720p preview, audio track, transcript and timestamped captions.
7. Generate derivatives: thumbnail/WebP, PDF preview, video poster, transcript and dataset preview.
8. Create searchable document chunks with `assetVersionId`, locator (`page`, `timestamp`, row/sample), language, access state and rights label.
9. Curator sees metadata-completeness score and processing warnings, then publishes, restricts or requests revision.

### 4.8 Metadata profiles and validation

Mandatory for every asset: title, asset type, expedition/project relationship, contributor, date, source/origin, rights holder, licence or “all rights reserved”, access class, geographic sensitivity flag, language, abstract, keywords, and checksum/version.

Additional requirements:

- Dataset: methodology, units, columns/schema, temporal/spatial coverage, quality/limitations, distribution format and citation.
- Photo/video: creator, consent/release status, caption, alt text, location precision policy, visible people/wildlife tag.
- Report/publication: authors, report number/DOI if available, report date, executive summary, pages/sections.
- Activity: organiser, date, location, audience, media relationship and approval status.

Export a public-safe JSON-LD `schema.org/Dataset` or `CreativeWork` view. Use controlled vocabularies where possible: GCMD science keywords for Earth science, Darwin Core terms for biodiversity records, ISO 19115-style fields for geographic data, and DataCite/Dublin Core mappings for citation/discovery.

### 4.9 Search and RAG implementation

**Catalogue search:** index only public-safe title, abstract, keywords, dates, asset type, expedition, location, licence and source URL in Meilisearch. Configure filters/facets explicitly. Search records, not raw private files.

**RAG retrieval pipeline:**

1. Authenticate and calculate allowable access states/project IDs.
2. Search metadata and vectors only within those filters.
3. Retrieve 20 chunks; rerank; send 4–8 strongest chunks to the model.
4. Require claim-to-source mapping: `claim -> assetVersionId -> page/timestamp -> source URL`.
5. Render citations as clickable report pages, media timestamps or dataset records.
6. If the evidence does not support an answer, respond with a gap and useful search links.
7. Log query, selected source IDs and citation coverage—but do not log sensitive full content unnecessarily.

**Acceptance tests:** Prepare 20 questions with gold source records. The answer passes only if it cites at least one correct source, does not cite an inaccessible record, and contains no unsupported quantitative claim.

### 4.10 Content-studio implementation

Inputs must be explicit: selected approved assets, target channel, audience, language, desired tone, campaign goal and maximum length.

Output should contain:

- headline/caption;
- plain-language summary;
- evidence/source links;
- attribution and licence statement;
- suggested accessible alt text;
- claims needing human verification;
- platform-ready character count/format; and
- a `draft` watermark/status.

Do not let the model choose unrestricted assets, create scientific facts, schedule posts, or publish directly. “Generate a post from evidence” is defensible; “autopilot social media” is not.

### 4.11 Security, governance and operating controls

- Use short-lived signed upload/download URLs and private originals.
- Verify magic bytes, use allowlists, quarantine and scan; rename server-side; cap file size; rate-limit upload and AI endpoints.
- Enforce access filters before both text search and vector retrieval.
- Record all access-policy changes, publication, download and content-draft approvals in an audit log.
- Separate public media derivatives from originals; strip sensitive EXIF/GPS.
- Store secrets only in deployment secret manager / environment variables, never in client code or repository.
- Implement a delete/withdrawal workflow that removes public derivatives and indexes while retaining required audit record.
- Keep a policy template per programme and obtain NCPOR approval for licence, embargo and external-sharing decisions.

## 5. Ordered delivery roadmap

### Phase 0 — 1–2 days before build

- Confirm mentor/NCPOR constraints: authoritative links, media permission, preferred language, embargo assumptions and demo approval.
- Produce demo-corpus manifest and attribution page.
- Draw six screens: home, expedition, catalogue, asset detail, curator queue, content studio.
- Define 20 search/RAG evaluation questions and 5 prohibited questions (private/sensitive cases).

### Phase 1 — hackathon Day 1: trusted archive foundation

| Owner | Deliverable | Done when |
|---|---|---|
| Frontend | Expedition and catalogue UI | Public expedition renders responsive map/timeline/asset cards. |
| Backend | Auth roles, asset/expedition CRUD | Contributor cannot publish; public endpoint omits non-public records. |
| Platform | Docker and object storage | One demo image/PDF reaches private storage and is retrievable only through API. |
| Data/UX | Seed manifest and metadata wizard | Every demo asset displays title, source, licence and status. |

### Phase 2 — hackathon Day 2 morning: discovery and provenance

- Worker generates thumbnail, extracted PDF text and basic EXIF metadata.
- Meilisearch indexes public records and supports filters.
- Asset details show source, rights, related records and version checksum.
- Map/timeline tells a coherent Antarctica/Arctic/Southern Ocean story.

### Phase 3 — hackathon Day 2 afternoon: trusted AI and showcase

- Add RAG over the approved, small demo corpus only.
- Return source cards with page/timestamp locators.
- Add content studio with reviewer approval state.
- Build “before/after” demo: scattered report/data/media becomes one evidence-backed post.
- Execute 20 scripted queries and take screenshots of results/metrics.

### Phase 4 — 4 to 8 weeks after prototype

1. NCPOR-approved source adapters and editorial import workflow.
2. Institutional SSO, production observability, backups and retention policy.
3. Formal metadata crosswalk; JSON-LD/API export; DataCite DOI process where eligible.
4. Multilingual UI, accessibility audit, human translation/editorial workflow.
5. Real social-media integrations only after app review, token governance, approval and legal sign-off.
6. IIIF for high-resolution image collections and richer dataset visualisation.

## 6. Backlog priority

| Priority | Stories |
|---|---|
| P0 | Create an expedition; upload asset; capture mandatory metadata; set access state; show public asset page; search/filter; source attribution. |
| P1 | Derivatives; text extraction; curator queue; related assets; timeline/map; dataset preview; audit events. |
| P2 | Cited RAG; content studio; exportable social pack; bilingual drafting; analytics dashboard. |
| P3 | SSO; NPDC adapters; IIIF; DOI integration; publishing/scheduling; advanced GIS/3D virtual station. |

## 7. Demo success criteria

- 100% of demo assets have source and rights metadata.
- Public search cannot return restricted fixture records.
- At least 10 scripted discovery queries lead to the correct asset in under 15 seconds.
- Every RAG answer used in the demo has visible source citation/page/time locator.
- Every generated content draft visibly states source/attribution and remains unapproved until a reviewer action.
- A screenshot/record proves processing stages: uploaded → quarantined → enriched → reviewed → published.

## 8. Suggested pitch line

“PolarConnect turns India’s polar expeditions from scattered files into a trusted, living knowledge system: scientists preserve and share evidence, students explore the mission, and communications teams create reviewable stories that always lead back to the science.”


# PolarConnect API Contract Specification
**Base URL:** `/api`
**Version:** `1.0.0`
**Content-Type:** `application/json`

---

## Endpoints Overview

| Method | Endpoint | Description | Auth / Role Required |
|---|---|---|---|
| `GET` | `/stations/weather` | Returns real-time & cached telemetry for Maitri, Bharati, Himadri, Himansh | Public |
| `GET` | `/expeditions` | List all polar expeditions with filter by programme | Public |
| `GET` | `/expeditions/:slug` | Retrieve single expedition with waypoints, route GeoJSON, linked assets | Public |
| `GET` | `/assets/catalogue` | Faceted search across assets with filters (type, programme, access, licence) | Public (filters applied) |
| `GET` | `/assets/:id` | Full asset detail including versions, derivatives, and FAIR metrics | Role-based |
| `POST` | `/assets` | Create a new draft asset record | Contributor / Curator |
| `PATCH` | `/assets/:id` | Update metadata fields of an existing draft asset | Contributor / Curator |
| `POST` | `/uploads/initiate` | Initiate upload session and obtain target allocation | Contributor / Curator |
| `POST` | `/uploads/:id/complete` | Complete upload, generate SHA-256 fixity, trigger quarantine & OCR | Contributor / Curator |
| `POST` | `/assets/:id/submit-review` | Submit quarantined asset for curation review | Contributor |
| `POST` | `/assets/:id/publish` | Approve and publish asset into public catalogue | Curator / Admin |
| `GET` | `/assets/:id/download` | Verify access entitlements and return authorized download or source link | Role-based |
| `POST` | `/ask` | Execute permission-filtered RAG query with claim-to-source citations | Public / Researcher |
| `POST` | `/content-drafts` | Generate audience-specific communication pack from approved assets | Contributor / Comms |
| `POST` | `/content-drafts/:id/approve` | Final sign-off and approval of communication pack | Comms Reviewer / Admin |
| `GET` | `/audit-events` | Fetch system-wide governance audit log | Curator / Admin |
| `GET` | `/provenance/:assetId` | Retrieve W3C PROV-O graph (nodes and edges) | Public / Researcher |
| `GET` | `/eval/rag-benchmark` | Run automated 20-question benchmark suite & return accuracy scores | Public / Auditor |

---

## Detailed Payload Examples

### `POST /ask`
**Request Body:**
```json
{
  "query": "What are the primary objectives of the 43rd Indian Scientific Expedition to Antarctica?",
  "role": "public_visitor"
}
```
**Response Body:**
```json
{
  "query": "What are the primary objectives of the 43rd Indian Scientific Expedition to Antarctica?",
  "answer": "The 43rd Indian Scientific Expedition to Antarctica (43-ISEA) focused on: (1) paleoclimate reconstruction via shallow ice cores from Amery Ice Shelf and Dronning Maud Land, (2) geomagnetic pulsations and auroral electrojet mapping at Maitri and Bharati stations, (3) extremophile microbial bioprospecting in Schirmacher Oasis lakes, and (4) geotechnical bedrock baseline surveys for the upcoming Maitri-II modern base.",
  "citations": [
    {
      "assetId": "ncpor-rep-43isea",
      "assetTitle": "43rd Indian Scientific Expedition to Antarctica Report",
      "versionId": "ver-43rep-v1",
      "pageOrTimeLocator": "Page 14, Section 3.2",
      "sourceUrl": "https://data.ncpor.res.in/PolarDirectory/home",
      "chunkSnippet": "The expedition achieved 100% of planned scientific milestones...",
      "relevanceScore": 0.96
    }
  ],
  "evidenceFound": true,
  "isUnsupportedOrGap": false,
  "groundingConfidence": 98,
  "processingTimeMs": 34,
  "evaluatedPolicies": ["NCPOR Polar Data Policy 2024 (NPDC-POL-04)"]
}
```

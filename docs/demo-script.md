# PolarConnect Hackathon Demo Script & Evaluation Walkthrough

## Demo Overview (5-Minute Winning Pitch)

1. **Introduction & Pitch (0:00 - 0:45)**
   - "PolarConnect turns India’s polar expeditions from scattered files into a trusted, living knowledge system: scientists preserve and share evidence, students explore the mission, and communications teams create reviewable stories that always lead back to the science."
   - Showcase the Live Station Telemetry HUD: Real-time sensor feeds for Maitri (-18°C), Bharati (-14°C), Himadri (-2°C), and Himansh (-11°C) with NCPOR/IMD attribution.

2. **Interactive 3D/2D Polar Command & Voyage Explorer (0:45 - 1:30)**
   - Navigate from East Antarctica (Maitri & Bharati) up to Svalbard (Himadri) and high in the Western Himalayas (Himansh).
   - Click "43rd Indian Scientific Expedition to Antarctica" to view the Voyage Timeline ("Voyage to Impact"), waypoints from Cape Town across the Southern Ocean, and linked peer-reviewed datasets.

3. **Curated Scientific Catalogue with FAIR/CARE Governance (1:30 - 2:15)**
   - Demonstrate faceted filtering across all polar domains.
   - Inspect the "Maitri Decadal Surface Meteorology" dataset: display column definitions, sample CSV rows, schema.org JSON-LD, BibTeX citation, and direct authoritative link to NPDC.
   - Point out the FAIR score (100%) and CARE ethical data compliance.

4. **PolarAI Grounded RAG Assistant & Benchmark Evaluation (2:15 - 3:15)**
   - Ask: *"What are the primary objectives of the 43rd ISEA?"* -> Show the exact response citing Page 14 of the 43-ISEA report.
   - Demonstrate refusal on restricted queries: Run the benchmark test suite to execute 20 Gold Questions (100% accuracy) and 5 Prohibited Queries (100% refusal with security/embargo explanations).

5. **Science Communication Studio with Human Reviewer Workflow (3:15 - 4:00)**
   - Select approved assets -> Generate an educational explainer for school students or an Instagram carousel script.
   - Highlight the verifiable claims list, automatic alt-text, and the "Draft" watermark until approved by a communications reviewer.

6. **Ingestion & Quarantine Pipeline & Provenance Graph (4:00 - 4:45)**
   - Show how a newly uploaded asset goes through Quarantine -> SHA-256 fixity check -> OCR/EXIF stripping -> Curator review.
   - Display the W3C PROV-O graph showing clear lineage from expedition raw file to public social pack.

7. **Conclusion & MoES Vision (4:45 - 5:00)**
   - Explain how PolarConnect complements the National Polar Data Centre (NPDC) to inspire millions of Indian youth in Earth Sciences.

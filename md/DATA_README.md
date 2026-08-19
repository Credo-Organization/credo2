# PRAMAAN — Seed Data v1.0

Two files. Both are dependencies for Modules 4, 5 and 6 — nothing downstream works without them.

| File | Contents |
|---|---|
| `pramaan_skill_taxonomy.json` | **296 skills**, 12 categories, collision-free |
| `pramaan_opportunities.json` | **10 internships**, weighted requirements mapped to real skill IDs |

---

## 1. Taxonomy

### Category counts

| Code | Category | Count |
|---|---|---|
| LANG | Programming Languages | 25 |
| FE | Frontend | 40 |
| BE | Backend | 36 |
| DB | Databases & Data Stores | 30 |
| AI | AI / ML / Data Science | 43 |
| OPS | DevOps / Cloud / Infrastructure | 34 |
| MOB | Mobile | 15 |
| QA | Testing & Quality | 15 |
| DES | Design & UX | 18 |
| PRD | Product / Analytics | 18 |
| SEC | Security | 12 |
| TOOL | Developer Tools & Practices | 10 |
| | **Total** | **296** |

### Schema

```json
{
  "id": "SK-FE-003",
  "canonical_name": "React",
  "category": "FE",
  "subcategory": "UI framework",
  "aliases": ["React.js", "ReactJS", "react", "React 18"],
  "manifest_packages": {
    "npm": ["react", "react-dom"],
    "pip": [], "maven": [], "go": [], "composer": [], "gem": []
  },
  "file_hints": [".jsx", ".tsx"],
  "esco_hint": "web application development",
  "lightcast_hint": "React (Web Framework)",
  "demand_tier": "high",
  "notes": ""
}
```

### How each field is used

| Field | Used by | Purpose |
|---|---|---|
| `aliases` | Module 4 (Normaliser) | Exact-match lookup before falling back to embeddings. Avg 4.8 aliases per skill. |
| `manifest_packages` | Module 2 (GitProof) | Direct dependency → skill mapping from `package.json`, `requirements.txt`, `pom.xml`, `go.mod`, `composer.json`, `Gemfile`. This is your strongest GitHub signal. |
| `file_hints` | Module 2 | Filename/extension detection for skills with no dependency footprint (Docker, Terraform, CI configs). |
| `esco_hint` / `lightcast_hint` | Slide 3 | Standards-alignment claim. **Descriptive labels only — no numeric IDs were invented.** |
| `demand_tier` | UI ordering | Not a scoring input. |

### Guarantees (verified programmatically)

- ✅ 296 unique IDs, zero-padded, sequential within category
- ✅ **Zero alias collisions** — no string maps to two skills, so normalisation is deterministic
- ✅ Zero duplicate canonical names
- ✅ **Zero soft skills** — no "communication", "leadership", "teamwork", "problem solving". Every entry is evidenceable from code, a credential, or a named artefact.
- ✅ No fabricated ESCO/Lightcast IDs

### 9 merges applied during consolidation

Both halves independently produced these; the duplicate was folded into the better-fitting category and its aliases preserved:

`Web Accessibility` → FE · `Responsive Web Design` → FE · `Nginx` → OPS · `Postman` → QA · `Maven` → TOOL · `Gradle` → TOOL · `Power BI` → PRD · `Tableau` → PRD · `Bash Scripting` → LANG

### 5 ambiguities resolved by stripping aliases

| Alias removed | From | Why |
|---|---|---|
| `elk`, `elastic stack` | Elasticsearch (DB-010) | ELK Stack (OPS-027) is a distinct observability skill |
| `firebase` | Firebase Auth (BE-031) | Bare token belongs to the Firebase umbrella (OPS-024) |
| `sql queries` | SQL for Analytics (PRD-016) | Kept distinct from SQL the language (LANG-015) |
| `tf` | TensorFlow (AI-013) **and** Terraform (OPS-006) | Genuinely ambiguous — removed from both rather than guessing |

---

## 2. Opportunities

10 postings. Requirement weights sum to exactly 100 each; every `skill_id` validated against the taxonomy.

| ID | Title | Discipline |
|---|---|---|
| OPP-001 | AI/ML Engineering Intern | AI |
| OPP-002 | Backend Engineering Intern | Backend |
| OPP-003 | Frontend Engineering Intern | Frontend |
| OPP-004 | Full Stack Developer Intern | Full stack |
| OPP-005 | Data Analyst Intern | Data |
| OPP-006 | Mobile App Developer Intern | Mobile |
| OPP-007 | DevOps & Cloud Intern | Infrastructure |
| OPP-008 | UI/UX Design Intern | **Design** |
| OPP-009 | Product Analyst Intern | **Product** |
| OPP-010 | QA Automation Intern | **Quality** |

The last three exist deliberately. They're what lets you say **"multidisciplinary"** without it being a stretch — six software roles alone would not have supported that claim.

### Schema

```json
{
  "id": "OPP-001",
  "title": "AI/ML Engineering Intern",
  "org_name": "Kavach Analytics",
  "location": "Bengaluru (Hybrid)",
  "duration": "6 months",
  "description": "...",
  "is_demo": true,
  "requirements": [
    { "skill_id": "SK-LANG-001", "skill_name": "Python",
      "weight": 22, "is_critical": true }
  ]
}
```

`is_critical` feeds two things: the team-formation redundancy constraint (≥2 members on critical skills), and gap severity in the match explanation.

---

## 3. Honest limitations — say these before a judge does

1. **Company names are fictional.** `is_demo: true` is on every record. Do not imply these are live postings.
2. **Requirement weights are our judgement**, not employer-supplied. They're plausible, not sourced. If asked: *"hand-authored from typical Indian internship postings; a real deployment would take weights from the employer."*
3. **ESCO/Lightcast fields are hints, not mappings.** Descriptive labels for later manual alignment. Claiming "ESCO-mapped" would be false — claim **"ESCO/Lightcast-aligned taxonomy"** and be ready to explain the difference.
4. **296, not 300.** Nine merges after collision resolution. A collision-free 296 is worth more than a padded 300 — do not add filler to hit a round number.
5. **Coverage is skewed to software.** DES/PRD/SEC/QA total 63 of 296. Fine for this scope; don't claim comprehensive coverage of non-technical fields.

---

## 4. Before you build on this

- [ ] Skim the taxonomy for skills your team actually has evidence for — you'll be demoing with your own GitHub accounts
- [ ] Check `manifest_packages` for your own stack; add anything missing
- [ ] Confirm the 10 opportunities cover the career goals in your onboarding dropdown
- [ ] Decide the embedding model for Module 4 (`all-MiniLM-L6-v2` recommended) and precompute the 296 vectors once at startup
- [ ] Alias lookup runs **before** embeddings — it's exact, free, and handles most real inputs

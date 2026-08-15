# S30 — Technical Build Spec
## Stack, architecture, feature surface, and how it actually gets built in 10 days

> Written as the tech lead would write it. Every choice has a reason, and where I've picked the boring option over the impressive one, I say why.

---

## 0. The three engineering decisions that decide this project

Before any stack list, these are the calls that matter. Get them wrong and the other 95% of decisions don't save you.

| # | Decision | Call | Why |
|---|---|---|---|
| 1 | Credential proof format | **VC-JWT (EdDSA), not JSON-LD Data Integrity** | JSON-LD canonicalisation (URDNA2015) + `pyld` + document loaders is a genuine 2-day rabbit hole with cryptic failures. Open Badges 3.0 permits both proof formats. VC-JWT with Ed25519 is ~30 lines and works first try. **This one decision saves you two days.** |
| 2 | Skill matching mechanism | **Precomputed embeddings over a 300-skill curated taxonomy, in-memory numpy** | You do not need pgvector. n=300 → the entire similarity matrix is a 300×384 float array. Cosine sim is microseconds. Adding a vector DB adds ops surface and zero capability at this scale. |
| 3 | Long-running work | **Job table + FastAPI BackgroundTasks + frontend polling** | Ingestion takes 15–40s (PDF parse + GitHub fetch + LLM call). If that's a blocking HTTP request, your demo dies on stage the first time the network hiccups. No Celery, no Redis — a `jobs` table and a 2s poll is enough and can't break. |

---

## 1. Stack

### 1.1 Frontend

| Layer | Choice | Notes |
|---|---|---|
| Framework | **React 19 + TypeScript** | TS is non-negotiable — your API returns nested evidence structures and you will lose hours to `undefined` without it. |
| Build | **Vite** | Fast HMR. Don't use Next.js: you have no SSR/SEO need and it adds routing/rendering concepts you'll debug at 2am. |
| Styling | **Tailwind CSS** | |
| Components | **shadcn/ui** | Copy-in, not a dependency. You'll need to restyle evidence chips and shadcn lets you. |
| Server state | **TanStack Query** | **Essential**, not optional. Polling job status, cache invalidation after re-verification, retries. Hand-rolling this costs you a day. |
| Client state | **Zustand** (only if needed) | Most state is server state. Don't reach for Redux. |
| Charts | **Recharts** | Coverage bars, impact-ratio charts, evidence-age distribution. |
| Routing | **React Router v7** | |
| Forms | **react-hook-form + zod** | zod schemas shared conceptually with backend Pydantic models. |

### 1.2 Backend

| Layer | Choice | Notes |
|---|---|---|
| API | **FastAPI (Python 3.11+)** | Right call. Pydantic gives you request/response validation *and* it's how you constrain LLM output. |
| Server | **uvicorn** | |
| Validation | **Pydantic v2** | |
| DB driver | **SQLAlchemy 2.0 (async) + asyncpg** | Or `supabase-py` if you want speed over control. SQLAlchemy if anyone on the team knows it. |
| Migrations | **Alembic** | Or just versioned `.sql` files run through Supabase SQL editor. For 10 days, raw SQL files are honestly fine and less to learn. |

### 1.3 Data / Auth / Storage

**Supabase.** Correct choice from your brief, and for a non-obvious reason:

- Postgres (with `pgcrypto`, JSONB, and row-level security)
- Auth (email + GitHub OAuth — and GitHub OAuth is *itself* an evidence signal, since it proves account ownership)
- Storage (resume PDFs, certificate uploads)
- **RLS policies are your consent enforcement layer.** This matters: when a judge asks "how do you enforce that a recruiter only sees what the student shared?", the answer is a Postgres policy, not application code. Policies can't be forgotten in a code path. Show the SQL.

### 1.4 AI / ML

| Purpose | Choice | Rationale |
|---|---|---|
| Skill/claim extraction | **Gemini 2.x Flash** or **GPT-4o-mini** with native structured output | Cheap, fast, has a usable free tier. You need *schema compliance*, not intelligence — a small model with guaranteed JSON beats a big model with prose. Wrap with `instructor` if the SDK's structured mode is flaky. |
| Embeddings | **sentence-transformers `all-MiniLM-L6-v2`** | 80MB, CPU-only, 384-dim, runs locally. No API cost, no rate limit, no network dependency during demo. **Big reliability win.** |
| Fairness probe | **scikit-learn** (LogisticRegression + roc_auc_score) | 15 lines. |
| Team formation | **Pure Python greedy + PuLP** | PuLP bundles the CBC solver — no system install. |
| PDF text | **PyMuPDF (`fitz`)** | Faster and far better layout handling than pypdf. **Explicitly out of scope: scanned/OCR resumes.** Say so; don't half-build OCR. |
| GitHub | **httpx against REST v3** (or PyGithub) | Must use an authenticated token: 60 req/hr unauthenticated vs 5,000 authenticated. |
| Crypto | **`cryptography`** (Ed25519) + **`pyjwt[crypto]`** | For VC-JWT signing and verification. |
| Code sandbox | **Judge0** (self-hosted or public API) | See §6.3 — do not attempt Docker-in-Docker. |

### 1.5 Deployment

| Component | Where | ⚠️ Risk |
|---|---|---|
| Frontend | Vercel | Fine. |
| Backend | Render / Railway / Fly.io | **Free tiers spin down after ~15 min idle with 30–60s cold start.** On demo day this is fatal — you click "Analyse," nothing happens for 50 seconds, and you've lost the room. **Pay the $7 for one month**, or run a cron ping every 10 minutes. Do not gamble on this. |
| DB/Auth/Storage | Supabase | Free tier is fine. |
| Backup | **`docker-compose up` on the presenter's laptop + ngrok** | Rehearse this. Also record a 3-minute screen capture of the full happy path. |

### 1.6 What NOT to use

- **Blockchain** — you already decided this. Correct.
- **Next.js / SSR** — no benefit here, real cost.
- **Celery / Redis / RabbitMQ** — BackgroundTasks is sufficient at demo scale.
- **pgvector / Pinecone / Chroma** — 300 vectors. Use numpy.
- **Microservices** — one FastAPI app, module boundaries inside it.
- **LangChain / agent frameworks** — you make exactly one LLM call type (constrained extraction). A framework here is pure overhead and a hallucination risk you can't audit.
- **Docker-in-Docker for the micro-task checker** — see §6.3.

---

## 2. System architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  FRONTEND — React + Vite (Vercel)                                │
│  Student · Recruiter/Organiser · Audit dashboard                 │
└───────────────┬──────────────────────────────────────────────────┘
                │ HTTPS + Supabase JWT
┌───────────────▼──────────────────────────────────────────────────┐
│  FastAPI                                                          │
│                                                                   │
│  routers/     thin — auth, validation, job dispatch only          │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ INGESTION          resume · github · manual · certificate   │ │
│  │ EXTRACTION         LLM → constrained Pydantic schema        │ │  ← only LLM touchpoint
│  │ NORMALISATION      embeddings → 300-skill taxonomy          │ │
│  │ EVIDENCE GRADING   level · corroboration · recency          │ │  ← pure functions
│  │ VERIFICATION       VC-JWT signature + issuer registry       │ │  ← pure crypto
│  │ MATCHING           deterministic coverage scoring           │ │  ← pure functions
│  │ TEAM FORMATION     greedy submodular + ILP cross-check      │ │
│  │ EXPLANATION        templated from structured facts          │ │  ← NO LLM
│  │ FAIRNESS AUDIT     impact ratios + proxy probe (offline)    │ │
│  └─────────────────────────────────────────────────────────────┘ │
└───────┬──────────────────────────────────────┬───────────────────┘
        │ role: app_user                       │ role: auditor (read-only)
┌───────▼───────────────────────┐   ┌──────────▼────────────────────┐
│  SCHEMA: public               │   │  SCHEMA: audit                │
│  evidence, skills, matches…   │   │  self-declared protected      │
│  NO protected attributes      │   │  attributes, audit runs       │
│  (enforced by GRANT + RLS)    │   │  app_user has NO GRANT here   │
└───────────────────────────────┘   └───────────────────────────────┘
```

### The one architectural detail worth demoing

**Two Postgres schemas, two DB roles.** The role your matching code connects as (`app_user`) has *no GRANT* on the `audit` schema. Protected attributes are not "excluded by convention" — they are **unreachable from the matching code path at the database permission level**.

On stage, open a psql console as `app_user` and run `SELECT * FROM audit.protected_attributes;`:

```
ERROR:  permission denied for schema audit
```

That single error message is a better fairness argument than three slides. It's the difference between *"we didn't use it"* and *"we cannot use it."*

---

## 3. Database schema

```sql
-- ══════════════════ SCHEMA: public (matching path) ══════════════════

users(id, email, created_at, role)              -- role: student|recruiter|organiser|auditor
profiles(user_id, display_name, github_handle_verified, apaar_id_hash)
   -- NOTE: no college, no gender, no dob, no location. Deliberately.

skill_taxonomy(id, canonical_name, esco_id, lightcast_id,
               category, embedding vector_json, aliases text[])

evidence(id, user_id, source_type, raw_ref, storage_path,
         issuer_id, ingested_at, occurred_at, status)
   -- source_type: resume|github|manual|certificate|microtask
   -- status:      pending|processed|failed

evidence_claims(id, evidence_id, extracted_text, skill_id,
                match_confidence, llm_model, llm_run_id, unmapped_label)
   -- unmapped_label holds the raw string when confidence < threshold.
   -- These are SHOWN to the user, never silently dropped.

user_skills(user_id, skill_id, evidence_level, corroboration_count,
            last_demonstrated_at, recency_factor, evidence_strength,
            verification_status, computed_at)
   -- evidence_level:       0|1|2|3|3.5|4
   -- verification_status:  issuer_verified|authorship_linked|corroborated
   --                       |artefact_backed|self_reported|invalid_signature|stale

verification_records(id, evidence_id, issuer_did, proof_format,
                     signature_valid boolean, revocation_checked boolean,
                     verified_at, failure_reason)

issuer_registry(did, display_name, public_key_jwk, trust_tier, added_at)
   -- trust_tier: national (DigiLocker/NAD) | institutional | platform | unknown

opportunities(id, org_name, title, description, created_by, is_demo)
opportunity_requirements(opportunity_id, skill_id, weight, is_critical)

matches(id, user_id, opportunity_id, coverage_score, sufficiency_flag,
        computed_at, engine_version)
match_requirement_results(match_id, skill_id, requirement_weight,
                          evidence_level, recency_factor, contribution,
                          is_gap, gap_reason)

teams(id, name, created_by, objective_value, algorithm)   -- algorithm: greedy|ilp
team_requirements(team_id, skill_id, weight, min_members)
team_members(team_id, user_id, marginal_contribution, skills_covered)

micro_tasks(id, skill_id, title, prompt, checker_ref, time_limit_min)
task_submissions(id, user_id, task_id, code_ref, passed,
                 checker_output, submitted_at)

consents(id, user_id, grantee_type, grantee_id, scope jsonb,
         granted_at, revoked_at)
   -- scope example: {"skills":["all"],"evidence":["level>=3"],"contact":false}

jobs(id, user_id, kind, status, progress, result jsonb, error, created_at)

-- ══════════════════ SCHEMA: audit (segregated) ══════════════════

audit.protected_attributes(user_id, self_declared jsonb, consented_at)
   -- separate, explicit, revocable consent. NEVER joined in matching queries.

audit.audit_runs(id, opportunity_id, run_at, impact_ratios jsonb,
                 proxy_probe_auc numeric, feature_set_version, notes)

-- ══════════════════ Enforcement ══════════════════
REVOKE ALL ON SCHEMA audit FROM app_user;
GRANT USAGE ON SCHEMA audit TO auditor;
GRANT SELECT ON ALL TABLES IN SCHEMA audit TO auditor;
-- + RLS on public.evidence, public.user_skills keyed to consents
```

**Two fields worth defending in Q&A:**

- `unmapped_label` — proof you don't silently drop what you can't classify.
- `sufficiency_flag` on `matches` — see §5.3. This is the field that stops a low-evidence student from being ranked last.

---

## 4. Feature surface

### Tier 1 — MUST SHIP (these are the project)

| # | Feature | Owner module |
|---|---|---|
| 1 | Resume upload → text → constrained extraction | ingestion, extraction |
| 2 | GitHub connect → authorship signals | ingestion |
| 3 | Skill normalisation to taxonomy + `unmapped` bucket | normalisation |
| 4 | Evidence grading: level, corroboration, recency decay | grading |
| 5 | **Signature verification + tamper detection** | verification |
| 6 | Skill Passport UI with evidence drill-down | frontend |
| 7 | Deterministic requirement-coverage matching | matching |
| 8 | Templated "Why?" explanation from structured facts | explanation |
| 9 | **Fairness audit: impact ratios + proxy probe** | audit |
| 10 | Consent scopes enforced by RLS | db |
| 11 | Passport export as signed VC-JWT + PDF | export |
| 12 | Greedy team formation + gap report | team |

### Tier 2 — SHIP IF DAY 7 IS CLEAN

| 13 | Micro-task gap loop (2 hardcoded tasks) |
| 14 | ILP cross-check on team formation |
| 15 | Recruiter view (read-only, one screen) |
| 16 | Extraction accuracy report from the 50-doc labelled set |

### Tier 3 — CUT NOW, DON'T DISCUSS AGAIN

Live DigiLocker/NAD integration · mobile view · notifications · chat/chatbot · multi-language · task-generation engine · LinkedIn/portfolio import · anything with "agent" in the name.

---

## 5. The core algorithms, concretely

### 5.1 Evidence strength

```python
LEVEL_STRENGTH = {
    0:   0.15,   # self-reported
    1:   0.35,   # artefact-backed (unsigned file)
    2:   0.55,   # corroborated (2+ independent sources)
    3:   0.75,   # authorship-linked (verified commits over time)
    3.5: 0.85,   # task-demonstrated (our micro-task)
    4:   1.00,   # issuer-verified (valid signature, registered issuer)
}

CORROBORATION_BONUS = 0.05   # per extra independent source, capped
CORROBORATION_CAP   = 0.15
```

### 5.2 Recency decay — with a deliberate floor

```python
import math

HALF_LIFE_MONTHS = 18
DECAY_FLOOR      = 0.50          # ← the fairness decision

def recency_factor(months_since: float) -> float:
    raw = math.exp(-math.log(2) * months_since / HALF_LIFE_MONTHS)
    return max(DECAY_FLOOR, raw)
```

**Defend the floor.** Without it, a student who learned something four years ago and hasn't had an opportunity to use it since decays toward zero — which is exactly the opportunity bias you claim to be against. The floor encodes *"old evidence is weaker evidence, never absence of skill."* One constant, one strong answer in Q&A.

### 5.3 Match coverage — and the sufficiency gate

```python
def coverage(student, opportunity):
    total_w, earned, gaps = 0.0, 0.0, []

    for req in opportunity.requirements:
        total_w += req.weight
        ev = student.skills.get(req.skill_id)

        if ev is None:
            gaps.append({"skill": req.skill_id,
                         "reason": "no_evidence",
                         "critical": req.is_critical})
            continue                       # contributes 0 — NEVER negative

        strength = LEVEL_STRENGTH[ev.level] + min(
            CORROBORATION_CAP,
            CORROBORATION_BONUS * max(0, ev.source_count - 1))
        c = min(1.0, strength) * recency_factor(ev.months_since)
        earned += req.weight * c

    score = earned / total_w if total_w else 0.0

    # ── The sufficiency gate ─────────────────────────────────────
    evidenced = len(opportunity.requirements) - len(gaps)
    sufficient = (evidenced >= 0.4 * len(opportunity.requirements)
                  and student.total_evidence_items >= 3)

    return {
        "coverage": round(score, 3),
        "requirements_evidenced": f"{evidenced}/{len(opportunity.requirements)}",
        "gaps": gaps,
        "sufficiency_flag": "sufficient" if sufficient
                            else "insufficient_evidence_to_rank",
    }
```

**The sufficiency gate is the most important twelve lines in the codebase.** A candidate flagged `insufficient_evidence_to_rank` is **not placed at the bottom of the list** — they're routed to a separate *"Insufficient evidence — manual review recommended"* panel in the recruiter view.

This is how you operationalise your brief's §11 (*insufficient evidence ≠ evidence of low ability*). Without this gate, that principle is just UI copy. With it, it's control flow. When a judge asks how you protect under-resourced students, you point at this function.

Also: in the UI, **the requirement grid is the primary artefact and the percentage is secondary.** Show `4/6 requirements evidenced` in large type, `78% coverage` in small type. Never a percentage without the grid next to it.

### 5.4 Team formation

```python
def greedy_team(candidates, requirements, k):
    """Submodular coverage maximisation under cardinality constraint k.
       Greedy gives a (1 - 1/e) ≈ 0.632 approximation bound."""
    team, covered = [], {}

    for _ in range(k):
        best, best_gain = None, 0.0
        for c in candidates:
            if c in team:
                continue
            gain = sum(
                r.weight * max(0, c.coverage_of(r) - covered.get(r.skill_id, 0))
                for r in requirements
            )
            if gain > best_gain:
                best, best_gain = c, gain
        if best is None:
            break
        team.append(best)
        best.marginal_contribution = best_gain     # ← the explanation
        for r in requirements:
            covered[r.skill_id] = max(covered.get(r.skill_id, 0),
                                      best.coverage_of(r))

    return team, covered
```

Three outputs, and the last two are what nobody else will have:

1. The team.
2. **Marginal contribution per member** — *"C was selected because they added Docker + CI coverage no one else had"*, not because of an individual score. Team-level explainability.
3. **Team gap report** — what the assembled team *collectively still cannot do*. Genuinely the most useful screen for a real organiser.

Add a redundancy constraint on `is_critical` requirements (`min_members >= 2`) so the team has a bus factor above one. Cross-check with PuLP ILP at n ≤ 30 to show greedy hits or nearly hits optimum.

### 5.5 Fairness audit (offline job, `auditor` role)

```python
# (a) impact ratio — NYC LL144 style, four-fifths threshold
selection_rate = {g: selected[g] / total[g] for g in groups}
best = max(selection_rate.values())
impact_ratio = {g: r / best for g, r in selection_rate.items()}
flag = {g: ir < 0.80 for g, ir in impact_ratio.items()}

# (b) scoring rate — because our output is continuous, not binary
scoring_rate = {g: median(scores[g]) for g in groups}

# (c) proxy leakage probe — the slide that wins the fairness question
X = matching_feature_matrix          # the EXACT features the matcher sees
y = protected_attribute_labels       # from audit schema, offline only
auc = roc_auc_score(y_test, LogisticRegression().fit(X_tr, y_tr)
                              .predict_proba(X_te)[:, 1])
# 0.50 = no leakage. > 0.65 = you have a proxy problem. Report it either way.
```

Run it on synthetic-but-realistic demo data. Report honestly, including when it fails — *"our first feature set leaked college tier at 0.79 AUC; after regularising project-topic and issuer-mix features it's 0.56"* is a stronger story than a clean 0.50, because it proves the instrument works.

---

## 6. The three subsystems people get wrong

### 6.1 LLM extraction — constrain it or it will hurt you

```python
class ExtractedClaim(BaseModel):
    raw_phrase: str
    claimed_skill: str
    context_snippet: str          # verbatim span from the source document
    source_section: Literal["education","projects","experience",
                            "certifications","skills_list","other"]
    self_asserted: bool

class ExtractionResult(BaseModel):
    claims: list[ExtractedClaim]
    document_type: Literal["resume","certificate","project_description"]
```

Hard rules, enforced in code review:

- The LLM returns **only** this schema. No scores, no ratings, no rankings, no prose judgement.
- `context_snippet` must be a **verbatim substring of the source**. Validate it programmatically — `assert snippet in source_text`. If it isn't, drop the claim and log it. **This is your anti-hallucination guarantee and it's mechanical, not vibes.** It's also what powers the evidence drill-down: every claim links back to highlighted source text.
- `temperature=0`, log `llm_run_id` and model version on every claim for auditability.
- **Everything numeric happens after the LLM, in Python.**

### 6.2 GitHub — authorship signals only

Endpoints: `/users/{u}`, `/users/{u}/repos`, `/repos/{o}/{r}/commits?author={u}`, `/repos/{o}/{r}/languages`, `/repos/{o}/{r}/contents/{manifest}`.

```python
signals = {
    "authored_commits":   n_commits_by_verified_email,
    "commit_span_days":   (last_commit - first_commit).days,
    "bulk_push_ratio":    commits_in_largest_day / total_commits,   # high = suspicious
    "is_fork":            repo.fork,
    "declared_deps":      parse(requirements_txt | package_json | pom_xml),
    "language_bytes":     languages_response,
}
```

Grading rule: **Level 3 requires** `authored_commits >= 5` **and** `commit_span_days >= 14` **and** `not is_fork`. One bulk push of a tutorial repo does not clear the bar.

Explicitly forbidden as inputs: stars, followers, repo count, LOC, README quality (your brief's §22 — hold that line), **and any attempt to detect AI-generated code** (post-hoc detectors run ~20–25% accuracy; a judge who reads this literature will take you apart).

**Cache every GitHub response in a table.** Rate limits and network flakiness are the #1 cause of dead hackathon demos.

### 6.3 The micro-task sandbox — where teams lose two days

You cannot safely run arbitrary student code, and Docker-in-Docker on a free PaaS tier is not happening in 10 days.

| Option | Verdict |
|---|---|
| Docker-in-Docker | ❌ No. Needs privileged containers, won't work on Render/Railway free tiers. |
| Static analysis only (e.g. hadolint on a Dockerfile) | ⚠️ Weak. Proves syntax, not capability. |
| **Judge0** (self-hosted or public API) | ✅ **Do this.** Purpose-built sandboxed execution, language support, time/memory limits, simple REST. |
| Local subprocess + rlimits | ⚠️ Only if fully offline demo and you accept the risk. |

**Corollary — pick language-level tasks, not infra tasks.** "Write a Dockerfile" is hard to check safely. "Implement this function so these 6 hidden pytest cases pass" is trivially checkable in Judge0 and produces exactly as good evidence.

So revise the demo micro-tasks: **SQL query correctness** and **a Python data-transform against hidden tests**. Both checkable, both deterministic, both 10 minutes.

---

## 7. API contract

```
POST   /api/v1/ingest/resume            multipart → {job_id}
POST   /api/v1/ingest/github            {handle}  → {job_id}
POST   /api/v1/ingest/certificate       multipart → {job_id}
POST   /api/v1/ingest/manual            {claims[]} → {evidence_id}
GET    /api/v1/jobs/{job_id}            → {status, progress, result}

GET    /api/v1/passport/me              → full passport w/ evidence tree
GET    /api/v1/passport/{uid}           → consent-scoped view (RLS enforced)
POST   /api/v1/passport/export          {format: vc_jwt|pdf|json}
POST   /api/v1/verify                   {credential} → {valid, issuer, reason}

GET    /api/v1/opportunities
POST   /api/v1/match                    {opportunity_id} → coverage + gaps
GET    /api/v1/match/{id}/explain       → structured requirement grid

POST   /api/v1/teams/form               {requirements[], pool[], k, algorithm}
GET    /api/v1/teams/{id}/gaps

GET    /api/v1/tasks/suggest            {skill_id} → micro-task
POST   /api/v1/tasks/{id}/submit        {code} → {passed, output, new_level}

POST   /api/v1/consents                 {grantee, scope}
DELETE /api/v1/consents/{id}            ← revocation must be instant & visible

GET    /api/v1/audit/impact-ratios      auditor role only
GET    /api/v1/audit/proxy-probe        auditor role only
GET    /api/v1/audit/extraction-accuracy
```

**Design note:** `/match/{id}/explain` returns **structured data**, not a sentence. The frontend renders the grid; a template composes the prose. No LLM anywhere near the explanation path — otherwise your explanations can contradict your scores, which is the single worst thing that can happen live.

---

## 8. Repo layout

```
skillpassport/
├─ apps/
│  ├─ web/                         React + Vite
│  │  ├─ src/features/{passport,matching,teams,audit,consent}/
│  │  ├─ src/components/evidence/  EvidenceChip · EvidenceTree · VerifyBadge
│  │  └─ src/lib/api.ts            typed client
│  └─ api/                         FastAPI
│     ├─ routers/                  thin: auth, validate, dispatch
│     ├─ services/
│     │  ├─ ingestion/{resume,github,certificate}.py
│     │  ├─ extraction/{llm_client,schemas,validators}.py
│     │  ├─ normalisation/{taxonomy,embeddings}.py
│     │  ├─ grading/{levels,recency,corroboration}.py
│     │  ├─ verification/{vc_jwt,issuer_registry,revocation}.py
│     │  ├─ matching/{coverage,explain}.py
│     │  ├─ teams/{greedy,ilp,gaps}.py
│     │  └─ audit/{impact_ratio,proxy_probe}.py
│     └─ tests/                    ← grading, matching, verification: unit-tested
├─ packages/taxonomy/              curated 300 skills + ESCO/Lightcast IDs
├─ eval/                           50 labelled docs + accuracy harness
├─ issuer-sandbox/                 mock issuer: keypair, sign, revocation list
└─ infra/docker-compose.yml        offline backup path
```

**Test only the deterministic core** (`grading`, `matching`, `verification`, `teams`). Do not write tests for LLM output — you'll waste a day on flaky assertions. ~30 unit tests total is plenty, and it's also a slide: *"our scoring logic is unit-tested; the LLM never touches a number."*

---

## 9. Team lanes (assumes 4 devs)

| Dev | Lane | Days 1–2 | Days 3–5 | Days 6–8 | Days 9–10 |
|---|---|---|---|---|---|
| **A — Backend core** | ingestion, extraction, normalisation | schema + jobs table + taxonomy curation | resume + GitHub pipelines | extraction accuracy harness | bugfix, caching |
| **B — Trust & fairness** | verification, audit | issuer sandbox + keypair | VC-JWT sign/verify + tamper path | impact ratios + proxy probe | audit screen polish |
| **C — Matching & teams** | grading, matching, teams | scoring formula, unit tests | coverage + explain endpoints | greedy + ILP + gap report | tune demo data |
| **D — Frontend** | all UI | design system, shadcn setup, routes | passport + evidence tree | matching grid, teams, audit views | polish, demo rehearsal |

**Hard rule for Days 1–2:** A and C must agree and freeze the `user_skills` and `match_requirement_results` shapes before anyone writes UI. Every hackathon that misses this loses a day to reshaping data on Day 7. Write the two Pydantic models first, generate the TS types from them, then all four of you build against a stub.

**Milestone gate — end of Day 6:** resume in → passport out → one match with a grid. If that isn't working end-to-end on Day 6, **stop building features immediately** and spend Days 7–10 making that one path perfect. A flawless narrow demo beats a broad broken one every single time.

---

## 10. Demo-day failure modes and mitigations

| Failure | Probability | Mitigation |
|---|---|---|
| Backend cold start (free tier) | **High** | Pay $7 for one month. Non-negotiable. |
| Venue wifi dies | Medium | `docker-compose up` locally + recorded video |
| LLM API rate-limit / outage | Medium | Cache extraction results for demo profiles; hardcoded fallback path |
| GitHub rate limit | Medium | Authenticated token + DB cache of all demo repos |
| Judge says "run it on my profile" | Medium | Keep the live path working; rehearse a graceful "this takes 40s, meanwhile here's what it's doing" |
| Someone asks for the code | Low | Clean README, `.env.example`, one-command local setup |

---

## 11. If I had to cut this to its bones

Ranked by *judge impact per engineering hour*. If you're behind, build strictly top-down and stop where you run out of time:

1. **Signature verification + live tamper detection** — earns the word *Verifiable*. ~6 hrs.
2. **Coverage matching + requirement grid + "Why?"** — the core product. ~10 hrs.
3. **The naive-scoring toggle** — your entire pitch in one switch. ~3 hrs.
4. **Two-schema separation + the `permission denied` moment** — ~3 hrs.
5. **Impact ratios + proxy probe** — ~6 hrs.
6. **Passport UI with evidence drill-down to highlighted source text** — ~10 hrs.
7. **Greedy team formation + marginal contribution + gap report** — ~6 hrs.
8. **Extraction accuracy on 50 labelled docs** — ~4 hrs, wildly disproportionate credibility.
9. **Micro-task gap loop** — ~8 hrs, best impact story if time allows.
10. Everything else.

Items 1–5 total roughly 28 engineering hours and they are the whole differentiated argument. Build those first, in that order, and the project survives even a bad week.

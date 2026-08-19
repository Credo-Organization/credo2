# SIH 2026 Idea PPT — Slide-by-Slide Build Spec
## S30 · Verifiable Skill Passport & Explainable Internship-Team Matching

> **Every rule below in §0 was read directly out of your uploaded `SIH2026-IDEA-Presentation-Format.pptx`.** Not from a blog, not from the LinkedIn post, not from memory. Where I am inferring rather than reading, I mark it **[INFERENCE]**. Where you must supply something I cannot know, I mark it **[YOU FILL]**. Where a number must be checked before it goes on a slide, I mark it **[VERIFY]**.

---

## 0. Ground truth from the official template file

| Fact | Value |
|---|---|
| Slides in file | **7** — but slide 7 is the *Important Instructions* slide |
| **Max slides allowed** | **6, including the title slide** → Title + 5 content slides |
| Slide 7 | *"You can delete this slide when you upload"* — **delete it** |
| Slide size | 13.33 in × 7.5 in (16:9 widescreen) |
| **Upload format** | **PDF only.** "No PPT, Word Doc or any other format will be supported." |
| Content style | *"Try to avoid paragraphs and post your idea in points / diagrams / infographics / pictures"* |
| Template rule | *"You can only use provided template for making the PPT **without changing the idea details pointers**"* |
| Novelty | *"Idea should be unique and novel"* — stated explicitly in the instructions |

### Exact slide titles and required pointers (do not reword these)

| # | Title (as in template) | Required pointers (verbatim) |
|---|---|---|
| 1 | **TITLE PAGE** | Problem Statement ID – · Problem Statement Title- · Theme- · PS Category- Software/Hardware · Team ID- · Team Name (Registered on portal) |
| 2 | **IDEA TITLE** | Proposed Solution (Describe your Idea/Solution/Prototype) · Detailed explanation of the proposed solution · How it addresses the problem · Innovation and uniqueness of the solution |
| 3 | **TECHNICAL APPROACH** | Technologies to be used (e.g. programming languages, frameworks, hardware) · Methodology and process for implementation (Flow Charts/Images/ working prototype) |
| 4 | **FEASIBILITY AND VIABILITY** | Analysis of the feasibility of the idea · Potential challenges and risks · Strategies for overcoming these challenges |
| 5 | **IMPACT AND BENEFITS** | Potential impact on the target audience · Benefits of the solution (social, economic, environmental, etc.) |
| 6 | **RESEARCH AND REFERENCES** | Details / Links of the reference and research work |

### The one genuine ambiguity — read this before you touch the file

The instruction says use the template *"without changing the idea details pointers."*

**Safe reading:** don't delete, reword, or reorder those pointer lines. They are the required content headings.
**What it does not say:** it doesn't forbid resizing or repositioning them so your content fits.

**[INFERENCE] My recommendation:** keep every pointer's wording **character-for-character**, shrink it to 14–16 pt, and use it as a small section sub-heading with your content directly beneath. That respects the letter of the rule and still gives you a usable slide. In the template those pointer boxes currently sit in the vertical middle of the slide (y ≈ 2.3–5.0 in), which is unusable as-is — every team repositions them.

**Do not** delete a pointer because you have nothing to say under it. An empty pointer is survivable; a missing one looks like you ignored the brief.

### Non-negotiables before you submit

- Replace the **"Your Team Name"** oval on slides 2–6 (top-left, ~1.37 × 0.88 in).
- Leave the SIH logo (top-right) and the footer strip alone.
- **Delete slide 7.**
- **Export to PDF.** Check the PDF renders your diagrams correctly — PowerPoint SmartArt sometimes shifts on export.
- Body text nowhere below **14 pt**. Judges read these on a laptop, often projected.

---

## 1. Global content rules for this deck

**Total body text across all 5 content slides should be under ~450 words.** These decks get skimmed. Every slide is one diagram plus tight bullets.

**Three phrases that must appear somewhere, because they are your entire differentiation:**

1. "We verify **provenance**, not competence."
2. "Missing evidence is **not** evidence of low ability."
3. "We do not claim bias-free. We claim **bias-measured**."

**Words to never write on these slides:** *revolutionary, seamless, cutting-edge, one-stop, AI-powered* (as a standalone claim), *100% accurate, eliminates bias, blockchain*.

---

## 2. SLIDE 1 — TITLE PAGE

### Text to fill (the template's own left-hand text box)

```
Problem Statement ID –   [YOU FILL]
Problem Statement Title- Verifiable Skill Passport and Explainable
                         Internship-Team Matching Platform
Theme-                   [YOU FILL]
PS Category-             Software
Team ID-                 [YOU FILL]
Team Name (Registered on portal)  [YOU FILL]
```

### ⚠️ Three things you must resolve this week

1. **The real Problem Statement ID.** "S30" is almost certainly your SOAIDEATHON internal number. SIH portal PS IDs look like `SIH25xxx`. **Get the portal ID from your SPOC.** A wrong PS ID on the title slide is a disqualifying-grade error and it is entirely avoidable.
2. **The exact Theme string** as it appears on the portal — don't invent or paraphrase it.
3. **Which organisation proposed this PS.** Not needed on the slide, but it tells you who is likely evaluating you. If it traces to an education-sector body, your DigiLocker/ABC/APAAR alignment (slides 3 and 5) is speaking directly to their own infrastructure. That's worth more than any feature.

### Idea name

You need a short name. Three options, honestly assessed:

| Option | For | Against |
|---|---|---|
| **PRAMAAN** (प्रमाण = proof/evidence) | Semantically perfect — the project is literally about evidence. Indian-language names land well at SIH. | **[VERIFY]** Check for collision with existing government products before committing. Search the SIH portal and MeitY listings. |
| **SkillProof** | Instantly clear in English, zero ambiguity | Forgettable, generic |
| **Evidence Passport** | Descriptive and honest | Reads as a category, not a product |

**My pick, conditional on the name check:** `PRAMAAN` with a descriptive line under it.

> **PRAMAAN** — *An evidence-verified skill passport with explainable, auditable matching*

**[INFERENCE]** Name choice is subjective. Pick what your presenter can say naturally ten times without stumbling.

### Visual
Leave the template's title-slide artwork as-is. Do not redesign this slide. It scores nothing and can only go wrong.

---

## 3. SLIDE 2 — IDEA TITLE

**This slide decides whether you reach the finale.** Judges form their verdict here; the rest either confirms or dents it.

### Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│ IDEA TITLE                                                    [logo] │
│ ┌────────┐                                                           │
│ │TeamName│  PRAMAAN — Evidence-verified skill passport with          │
│ └────────┘  explainable, auditable matching                          │
├──────────────────────────────┬───────────────────────────────────────┤
│ Proposed Solution            │   ┌─────────────────────────────┐     │
│  · bullets                   │   │  THE PIPELINE DIAGRAM       │     │
│                              │   │  (see below)                │     │
│ Detailed explanation         │   └─────────────────────────────┘     │
│  · bullets                   │                                       │
│                              │   ┌─────────────────────────────┐     │
│ How it addresses the problem │   │  THE 3-COLUMN MAPPING       │     │
│  · 3 mapped lines            │   │  (see below)                │     │
│                              │   └─────────────────────────────┘     │
│ Innovation and uniqueness    │                                       │
│  · 3 bullets                 │                                       │
└──────────────────────────────┴───────────────────────────────────────┘
        LEFT ~45%                        RIGHT ~55%
```

### Copy — paste this

**Proposed Solution (Describe your Idea/Solution/Prototype)**
> A skill passport where every claimed skill carries **linked, graded, dated evidence** — and a matching engine that ranks candidates only on **explicit role requirements**, showing the exact evidence behind every match and every gap.

**Detailed explanation of the proposed solution**
- Evidence ingested from resume, GitHub, coursework and issuer-signed credentials
- Each skill graded on **6 evidence levels** (self-reported → issuer-verified), with recency
- Issuer signatures verified cryptographically — **tampering is detected, not assumed away**
- Matching is deterministic and rule-based; the LLM never produces a score or a ranking
- Gaps are returned with a **route to close them**, not as a penalty

**How it addresses the problem** *(map explicitly to the PS wording — judges check this line by line)*

| The PS asks for | We deliver |
|---|---|
| "explain which evidence supports the match" | Per-requirement evidence grid, drill-down to the exact source text |
| "identify missing skills" | Gap list + a verifiable micro-task to generate the missing evidence |
| "avoid ranking on protected or irrelevant attributes" | Protected attributes are in a **separate DB schema the matching engine has no permission to read**; impact ratios published |

**Innovation and uniqueness of the solution**
- **We verify provenance, not competence.** No system can verify true ability from documents — we verify *who issued what, unaltered, when*, and grade the rest as evidence.
- **Missing evidence ≠ low ability.** Absence never subtracts score — a system invariant, not a UI label. This protects students with fewer opportunities.
- **Bias is measured, not asserted.** We publish impact ratios and a proxy-leakage test on our own feature set.

### Diagram A — The Evidence Pipeline (right column, top)

Horizontal flow, rounded rectangles, single accent colour. Keep it to one line if it fits.

```
 Evidence          Extraction        Grading            Passport         Matching         Human
 sources     →     (LLM, fixed  →    L0–L4 +      →    (portable,  →    (deterministic →  decision
 resume ·          schema only)      recency +         signed VC)       rules only)       (recruiter)
 GitHub ·                            signature
 coursework ·                        check
 credentials
```

**Callout under the diagram, small text, high value:**
> LLM extracts. **Rules decide.** Every number is computed in code and is reproducible.

### Diagram B — The Fairness Toggle (right column, bottom)

This is the single most persuasive visual in the whole deck. Two small candidate cards side by side.

```
        NAIVE / COUNT-BASED              PRAMAAN (requirement-based)
   ┌───────────────────────────┐    ┌───────────────────────────┐
   │ Student A          #1     │    │ Student B          #1     │
   │ 12 certificates           │    │ 1 deep project            │
   │ 20 repos, tier-1 college  │    │ tier-3 college, 0 certs   │
   ├───────────────────────────┤    ├───────────────────────────┤
   │ Student B          #2     │    │ Student A          #2     │
   └───────────────────────────┘    └───────────────────────────┘
        ranks by VOLUME                  ranks by REQUIREMENT-
        and prestige                     RELEVANT EVIDENCE
```

Caption, one line:
> Same two students. Same role. Ranking flips when you score evidence instead of volume.

---

## 4. SLIDE 3 — TECHNICAL APPROACH

The LinkedIn advice you were given is right on one point: **do not dump a tool list.** Every technology on this slide must be visibly attached to a job.

### Copy

**Technologies to be used (e.g. programming languages, frameworks, hardware)**

Present as a **table, not a list** — the table is what proves you know why each piece is there.

| Layer | Technology | Why this one |
|---|---|---|
| Frontend | React + TypeScript, Vite, Tailwind | Evidence trees and requirement grids need typed nested data |
| Backend | FastAPI (Python), Pydantic | Pydantic schemas constrain LLM output *and* validate the API |
| Database | PostgreSQL (Supabase) | **Row-Level Security = consent enforcement in the database, not in app code** |
| Skill extraction | LLM with fixed JSON schema | Extraction only — never scoring, never ranking |
| Skill mapping | Sentence-transformer embeddings → curated ~300-skill taxonomy mapped to **ESCO / Lightcast** IDs | Standards-aligned, runs locally, no API dependency at demo time |
| Verification | W3C Verifiable Credentials 2.0 / **Open Badges 3.0**, VC-JWT with Ed25519 | Makes the passport genuinely portable and the signature check real |
| Matching & teams | Deterministic Python; greedy submodular coverage + ILP cross-check | Reproducible, auditable, explainable by construction |
| Fairness audit | scikit-learn (impact ratios, proxy probe) | Turns "unbiased" from a claim into a measurement |
| Credential rails | **DigiLocker / API Setu · ABC–NAD–APAAR** *(staged: sandbox issuer → live integration)* | Consumes India's existing trust infrastructure instead of inventing one |

⚠️ **State the staging honestly on the slide.** Write *"sandbox issuer at prototype stage; live DigiLocker/NAD integration requires institutional onboarding."* If you imply live government integration at prototype stage and a judge probes it, you lose far more than the line was worth.

**Methodology and process for implementation**

Use the architecture diagram below. Add three short lines beneath it:

- **Two-schema separation** — matching engine has *no database permission* on the protected-attributes schema
- **LLM boundary** — extraction only; every extracted claim must quote a verbatim span from the source or it is discarded
- **Human-in-the-loop** — the system recommends and explains; the recruiter decides

### Diagram C — System Architecture (dominant visual on this slide)

```
┌────────────────────────────────────────────────────────────────┐
│  INGESTION       Resume · GitHub · Coursework · Credentials    │
└──────────────────────────────┬─────────────────────────────────┘
                               ▼
┌────────────────────────────────────────────────────────────────┐
│  EXTRACTION      LLM → fixed schema → verbatim-span validation  │  ← only LLM step
└──────────────────────────────┬─────────────────────────────────┘
                               ▼
┌────────────────────────────────────────────────────────────────┐
│  VERIFICATION    Signature check · Issuer registry · Revocation │
│  GRADING         Level L0–L4 · Corroboration · Recency decay    │
└──────────────────────────────┬─────────────────────────────────┘
                               ▼
┌────────────────────────────────────────────────────────────────┐
│  SKILL PASSPORT      portable, signed, exportable               │
└───────────┬───────────────────────────────┬────────────────────┘
            ▼                               ▼
┌───────────────────────┐      ┌────────────────────────────────┐
│  INTERNSHIP MATCHING  │      │  TEAM FORMATION                │
│  requirement coverage │      │  skill-coverage optimisation   │
│  + gaps               │      │  + team gap report             │
└───────────┬───────────┘      └───────────────┬────────────────┘
            └───────────────┬──────────────────┘
                            ▼
              ┌──────────────────────────┐
              │  EXPLANATION → HUMAN     │
              │  DECISION                │
              └──────────────────────────┘

  ╔══════════════════════════════════════════════════════════════╗
  ║  AUDIT SCHEMA (segregated · separate consent · no GRANT to   ║
  ║  the matching engine) → impact ratios · proxy-leakage probe  ║
  ╚══════════════════════════════════════════════════════════════╝
```

Draw the audit block **detached**, with a dashed one-way arrow going *into* it only. The visual separation is the argument.

---

## 5. SLIDE 4 — FEASIBILITY AND VIABILITY

This is where most teams write filler. It is your strongest slide, because your project's whole thesis is about being honest under scrutiny.

### Copy

**Analysis of the feasibility of the idea**
- Standard, proven stack — no unsolved research required
- Standards already exist: **Open Badges 3.0 is aligned to W3C Verifiable Credentials 2.0**
- India's credential rails already exist: **DigiLocker** (issuer-signed, IT Act 2000) and **ABC–NAD–APAAR** *(NCrF adoption figure — **[VERIFY]** before quoting)*
- Core pipeline is buildable at prototype scale within the internal-hackathon window; matching and grading logic is unit-testable

**Potential challenges and risks** + **Strategies for overcoming these challenges**

Present as one table. This format is the point — risk and mitigation on the same row.

| Risk | Severity | Our strategy |
|---|---|---|
| "Verified" is over-claimed by such systems | **High** | We verify **provenance only**, cryptographically. Competence is graded as evidence, never asserted as proof. |
| Proxy bias — model reconstructs protected attributes from correlated features | **High** | Two-schema separation + published impact ratios + proxy-leakage probe on our own feature vector |
| Fabricated or tampered certificates | **High** | Signature validation against an issuer registry; unsigned artefacts capped at a lower evidence level |
| LLM hallucination in extraction | **Medium-High** | Fixed output schema; every claim must quote a verbatim source span or it is discarded; no LLM in scoring |
| Opportunity bias — well-resourced students accumulate more evidence | **High** | Absence never subtracts score; gap-closing micro-tasks let students *generate* evidence |
| Cold start — needs issuers and recruiters together | **Medium-High** | Consume existing rails (DigiLocker / NAD / Open Badges) rather than bootstrapping a new trust network |
| Institutional API onboarding takes months | **Medium** | Sandbox issuer with real cryptography at prototype stage; issuer endpoint is a configuration change |

**Add this line at the bottom of the slide. It is worth more than another feature bullet:**

> **What we do not claim:** that we can measure true ability, or that bias is eliminated. We claim measured evidence quality and measured, published fairness.

**[INFERENCE]** Some judges reward this framing highly; a minority read any stated limitation as weakness. On balance the risk is worth taking, because the alternative — claiming you solved bias — collapses the moment anyone asks a follow-up.

---

## 6. SLIDE 5 — IMPACT AND BENEFITS

### ⛔ Read this before you write a single number on this slide

Do not invent statistics. Not one. The strongest thing you can do here is cite **three real, sourced numbers** and leave everything else qualitative.

**Numbers worth sourcing — [VERIFY] every one at the primary source before it goes on the slide:**

| What to cite | Where to get it | Status |
|---|---|---|
| Total higher-education enrolment in India | **AISHE report**, Ministry of Education (latest edition) | You must look this up |
| Graduate employability percentage | **India Skills Report** (latest edition) | You must look this up |
| Universities that have adopted NCrF | PIB / UGC official release | I saw "196 universities as of 2026" in a secondary source — **do not use it until you find the PIB or UGC original** |

Cite as `Source: AISHE 20XX–XX, Ministry of Education` directly beneath the number. A sourced number is worth five unsourced ones.

### Copy

**Potential impact on the target audience**

| Audience | Impact |
|---|---|
| **Students** *(esp. tier-2/tier-3, first-generation learners)* | Claims become demonstrable evidence. Missing skills come with a route to close them, not a rejection. Judged on requirement-relevant evidence, not on college brand or certificate count. |
| **Recruiters / startups** | Requirement-specific shortlists with the evidence attached and an auditable reason for every match. Less time on unverifiable claims. |
| **Universities / placement cells** | Cohort-level skill and gap maps that feed curriculum planning; standards-aligned records via ABC/NAD. |
| **Hackathon & project organisers** | Teams built on complementary evidence-backed skills, with an explicit report of what the team collectively still cannot do. |

**Benefits of the solution (social, economic, environmental, etc.)**

- **Social — equity.** The system separates *"insufficient evidence"* from *"low ability."* A student without internships or paid certificates is never scored as less capable — and is given a way to build evidence. This is the benefit that matters most and the one almost no competing approach delivers.
- **Economic.** Faster, requirement-based shortlisting for employers; fairer access to internships for students outside elite institutions.
- **Institutional / national.** Aligns with **NEP 2020**, **NCrF**, and the **ABC–NAD–APAAR** stack — extending existing national credential infrastructure toward employment outcomes rather than creating a parallel one.
- **Governance.** Auditable, explainable, human-in-the-loop by design — consistent with the direction of global regulation on automated employment decision tools.

**Do not write** "will help society," "will transform hiring," or any percentage you have not sourced.

### Diagram D — Optional, only if space allows

A simple before/after strip:

```
   TODAY                                  WITH PRAMAAN
   Resume claim  →  unverifiable          Evidence  →  graded, dated, signed
   Shortlist     →  college & counts      Shortlist →  requirement coverage
   Rejection     →  no reason given       Gap       →  named + closable
   Fairness      →  asserted              Fairness  →  measured & published
```

---

## 7. SLIDE 6 — RESEARCH AND REFERENCES

**Pick 5–6. Formatted consistently. Every one connected to a specific claim in your deck.** An unexplained link list scores nothing.

### Use this format

```
[1] Open Badges 3.0 Specification, 1EdTech — aligned to W3C Verifiable
    Credentials Data Model 2.0.  https://www.imsglobal.org/spec/ob/v3p0/impl
    → Basis for our portable, signed skill passport (Slide 3)

[2] DigiLocker, API Setu — Ministry of Electronics & IT, Government of India.
    Issuer-signed documents; legal parity under IT Act, 2000.
    https://apisetu.gov.in/digilocker
    → Issuer-verified evidence tier, Level 4 (Slides 2, 3)

[3] Academic Bank of Credits & APAAR — Press Information Bureau,
    Government of India.  https://www.pib.gov.in/...
    → National credential rail for coursework evidence (Slides 3, 5)

[4] NYC Local Law 144-21, Automated Employment Decision Tools —
    NYC Department of Consumer and Worker Protection.
    https://rules.cityofnewyork.us/rule/automated-employment-decision-tools-2/
    → Impact-ratio methodology for our fairness audit (Slide 4)

[5] ESCO — European Skills, Competences and Occupations classification.
    https://esco.ec.europa.eu/en/use-esco/download
    → Skill taxonomy alignment for our curated skill set (Slide 3)

[6] Lappas, Liu & Terzi, "Finding a Team of Experts in Social Networks,"
    KDD 2009 — team formation with skill coverage is NP-hard.
    → Basis for our submodular coverage optimisation (Slide 3)

[7] AISHE / India Skills Report  [YOU FILL — exact edition + URL]
    → Scale and employability figures (Slide 5)
```

### ⚠️ Three warnings on this slide

1. **Do not cite the EU AI Act unless you get the date right.** Annex III high-risk employment obligations were **postponed from 2 August 2026 to 2 December 2027** by the AI Digital Omnibus agreement. Most blog posts still print the old date. **[VERIFY]** at an official EU source before citing. If you're not going to verify it, leave it out — NYC LL144 carries the fairness argument on its own.
2. **Do not cite the March 2026 "Skill Passport" India launch** I mentioned earlier. That was a syndicated press release, i.e. paid placement, not journalism. It may be vaporware. It is fine to *say* in Q&A that skill passports exist elsewhere (Singapore, California, Velocity Network) — it is not fine to put an unverified press release in a references list.
3. **Every reference must be clickable and live.** Judges do click. A dead link is worse than no link.

---

## 8. What I could not do for you, and why

Being explicit, because you asked for no mistakes:

| Gap | Why | Who resolves it |
|---|---|---|
| Problem Statement ID, Theme, Team ID, Team Name | Only on the SIH portal | Your SPOC — **this week** |
| Which organisation proposed the PS | Not in anything you gave me | Your SPOC |
| AISHE / India Skills Report figures | I will not hand you numbers to put on a government-evaluated slide without you seeing the primary source | One team member, 30 minutes |
| NCrF "196 universities" | I read it in a secondary source only | Find the PIB/UGC original or drop it |
| Whether "PRAMAAN" collides with an existing government product | I did not verify this | Search before committing to the name |
| Exact SIH finale format | I asserted "36 hours" earlier without verifying. I was wrong to state it. | Confirm with your SPOC |

**Every placeholder above is deliberate.** Filling them with plausible-looking guesses is exactly how teams get caught in Q&A, and you asked for the opposite.

---

## 9. Final pre-submission checklist

- [ ] Exactly **6 slides**. Slide 7 (Important Instructions) **deleted**.
- [ ] Every pointer line from the template present and **worded exactly** as in the original.
- [ ] "Your Team Name" oval replaced on slides 2–6.
- [ ] SIH logo and footer strip untouched.
- [ ] PS ID, Theme, Team ID, Team Name filled from the portal — **triple-checked**.
- [ ] No unsourced statistic anywhere in the deck.
- [ ] No claim of live DigiLocker/NAD integration at prototype stage.
- [ ] EU AI Act either date-verified or omitted.
- [ ] Every reference link opened and confirmed live.
- [ ] No body text below 14 pt.
- [ ] **Exported to PDF**, and the PDF opened and checked page by page — diagrams intact, nothing reflowed, nothing cut off.
- [ ] Someone outside your team read it cold and could explain the idea back to you in 30 seconds.

That last checkbox is the real test. If they can't, slide 2 isn't finished.

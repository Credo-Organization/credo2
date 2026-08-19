# SLIDE 3 — TECHNICAL APPROACH
## Final spec. Paste-ready copy + diagram build instructions.

---

## ⚠️ 0. First — a numbering mismatch that could cost you a whole slide

**The LinkedIn post you just sent is about the wrong slide.**

That author numbers *content* slides, excluding the title page. The official template numbers *all* slides. They're offset by one:

| LinkedIn calls it | Template slide | Template title |
|---|---|---|
| Slide 1 | Slide 2 | IDEA TITLE |
| Slide 2 | **Slide 3** | **TECHNICAL APPROACH** ← you are here |
| Slide 3 | Slide 4 | FEASIBILITY AND VIABILITY |
| Slide 4 | Slide 5 | IMPACT AND BENEFITS |
| Slide 5 | Slide 6 | RESEARCH AND REFERENCES |

The screenshot you attached — *"Proving Feasibility & Viability"*, risks, mitigation strategies — is guidance for **template slide 4**, not this one. Save it; you'll want it next round.

The correct guidance for this slide is the author's *"Slide 2"* post: technologies, methodology/process with flowcharts, prototype plan. Which matches the template pointers exactly.

**Do not put risk/mitigation content on this slide.** It belongs on slide 4, and duplicating it wastes your scarcest resource.

---

## 1. Template pointers — verbatim, do not alter

Confirmed against your uploaded `.pptx`:

```
• Technologies to be used (e.g. programming languages, frameworks, hardware)
• Methodology and process for implementation (Flow Charts/Images/ working prototype)
```

Note the exact spacing in `Flow Charts/Images/ working prototype` — space after the second slash. Leave it.

⚠️ **"hardware" is in the pointer. Ignore it.** Your PS Category is Software. Do not invent an IoT device or a scanner to look thorough — a judge will ask what it's for and you'll have no answer.

---

## 2. Word budget

Slide 2 landed at ~200 words and reads well. This slide must be **tighter**, because the diagram is bigger and carries more.

| Zone | Target |
|---|---|
| Technologies block | 90 |
| Diagram labels | 45 |
| Three principles | 28 |
| Prototype status line | 15 |
| **TOTAL** | **~178** |

Hard ceiling: **210**. If you're over, cut the "why" clauses in the technology block before you touch the diagram.

---

## 3. Layout (13.33 × 7.5 in)

```
┌────────────────────────────────────────────────────────────────────────┐
│ ⬭ Musketeer        TECHNICAL APPROACH                      [SIH logo]  │ y 0–1.25
├─────────────────────────────┬──────────────────────────────────────────┤
│ LEFT  x 0.40 → 5.30  (37%)  │ RIGHT  x 5.60 → 12.90  (55%)             │
│                             │                                          │
│ ❖ Technologies to be used   │  ❖ Methodology and process for           │
│   (e.g. programming         │    implementation (Flow Charts/          │
│   languages, frameworks,    │    Images/ working prototype)            │
│   hardware)                 │                                          │
│                             │   ┌────────────────────────────────────┐ │
│  [9 technology rows —       │   │                                    │ │
│   layer · stack · why]      │   │   THE PIPELINE + TRUST             │ │
│                             │   │   ARCHITECTURE DIAGRAM             │ │
│                             │   │   (dominant visual — this IS       │ │
│                             │   │    the required flowchart)         │ │
│                             │   │                                    │ │
│                             │   └────────────────────────────────────┘ │
│                             │                                          │
│                             │   ▸ three principle callouts             │
├─────────────────────────────┴──────────────────────────────────────────┤
│  Prototype scope strip (full width, thin)                              │ y 6.4–6.85
├────────────────────────────────────────────────────────────────────────┤
│                  @SIH Idea submission- Template                     3  │ y 6.95
└────────────────────────────────────────────────────────────────────────┘
```

**Note the split is 37/55, not 48/52 like slide 2.** The diagram is the deliverable here — the template literally asks for a flowchart. Give it the room.

### Font sizes
| Element | Size |
|---|---|
| Pointer headings (❖) | 16 pt — wording unchanged |
| Technology rows | 13–14 pt |
| Diagram box labels | 12–13 pt |
| Principle callouts | 13 pt |
| Prototype strip | 12 pt |
| **Absolute floor** | **12 pt** — nothing smaller, anywhere |

---

## 4. PASTE-READY COPY

### 4.1 ❖ Technologies to be used

Build as a **two-column list or thin table**, not prose. Layer in bold, stack after it, and a short *why* only where the choice needs defending. Nine rows.

| Layer | Stack |
|---|---|
| **Frontend** | React · TypeScript · Tailwind |
| **Backend** | FastAPI · Python · Pydantic |
| **Data** | PostgreSQL / Supabase — *row-level security enforces consent in the database, not in app code* |
| **Extraction** | LLM with fixed output schema — *extraction only, never scoring* |
| **Skill mapping** | Sentence-transformer embeddings → curated ~300-skill taxonomy, **ESCO / Lightcast** aligned |
| **Trust** | W3C Verifiable Credentials 2.0 · **Open Badges 3.0** · Ed25519 (VC-JWT) · issuer registry |
| **Matching** | Deterministic Python · greedy submodular coverage + ILP cross-check |
| **Fairness** | scikit-learn — impact ratios, proxy-leakage probe |
| **Credential rails** | DigiLocker / API Setu · ABC–NAD–APAAR — *sandbox issuer at prototype stage; live integration requires institutional onboarding* |

> ### ⚠️ The last row is non-negotiable
> That italic caveat must stay. If your slide implies live government API integration at prototype stage and any judge probes it, you lose far more credibility than the line was ever worth. Stating the staging honestly converts a potential ambush into evidence that you understand institutional reality. **Do not delete it to save space.**

**Why this format beats a tool list:** the pointer says *"Technologies to be used."* Anyone can list React and Python. The **Why** column is what shows you chose rather than copied — and it's the difference between "they know tool names" and "they know why."

---

### 4.2 ❖ Methodology and process for implementation

Heading only. The diagram in §5 answers it. **Do not write explanatory bullets underneath it** — that's exactly the redundancy that made slide 2 cluttered, and it's the mistake you already fixed once.

Beneath the diagram, three short principle callouts (28 words):

> ▸ **LLM extracts. Rules decide.** Every score is computed in code and is reproducible.
> ▸ **The matching engine holds no database permission** on protected attributes.
> ▸ **The system explains. The human decides.**

Each of these is a claim a judge can test, which is the point.

---

### 4.3 Prototype scope strip (full-width, bottom)

15 words. Responsive to *"working prototype"* in the pointer, and it pre-empts "what's actually built?"

> **Prototype:** ingestion → passport → verification → match → explanation.  **Staged next:** live issuer APIs · micro-task engine.

---

## 5. THE DIAGRAM — build spec

One diagram doing two jobs: the process flow the pointer demands, **and** the trust/fairness architecture that is your differentiation. Don't draw two.

```
┌──────────────────────────────────────────────────────────────┐
│  INGESTION                                                   │
│  Resume · GitHub · Coursework · Issuer-signed credentials     │
└───────────────────────────┬──────────────────────────────────┘
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  EXTRACTION            ◄── only LLM step                      │
│  Fixed schema · verbatim-span validation                      │
└───────────────────────────┬──────────────────────────────────┘
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  VERIFICATION + GRADING                                       │
│  Signature vs issuer registry  ·  L0–L4 tier  ·  recency      │
└───────────────────────────┬──────────────────────────────────┘
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  SKILL PASSPORT          portable · signed · exportable       │
└──────────┬────────────────────────────────┬──────────────────┘
           ▼                                ▼
┌────────────────────────┐      ┌───────────────────────────────┐
│  INTERNSHIP MATCHING   │      │  TEAM FORMATION               │
│  requirement coverage  │      │  skill-coverage optimisation  │
│  + named gaps          │      │  + team gap report            │
└──────────┬─────────────┘      └──────────────┬────────────────┘
           └───────────────┬───────────────────┘
                           ▼
              ┌──────────────────────────┐
              │  EXPLANATION →           │
              │  HUMAN DECISION          │
              └──────────────────────────┘

   ╭ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─╮
   │  AUDIT SCHEMA — segregated, separate consent            │
   │  impact ratios  ·  proxy-leakage probe                  │
   │  ✗ no database permission from the matching path        │
   ╰ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─╯
```

### Build rules — each of these carries meaning

1. **Draw the audit block detached, with a dashed border**, offset to one side. One **dashed one-way arrow** goes *into* it from the matching stage. **No arrow comes back out.** The visual separation *is* the fairness argument — a judge reads it in two seconds without you saying a word.
2. **Colour the EXTRACTION box differently from every other box** (e.g. amber against blue). It's the only step where an LLM touches anything. Add the small marker `◄── only LLM step`. This visually contains the AI to one box, which is precisely the claim you want.
3. **VERIFICATION + GRADING must show "issuer registry"**, not just "signature check." Same hole as slide 2 — a signature alone proves nothing about who signed.
4. **Keep to 12–13 pt labels.** If the text won't fit, shorten the labels — do not shrink the font.
5. **Native PowerPoint shapes.** Rounded rectangles, straight connectors, one dashed rectangle. Roughly 20 minutes. Do not generate this as an image: you will need to edit it, and the L2 typo on slide 2 is your evidence for why.

---

## 6. What deliberately is NOT on this slide

| Excluded | Where it goes |
|---|---|
| Risks and mitigations | **Slide 4** — Feasibility and Viability |
| Cost / effort / timeline | **Slide 4** |
| Beneficiaries and impact | **Slide 5** |
| Citations and links | **Slide 6** |
| The virtual card / QR sharing | **Slide 5** (it's a delivery surface, not architecture) |
| Any hardware | Nowhere — this is a Software PS |

Slide 3 answers exactly two questions: **what are you building it with**, and **how does it flow**. Nothing else.

---

## 7. Pre-flight checklist — Slide 3

- [ ] Both pointer headings present, **worded exactly** as the template, including `Flow Charts/Images/ working prototype` spacing
- [ ] No risk/mitigation content (that's slide 4 — the LinkedIn numbering is offset by one)
- [ ] No hardware listed
- [ ] Every technology in the list is one you will **actually use** — delete anything aspirational
- [ ] The DigiLocker/ABC row carries the **"sandbox issuer at prototype stage"** caveat
- [ ] Diagram shows **"issuer registry"**, not bare "signature verification"
- [ ] Extraction box visually distinct + marked as the only LLM step
- [ ] Audit block **detached, dashed, one-way arrow in, none out**
- [ ] No explanatory bullets duplicating the diagram
- [ ] Word count ≤ 210
- [ ] Nothing below 12 pt
- [ ] Built with **native PowerPoint shapes**, not a generated image
- [ ] "Musketeer" matches the portal-registered team name
- [ ] Exported to PDF and checked — connectors intact, no shape drift
- [ ] Someone outside the team can trace the flow top to bottom without you narrating

---

## 8. Presenter lines — what you say, not what you print

| Element | Say aloud |
|---|---|
| Extraction box | *"The LLM sits in exactly one box. It extracts claims into a fixed schema and every claim must quote a verbatim span from the source or we discard it. It never produces a number."* |
| Verification | *"A valid signature only proves some key signed it. We check that key against a registered issuer list — so a self-signed credential is flagged, not accepted."* |
| Audit block | *"That block is drawn separately because it is separate. The matching engine has no database grant on it. We can show you the permission error."* |
| Credential rails | *"DigiLocker and NAD are the real rails. At prototype stage we run a sandbox issuer with real cryptography, because institutional onboarding is a process, not a code change."* |

---

## 9. One thing I could not verify

I have not seen the **official problem statement PDF** from the SIH portal — only the text you pasted in your first message. Before this deck is submitted, one person should open the portal PS and confirm:

- the exact **PS ID** (still unresolved — "S30" is almost certainly your internal SOAIDEATHON number)
- the exact **Theme** string
- the three quoted phrases on **slide 2**, character-for-character

None of those live on slide 3, but slide 3 is the last comfortable moment to catch them before you're polishing under deadline.

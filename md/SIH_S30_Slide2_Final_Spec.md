# SLIDE 2 — IDEA TITLE
## Final spec. Every fix applied. Paste-ready copy.

---

## 0. What changed from your current version, and why

| # | Fix | Reason |
|---|---|---|
| 1 | **"Signatures verified" → "verified against a registered issuer list"** | A valid signature only proves *some* key signed it. Without a trust list, anyone can self-sign "IIT Bombay" and your slide says Verified. This was a real hole. |
| 2 | **PS quote corrected to "avoid ranking *based on* protected or irrelevant attributes"** | You had "ranking on". It's inside quotation marks on the slide that proves problem-solution fit. Must be exact. |
| 3 | **"Illustrative example" label added to the toggle** | Without it, the visual asserts a measured result. It's synthetic demo data. This closes the only clean line of attack on your best graphic. |
| 4 | **Trophy + #1/#2 winner framing removed** | It read as "tier-3 student beats tier-1 student." That's not your claim, and it implies a systematic tilt you can't support. |
| 5 | **"impact ratios published" → "computed and displayed"** | At prototype stage nothing is published. Getting caught over-claiming *on the fairness line* is disproportionately expensive. |
| 6 | **"6 evidence levels" replaced with a visual ladder** | L0–L4 counts as five. You only reach six by including L3.5, which wasn't shown. Now the graphic settles it. |
| 7 | **Evidence Pipeline moved to Slide 3** | It duplicated the "Detailed explanation" bullets, and Slide 3's template pointer literally asks for *"Flow Charts/Images."* It was on the wrong slide. |
| 8 | **Body copy cut ~320 → ~180 words** | See §1. This is the fix that actually solves the clutter. |

---

## 1. The research this is built on — and one caveat

I could not find a corpus of actual winning SIH decks. What exists online is guidance articles and code repos, not slides. So instead of pretending to reverse-engineer winners, here is the presentation-design research that is real and that applies:

**Assertion–Evidence (Michael Alley, Penn State).** A slide should carry a **sentence headline stating the message**, supported by **visual evidence** — not a topic phrase over a bullet list. Studies found statistically significant gains in comprehension and recall versus the standard topic-subtopic format. Recommended headline length: **8–14 words**.

**Mayer's coherence principle.** People understand more deeply when extraneous material is *excluded*. Every word that isn't doing work is actively costing you.

**Mayer's redundancy principle.** Presenting the same content as both graphic and on-screen text splits the visual channel and hurts comprehension. **This is precisely what your pipeline diagram + explanation bullets were doing.**

**Mayer's spatial contiguity principle.** Words belong physically near the graphic they describe, not in a separate block.

> ### ⚠️ The caveat — and it changes how far you take this
> Mayer's redundancy work is about **narrated** multimedia. Your SIH portal submission is a **read-alone PDF** — no presenter, no voice-over. So the extreme "graphics only, minimal text" version is **wrong advice here**: a read-alone deck must carry meaning in text.
>
> What still applies fully: **cut redundancy** (don't say it twice), **cut extraneous words**, and **use assertion-style headlines**. What doesn't apply: stripping text down to a picture book.
>
> This slide targets **~180 words** — enough to stand alone, little enough to scan in 60 seconds.

---

## 2. Word budget — hold this line

| Zone | Target | Hard ceiling |
|---|---|---|
| Sub-headline under IDEA TITLE | 11 | 14 |
| Proposed Solution | 26 | 30 |
| Detailed explanation (3 bullets) | 31 | 40 |
| How it addresses (table) | 52 | 60 |
| Innovation (3 lines) | 28 | 35 |
| Fairness Toggle + caption | 38 | 45 |
| Evidence ladder chips | 14 | 18 |
| **TOTAL** | **~200** | **240** |

Your current slide is ~320. If you land at 200 you'll feel the difference immediately.

---

## 3. Layout (13.33 × 7.5 in)

```
┌────────────────────────────────────────────────────────────────────────┐
│ ⬭ Musketeer          IDEA TITLE                            [SIH logo]  │ y 0–0.75
│         PRAMAAN — Skills backed by verified evidence.                  │ y 0.75–1.35
│                    Matches backed by visible reasons.                  │
├──────────────────────────────────┬─────────────────────────────────────┤
│  LEFT COLUMN  x 0.40 → 6.55      │  RIGHT COLUMN  x 6.85 → 12.90       │
│                                  │                                     │
│  ❖ Proposed Solution             │   ┌───────────────────────────────┐ │
│    [callout box, 26 words]       │   │                               │ │ y 1.5
│                                  │   │   THE FAIRNESS TOGGLE         │ │
│  ❖ Detailed explanation          │   │   (large — this is the        │ │
│    • 3 bullets                   │   │    slide's memory hook)       │ │
│                                  │   │                               │ │
│  ❖ How it addresses the problem  │   └───────────────────────────────┘ │ y 5.05
│    [3-row table]                 │   caption + Illustrative label      │ y 5.15–5.75
│                                  │                                     │
│  ❖ Innovation and uniqueness     │   ┌───────────────────────────────┐ │
│    ★ 3 one-line assertions       │   │  EVIDENCE LADDER STRIP        │ │ y 5.9–6.75
│                                  │   └───────────────────────────────┘ │
├──────────────────────────────────┴─────────────────────────────────────┤
│                    @SIH Idea submission- Template                   2  │ y 6.95
└────────────────────────────────────────────────────────────────────────┘
```

**Column split is now 48 / 52** (was ~50/50 with two stacked diagrams). The toggle gets roughly **2× the vertical space** it had. That single change is most of the decluttering.

### Font sizes

| Element | Size |
|---|---|
| IDEA TITLE (template) | keep as-is, but reduce ~4pt so PRAMAAN competes |
| PRAMAAN sub-headline | **24–26 pt bold** |
| Pointer headings (❖) | **16 pt** — wording unchanged, never delete |
| Body bullets & table | **14 pt minimum. Never below.** |
| Diagram labels | 12–13 pt |
| "Illustrative example" | 10 pt italic |

---

## 4. PASTE-READY COPY

### 4.1 Sub-headline (under IDEA TITLE)

**Recommended — assertion style, 11 words:**
> **PRAMAAN** — Skills backed by verified evidence. Matches backed by visible reasons.

**Alternative — descriptive, if your team prefers a noun phrase:**
> **PRAMAAN** — Evidence-verified skill passport with explainable, auditable matching

I'd take the first. Parallel structure, states a claim rather than a category, and it's what a judge will repeat to a colleague. **[VERIFY]** Confirm "PRAMAAN" doesn't collide with an existing government product before you commit.

---

### 4.2 ❖ Proposed Solution (Describe your Idea/Solution/Prototype)

*(pointer wording unchanged — 26 words)*

> Every claimed skill carries **linked, graded, dated evidence**. Matching ranks only on **explicit role requirements** — and shows the evidence behind every match and every gap.

---

### 4.3 ❖ Detailed explanation of the proposed solution

*(3 bullets — 31 words)*

> - Evidence from resume, GitHub, coursework and issuer-signed credentials
> - Signatures checked against a **registered issuer list** — tampering *and* unknown issuers flagged
> - **LLM extracts only.** All scoring is deterministic, rule-based and reproducible

The two cut bullets ("6 evidence levels", "gaps returned with a route to close them") are now carried by the evidence ladder graphic and the table respectively. Nothing was lost.

---

### 4.4 ❖ How it addresses the problem

*(Keep the table. It's the strongest element on the slide. Quotes now exact.)*

| The PS asks for | We deliver |
|---|---|
| "explain which evidence supports the match" | Per-requirement evidence grid, drill-down to source text |
| "identify missing skills" | Named gaps + auto-checked micro-task to build the missing evidence |
| "avoid ranking **based on** protected or irrelevant attributes" | Protected attributes sit in a schema the matching engine **cannot read**; impact ratios computed and displayed |

⚠️ **Verify all three quotes against the official PS PDF from the portal**, not against what you pasted to me. I'm working from a transcription.

---

### 4.5 ❖ Innovation and uniqueness of the solution

*(3 one-line assertions — 28 words. Sub-sentences deleted; they are now presenter lines, see §6.)*

> ★ **Provenance, not competence** — we verify who issued what, unaltered
> ★ **Missing evidence ≠ low ability** — absence never subtracts score
> ★ **Bias measured, not asserted** — impact ratios + proxy-leakage test

These three lines are the entire differentiation of the project. Giving up their explanatory sub-clauses is the hardest cut on this slide and the most necessary one — a judge reading three sharp claims remembers them; a judge reading three claims plus three explanations remembers none.

---

## 5. The two graphics

### 5.1 THE FAIRNESS TOGGLE — dominant visual

Trophy removed. Winner framing removed. Emphasis moved from *who wins* to *the method changed the order*.

```
┌─────────────────────────────────────────────────────────────────┐
│                     THE FAIRNESS TOGGLE                         │
│                                                                 │
│   COUNT-BASED SCORING              REQUIREMENT-BASED SCORING    │
│  ┌──────────────────────┐   ➜    ┌──────────────────────────┐   │
│  │ 1  Candidate A       │        │ 1  Candidate B           │   │
│  │    12 certificates   │        │    1 deep project        │   │
│  │    20 repos          │        │    evidence on 4 of 5    │   │
│  │                      │        │    requirements          │   │
│  ├──────────────────────┤        ├──────────────────────────┤   │
│  │ 2  Candidate B       │        │ 2  Candidate A           │   │
│  └──────────────────────┘        └──────────────────────────┘   │
│                                                                 │
│   ranks by VOLUME                 ranks by REQUIREMENT-         │
│                                   RELEVANT EVIDENCE             │
└─────────────────────────────────────────────────────────────────┘
   Same two candidates. Same role. Only the scoring method changed.
   Illustrative example on synthetic profiles.          ← 10pt italic
```

**Four deliberate changes:**
- "Student" → **"Candidate"** (removes the schoolchild framing)
- **College tier deleted from the cards.** Your entire pitch is that college shouldn't be an input — so don't print it as a candidate attribute. Replace with the evidence fact that actually drives the result: *"evidence on 4 of 5 requirements."* This is the sharpest fix on the slide.
- Trophy and "winner" styling gone
- Caption reframed to the **method**, not the person

### 5.2 EVIDENCE LADDER — thin strip, bottom right

Replaces the "6 evidence levels" text claim with something a judge can see. Six chips, left→right, colour ramping light to dark:

```
 L0            L1            L2             L3              L3.5           L4
 Self-       Documentary  Corroborated  Authorship-     Task-          Issuer-
 reported                               linked          demonstrated   verified
 └──────────────── weaker evidence ─────────── stronger evidence ─────────────┘
```

14 words, settles the counting ambiguity, and makes "verified" concrete instead of asserted. **Only include this if it fits without crowding** — if it's tight, drop it and put "6 evidence tiers (L0–L4 + task-demonstrated)" back into bullet 2.

---

## 6. Where the cut content goes — presenter lines

You removed ~140 words from the slide. They don't disappear; they move to your mouth. Rehearse these:

| Slide element | What you say aloud |
|---|---|
| Provenance, not competence | *"No system can verify true ability from documents. Anyone claiming that is overselling. We verify who issued what, unaltered and when — and we grade everything else as evidence, with its strength on screen."* |
| Missing evidence ≠ low ability | *"A student with no internships and no paid certificates isn't less capable — they've had fewer chances to generate proof. In our system absence never subtracts score. That's enforced in code, not written in the UI."* |
| Bias measured, not asserted | *"We don't claim we removed bias. We measure it — impact ratios, plus a probe that tests whether our own feature set leaks protected attributes. The numbers are on screen."* |
| Fairness Toggle | *"Same two candidates, same role. Only the scoring method changed. That toggle is the whole project."* |

---

## 7. Pre-flight checklist — Slide 2 only

- [ ] All four pointer headings present, **worded exactly** as the template
- [ ] All three PS quotes checked **character-for-character against the official portal PDF**
- [ ] "registered issuer list" wording in place — no bare "signatures verified"
- [ ] "Illustrative example on synthetic profiles" label present under the toggle
- [ ] No trophy, no winner styling, **no college tier printed on the candidate cards**
- [ ] "computed and displayed" — not "published"
- [ ] Evidence Pipeline **removed from this slide** (now on Slide 3)
- [ ] Word count ≤ 240
- [ ] Nothing below 14 pt
- [ ] "Musketeer" matches the portal-registered team name exactly
- [ ] **[VERIFY]** PRAMAAN name checked for collision
- [ ] Exported to PDF, opened at 100%, read at arm's length — every line legible
- [ ] Someone outside the team read only this slide and explained the idea back correctly

That last box is the real test. If they can't do it from this slide alone, it isn't finished — because at portal screening, nobody will be there to explain it.

---

## Sources

- [How the Design of Presentation Slides Affects Audience Comprehension: A Case for the Assertion-Evidence Approach](https://www.researchgate.net/publication/286042632_How_the_Design_of_Presentation_Slides_Affects_Audience_Comprehension_A_Case_for_the_Assertion-Evidence_Approach)
- [Assertion-Evidence Slides Instruction Set — Michael Alley, Penn State](https://cpb-us-e1.wpmucdn.com/sites.psu.edu/dist/7/13153/files/2008/10/Assertion-Evidence-Slides-Instruction_Set.pdf)
- [Rethinking Slide Design in Scientific Presentation: The Assertion-Evidence Approach — Huck Institutes, Penn State](https://www.huck.psu.edu/event/rethinking-slide-design-in-scientific-presentation-the-assertion-evidence-approach)
- [Principles for Reducing Extraneous Processing in Multimedia Learning: Coherence, Signaling, Redundancy, Spatial and Temporal Contiguity — Cambridge Handbook of Multimedia Learning](https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/principles-for-reducing-extraneous-processing-in-multimedia-learning-coherence-signaling-redundancy-spatial-contiguity-and-temporal-contiguity-principles/CD5B7AE1279A9AB81F8EEBB53DBEC86E)
- [Cognitive Theory of Multimedia Learning — Harvard CHDS monograph](https://media.repository.chds.hsph.harvard.edu/static/filer_public/ca/62/ca625803-3d73-4855-b3e1-765870ce3772/2023_jwaxman_monograph_cogtheory_multimed.pdf)
- [SIH 2026 Presentation Template & Guidelines](https://thenewviews.com/sih-2026-ppt-template/)

# S30 — Adversarial Review + Sharpened Concept
## Written from a judge's chair. Nothing softened.

---

## 0. What this document is

Your handoff brief is good. Genuinely — it's in the top decile of hackathon planning docs I've seen. It correctly identifies that "verified" is the hard word, that proxy bias is real, and that LLM-as-ranker is a trap.

It also has **one structural flaw that will cost you the room**, three factual gaps that a well-read judge will find, and a demo plan that peaks too early.

This document does not repeat what your brief already got right. It attacks what it got wrong.

---

## 1. The structural flaw: you optimized for defensibility, not for winning

Read §38 and §39 of your brief again. The headline differentiators are:

- evidence trail
- willingness to say "we don't know"
- explainable matching
- human in the loop

Every one of those is **correct** and every one of them is **not a differentiator**.

Here's why. The problem statement literally contains the words *explain which evidence supports the match*, *identify missing skills*, and *avoid ranking based on protected attributes*. Every team that reads the statement carefully will build explainability and will say the word "bias" on stage. Explainability is the entry ticket, not the edge.

And "we are willing to say we don't know" is intellectually honest but it is **not a demo**. On stage it reads as: *our system does less than the other one.* Judges score novelty, technical implementation, and impact. A pitch whose emotional peak is a grey "Insufficient evidence" chip does not score on any of those three.

> **The flaw:** your brief built a product that is very hard to attack and not very hard to ignore.

You need the epistemic honesty **and** something that makes people sit up. Sections 3–6 below are that something.

---

## 2. The unanswered question that will end your Q&A

Your evidence ladder:

| Level | What it actually is |
|---|---|
| 0 — Self-reported | student said so |
| 1 — Documentary | student uploaded a file |
| 2 — Project evidence | student said so, in more detail |
| 3 — Repository evidence | a repo exists that a student pointed at |
| 4 — Assessed | *deferred to future work* |

Now the judge question:

> "Your project is called **Verifiable** Skill Passport. Levels 0 through 3 are all forms of unaudited self-assertion — a PDF I made in Canva sits at Level 1. Level 4 is the only rung with actual verification and you've explicitly cut it. So what does your platform verify?"

Under your current design there is no good answer. "We categorize the strength of self-assertion" is a true answer and it loses the room.

Your brief tried to solve this by lowering the claim (§7: *do not promise we verify*). That's the wrong direction. **You don't defuse the word "Verifiable" by retreating from it. You defuse it by splitting it.**

### The split that fixes everything

There are two completely different things people mean by "verify," and the whole conceptual mess in this problem statement comes from conflating them:

| | **Provenance verification** | **Competence verification** |
|---|---|---|
| Question | Did the claimed issuer really issue this, to this person, unaltered? | Can this person actually do the thing? |
| Answerable? | **Yes. Cryptographically. Binary.** | No — not by any system, ever, from documents |
| Buildable in 10 days? | **Yes** | No |

Say this on stage, in this order:

> "'Verified' means two different things and the industry keeps mixing them up. We verify **provenance** — cryptographically, with a real signature check you can watch fail live. We do **not** verify **competence**, because no document-based system honestly can. What we do instead is grade the *evidence* for competence on strength, relevance and recency, and show you every input."

That answer is honest, technically substantive, and it makes you sound like the only team in the room who understood the problem statement. It converts your biggest weakness into your opening line.

---

## 3. Fix #1 — Make "verified" real: build the provenance layer

This is the single highest-value change to your plan.

### 3.1 The standards actually exist and you should name them

**Open Badges 3.0 is now aligned to the W3C Verifiable Credentials Data Model 2.0.** A badge/credential is a signed VC. Comprehensive Learner Record (CLR) 2.0 is the same family. In 2025–26 the major issuers (Credly, Accredible, Canvas Credentials, POK) have been certifying as 3.0 issuers, though OB 2.0 is still the volume leader.

This means **"portable skill passport" already has a spec**. Your brief (§15) said "don't try to solve credential interoperability, just export JSON+PDF." That's over-cautious. Emitting your passport as an **Open Badges 3.0 / W3C VC-shaped signed JSON-LD document** is maybe half a day of work and it converts a vague word ("portable") into a standards claim you can point at.

Do not build a bespoke schema and call it portable. Portable means *someone else can read it*.

### 3.2 The India angle is your unfair advantage — use it

This is where most teams will have nothing, and it maps directly to SIH's preference for solutions that plug into national infrastructure.

- **DigiLocker** — documents issued through DigiLocker are digitally signed by the issuer and are recognised as **equivalent to originals under the IT Act, 2000**. APIs are published on **API Setu** (MeitY's national API platform). A consent-token + `document_types` REST call returns structured, digitally signed records across 70+ document types.
- **ABC / NAD / APAAR** — the Academic Bank of Credits sits on the National Academic Depository. Universities deposit credits, marksheets, degrees against a learner's **APAAR-linked ABC ID**. **NCrF has been adopted by 196 universities as of 2026.** This is a live, national, issuer-signed academic credit rail.

So your Level 4 is not "future assessment work." **Level 4 = issuer-signed.**

Revised ladder — note the ordering change, this matters:

| Level | Name | Meaning | Falsifiable? |
|---|---|---|---|
| 0 | Self-reported | claim only | no |
| 1 | Artefact-backed | a file exists, unsigned | no |
| 2 | Corroborated | ≥2 independent unsigned sources agree | weakly |
| 3 | Authorship-linked | verified account authorship (GitHub commits under a verified email, over time) | partially |
| **4** | **Issuer-verified** | **signature chain validates against a registered issuer DID / DigiLocker / NAD** | **yes, binary** |

### 3.3 The honest workaround for 10 days

You almost certainly **cannot** get DigiLocker or NAD partner API access in 10 days. Real onboarding takes weeks and requires an authorized entity.

Do this instead, and say it out loud on stage:

1. Build the **verifier** correctly — real Ed25519/RSA signature validation, real issuer registry, real revocation-status check, real tamper detection.
2. Stand up a **mock issuer service** that holds a real keypair and signs credentials the way a university or DigiLocker would.
3. On stage: *"The verification path is real cryptography against a real issuer registry. The issuer here is our sandbox, because DigiLocker partner onboarding is an institutional process, not a code problem. Swapping the issuer endpoint is a config change — the trust logic doesn't move."*

That is a completely defensible position and it is **enormously** stronger than "we don't claim verification."

### 3.4 Pre-load the blockchain answer

Someone will ask. Your brief says don't use blockchain (correct) but doesn't arm you for the question. Answer:

> "The trust gap here is *issuer trust*, not ledger integrity. A signed verifiable credential already gives tamper-evidence and issuer provenance. A chain would add consensus cost and solve a problem we don't have — and it wouldn't make a fake certificate true, it would just make it immutably fake."

---

## 4. Fix #2 — Your fairness story is one level too shallow

Your §12 says: exclude gender, caste, religion, age, college prestige, follower counts. Correct, and most teams won't even get that far.

But here's the counter a sharp judge lands:

> "You've told me what you excluded. How do you *know* it worked? Blindness isn't fairness — a model can reconstruct caste or gender from pincode, college, project topics, or language patterns. You've removed the labels, not the signal. And by not collecting the attributes at all, you've made it impossible to ever prove your own tool is clean."

This is the real state of the art, and it's why the only bias-audit law with teeth works the way it does.

### 4.1 What regulation actually requires (get these right in the PPT)

- **NYC Local Law 144-21** — first jurisdiction globally to mandate bias audits of automated employment decision tools. Requires an **independent annual bias audit computing impact ratios** across sex, race/ethnicity (EEO-1 categories), **and intersectional** categories, publicly posted. For tools that emit continuous scores, it uses **scoring rates (median score per group)**, not just selection rates. Categories under 2% of the audit data may be excluded.
- **EU AI Act, Annex III** — recruitment/selection systems (including CV filtering and candidate evaluation) are **high-risk**, triggering risk management, data governance, technical documentation, logging, transparency, **human oversight**, and accuracy/robustness obligations.
- ⚠️ **Date correction — do not get this wrong on a slide.** The AI Digital Omnibus agreement **postponed Annex III high-risk obligations from 2 August 2026 to 2 December 2027** (public-authority deployers of pre-existing systems: 2 August 2030). Half the blog posts still say August 2026. If you cite the old date and a judge knows, you look like you copy-pasted.

Note what this means: **your architecture already satisfies the EU AI Act's human-oversight requirement** because of your §20 decision. Say that. It's free credibility.

### 4.2 The architecture that answers the counter — two-channel separation

Design it so fairness is **enforced by the schema, not by good intentions**:

```
                 ┌──────────────────────────────┐
  student  ───►  │  MATCHING STORE              │
  consent A      │  evidence, skills, artefacts │──► matcher ──► ranking
                 │  (protected attrs physically │
                 │   absent from this schema)   │
                 └──────────────────────────────┘
                                                        ▲
                 ┌──────────────────────────────┐       │ read-only,
  student  ───►  │  AUDIT STORE (segregated)    │───────┘ offline,
  consent B      │  optional self-declared      │         never at
  (separate,     │  protected attributes        │         inference time
   revocable)    └──────────────────────────────┘
```

Two things fall out of this that no other team will have:

**(a) A live Fairness Report screen.** For a given opportunity's requirement set, compute the **impact ratio** per group = (selection rate for group) ÷ (selection rate for the most-selected group). Flag anything below the conventional **0.8 / four-fifths** threshold. Show it on screen with the numbers visible. Also show scoring-rate ratios, since your output is continuous.

**(b) A proxy-leakage test — this is your best technical slide.** Train a small classifier to predict a protected attribute *from your matching feature vector alone*. If it succeeds well above chance, you have proxy leakage. Report the AUC.

> "We removed college name. Then we trained a probe on our remaining feature vector and it still predicted college tier at 0.79 AUC — leaking through project-topic distribution and certificate-issuer mix. So we regularised those features. It's now 0.56. We are not claiming zero bias. We are claiming measured bias, with the number on screen."

That paragraph, delivered calmly, is worth more than every UI animation you will build. It's also the single most reusable artefact from this project.

### 4.3 The fairness principle your brief nearly found

Your §11 and §13 are the best sections in the whole brief — *insufficient evidence ≠ evidence of low ability*. Push it one step further and make it a **hard system invariant**, not a UI convention:

> **Invariant:** absence of evidence never contributes negative score. Missing requirements are reported as *gaps with a route to close them*, never as deductions.

Then enforce it in code — coverage is computed only over evidence present; unmatched requirements go in a separate `gaps[]` array that has no numeric weight. If a judge asks "how do I know a poor student isn't penalised?", you show them the function signature. Architectural answers beat verbal ones.

---

## 5. Fix #3 — The gap loop is your impact story, and you cut it

Your brief deferred Level-4 assessment. I'd re-cut the scope: **keep a minimal version, because it's the difference between a judging tool and an enabling tool.**

As designed, your product tells a student from a tier-3 college with no internships and no certificates: *"Docker — insufficient evidence."* Then it stops. That student is now permanently stuck in the grey chip, and the well-resourced student with 12 certificates is permanently ahead. You correctly diagnosed opportunity bias in §13 — but your product **observes** it rather than **fixing** it.

### The loop

```
gap detected  ──►  "Docker — no evidence"
                        │
                        ▼
             scoped, generated micro-task
             (e.g. containerise this 40-line Flask app,
              submit Dockerfile + passing build log)
                        │
                        ▼
             deterministic checker runs it in a sandbox
                        │
                        ▼
             passes → Level-3.5 "task-demonstrated" evidence,
             signed by YOUR platform as issuer, timestamped
```

Why this is the strongest single addition:

- It's the **only** mechanism in the whole design that lets a student *create* evidence rather than *possess* it. That is the entire equity argument, made operational.
- It closes the loop the problem statement asks for — *"identify missing skills"* implies something happens after identification.
- It's a genuinely great demo beat: gap → task → re-verify → passport updates → match % moves. Live. In 90 seconds.
- Your platform becomes a legitimate **issuer** of verifiable credentials, which makes the Open Badges 3.0 story land instead of being decorative.

**Be honest about its limits, unprompted:** unproctored, self-administered, narrow, no psychometric validation, trivially cheatable by a determined person with an LLM. Which is exactly why it sits at 3.5 and not 4, and why it's evidence rather than proof. Saying this before a judge says it is worth more than the feature.

Scope discipline: **two** hand-authored tasks, one checker, hardcoded. Not a task-generation engine.

---

## 6. Fix #4 — Team matching: you're leaving free technical depth on the table

Your §21 says "optimize for coverage, not four best students." Right instinct, no teeth. Give it teeth — it costs almost nothing:

- Team formation with skill-coverage constraints is **NP-hard** (Lappas et al. and the whole line of work after it).
- The **skill-coverage function is submodular**. Therefore greedy selection under a cardinality constraint carries a **(1 − 1/e) ≈ 0.632 approximation guarantee**.
- Recent work extends this to balancing **coverage against workload** across coordinated teams.

So: ~60 lines of greedy Python, plus an exact ILP (PuLP/OR-Tools) for small n to show the greedy result is at or near optimum on your demo data.

Now you can say:

> "Team formation with skill coverage is NP-hard. Our objective is submodular, so greedy gives a 1−1/e bound; at demo scale we also solve it exactly with an ILP and the two agree. We're not sorting by score and taking the top four."

Three things almost nobody adds, all cheap:

1. **Redundancy constraint on critical skills** — require ≥2 members with evidence on the critical path. Real teams need a bus factor above 1.
2. **Team gap report** — what the assembled team collectively still cannot do. Nobody outputs this and it's the most useful screen for an actual organiser.
3. **Marginal contribution per member** — "Student C was selected because they added Docker + CI coverage no one else had," not because of an individual score. That's explainability at the *team* level, which the problem statement asks for and which everyone will forget.

---

## 7. Three factual corrections to your brief

### 7.1 GitHub is weaker evidence in 2026 than your §10 assumes — and do NOT try to detect AI code

- **73%+ of developers now use AI coding assistants daily.**
- **Heuristic AI-generated-code detectors run at roughly 20–25% accuracy.** Post-hoc detection is a dead end; the research consensus is that authorship must be captured as **provenance at creation time**, not inferred after the fact (hence tools like Git AI writing immutable authorship logs into Git notes).

**Implication:** if you demo "we detect AI-written code," a judge who follows this literature will end you. Don't go near it.

Use only signals that are structurally checkable:

| Use | Don't use |
|---|---|
| commit authorship email matches verified account | commit count |
| commit history spread over weeks, not one bulk push | stars / followers |
| fork status and upstream divergence | repo count |
| student authored vs. only merged | README polish (your own §22) |
| dependency manifests corroborating claimed stack | lines of code |

Frame it exactly as: **authorship signals, not competence proof.**

### 7.2 Skill extraction accuracy is your silent single point of failure

Nothing downstream is worth anything if extraction is wrong, and nobody plans for this. Reality check:

- **ESCO** has ~**13,890** Level-4 skills across a 4-level hierarchy; Web Services API + downloadable local API.
- **Lightcast Open Skills** is ~**32,000+** skills, refreshed roughly fortnightly.
- There's an active research literature (contrastive bi-encoders, ESCOXLM-R, ESCoE's Skills Extractor Library) precisely *because* naive string/LLM matching to these taxonomies fails.

**Do not point an LLM at 32,000 skills and hope.** Do this:

1. Curate **200–400 skills** relevant to Indian student tech/multidisciplinary internships. Map each to its ESCO/Lightcast ID so you can claim standards alignment without carrying the whole taxonomy.
2. Pipeline: LLM extraction → embedding match to the curated set → confidence threshold → anything below threshold lands in an explicit **`unmapped`** bucket that is shown, not silently dropped.
3. Hand-label **50 documents**. Report **precision, recall, and unmapped rate**.

That last step is disproportionately persuasive. Almost no hackathon team reports a measured accuracy number on their own pipeline. Having one — even a modest one, on 50 samples, with the sample size stated — signals engineering maturity more than any feature.

### 7.3 Novelty: know what already exists, before a judge tells you

Be very clear-eyed here. "Skill passport" is **not** a novel concept in 2026:

- **Singapore** — Careers & Skills Passport consolidating employment, qualification and certification records with verified employer sharing.
- **California** — Career Passport, skills-based hiring, 2026 vendor pilots with real users.
- **India** — a blockchain+AI "Skill Passport" product launched **March 2026** targeting students, professionals, employers, universities and government bodies.
- **Velocity Network Foundation** — open-source, vendor-neutral "Internet of Careers" running W3C VCs, DIDs, Open Badges, LER wrappers, CTDL, CLR.
- **US Dept. of Education**, Jan 2026 — "Connecting Talent to Opportunity Challenge," states building talent marketplaces from LERs + credential registries + skills-based job descriptions.
- Commercial: mySkillWallet, Credly, Accredible, Canvas Credentials.

**If you claim the passport is your innovation, you will be corrected on stage.** Say it first instead:

> "Skill passports aren't new — Singapore, California and Velocity Network all run versions. What isn't solved is: how do you grade evidence you can't verify, how do you prove your ranking isn't biased instead of asserting it, and how does a student with no opportunities *generate* evidence rather than just lacking it. Those three are where we contribute."

That reframing costs you nothing and buys you the room's respect. Fake novelty is the fastest way to lose Q&A.

---

## 8. The demo, restructured around three moments

Your brief's demo (upload → passport → match → why → team) is logical and it peaks in the first 40 seconds. Judges remember **moments**, not feature sequences. Build three.

### Moment 1 — "The Fairness Toggle" *(this is your pitch, entire)*

Two students, side by side:

- **Student A** — 12 certificates, tier-1 college, 20 repos, immaculate READMEs
- **Student B** — tier-3 college, one deep project, no certificates

Requirement set: a specific ML-backend internship.

Your system ranks **B first**. Open the "Why" panel — B has requirement-relevant, recent, authorship-linked evidence on 4 of 5 requirements; A has volume across unrelated areas.

Then flip a toggle labelled **"Naive scoring (count-based)"**. A jumps to #1.

Say nothing for two seconds. Then:

> "That toggle is the entire project."

### Moment 2 — "The Tamper Check"

Upload a certificate. Green: **Issuer-verified**, signature chain shown.

Open it, change one character, re-upload. Red: **Signature invalid — status downgraded to Unverified**, and watch the passport confidence and the match percentage both move in real time.

Binary. Live. Undeniable. This is the moment that earns the word *Verifiable* in your title.

### Moment 3 — "The Audit"

Open the Fairness Report. Impact ratios per group against the 0.8 threshold. Then the proxy-leakage probe: *before* regularisation 0.79 AUC, *after* 0.56.

> "We're not claiming bias-free. We're claiming bias-measured. Here are our numbers. Every other system asks you to trust theirs."

**Then**, and only then, the gap loop (Moment 4 if time allows: gap → micro-task → re-verified → match moves) and the team formation with its marginal-contribution explanation.

Cut ruthlessly to fit. If you can only land two, land **1 and 3**.

---

## 9. Revised 10-day plan (deltas from your §33 only)

| Days | Change from your plan |
|---|---|
| 1–2 | **Add:** curate the 200–400 skill taxonomy with ESCO/Lightcast IDs, and lock the two-channel schema so protected attributes are *physically absent* from the matching store. Both are near-impossible to retrofit. |
| 3–4 | **Add:** mock issuer + signature verifier (half a day, highest ROI in the project). **Cut:** any GitHub deep code analysis — authorship signals only. |
| 5–6 | Passport + gaps as planned. **Add:** hand-label the 50-doc extraction test set. Do it *while* building, not at the end — you will not do it at the end. |
| 7–8 | Matching + explainability + greedy/ILP team formation. **Add:** Fairness Report screen + proxy probe. **Cut:** recruiter portal down to one read-only screen with seeded data. |
| 9 | As planned + **rehearse the failure path** — what you do when the live GitHub fetch dies on stage. |
| 10 | As planned. No new features. Agreed. |

**Explicit cut list, decided now, not at 2am on Day 8:** recruiter portal (→ one screen), multi-source ingestion beyond resume+GitHub+manual, micro-task generation engine (→ two hardcoded tasks), any mobile view, DigiLocker live integration (→ mock issuer), notifications, chat.

---

## 10. Judge Q&A — the eight that will actually be asked

1. **"What do you actually verify?"** → Provenance, cryptographically. Not competence. Nobody can verify competence from documents. *[§2]*
2. **"How is this different from an ATS or a resume parser?"** → An ATS ranks candidates. We grade evidence and publish our own fairness numbers. Show the toggle. *[§8, Moment 1]*
3. **"How do you know you're not biased?"** → We don't assume it, we measure it. Impact ratios, 0.8 threshold, proxy-leakage AUC before and after. *[§4]*
4. **"Isn't a skill passport already a thing?"** → Yes — Singapore, California, Velocity Network, and one launched in India in March 2026. Here are the three things they don't solve. *[§7.3]*
5. **"Why not blockchain?"** → The gap is issuer trust, not ledger integrity. A chain doesn't make a fake certificate true. *[§3.4]*
6. **"How accurate is your skill extraction?"** → P/R on a 50-document hand-labelled set, plus our unmapped rate. Small sample, stated as such. *[§7.2]*
7. **"What if a student has no evidence at all?"** → Absence of evidence never subtracts score — that's a system invariant, not a policy. And the gap loop lets them generate evidence. *[§4.3, §5]*
8. **"Will anyone actually adopt this?"** → *Raise this yourself before they do.* Cold start is the hardest problem here and it isn't a technical one, which is exactly why we consume DigiLocker / NAD / Open Badges rather than inventing a trust layer nobody would join. *[§3.2]*

---

## 11. Honest verdict

**On the problem statement:** S30 is a reasonable choice. It's feasible, it demos well, and it has enough conceptual depth to survive Q&A — *if* you build the verification and audit layers. It is **weak on novelty**, which is a scored criterion, and you cannot fix that by pretending otherwise. You fix it by being novel in the three places that are still genuinely open: evidence-quality modelling, measured fairness, and evidence generation for the under-resourced.

**On your brief:** the analysis is strong; the *strategy* is too defensive. It builds something unattackable and forgettable. Your §37 failure mode — "well-reasoned resume analyzer with better vocabulary" — is closer than the document believes, because the document's own headline features are all things the problem statement already mandates.

**The three changes that matter, in order:**

1. **Provenance verification with a real signature check** — turns your title's weakest word into your opening line. *(≈1 day)*
2. **Measured fairness: impact ratios + proxy probe** — turns "we excluded protected attributes" into a defensible engineering claim with numbers on screen. *(≈1 day)*
3. **The gap-closing loop** — turns a judging tool into an enabling one, and gives you your equity story. *(≈1 day)*

Three days of work. They're the three days that decide whether you place.

**One thing I can't assess:** the strength of the competing teams and how technical your specific judges are. If the panel is non-technical, Moment 1 (the toggle) carries the whole pitch and Moment 3 may go over their heads. Rehearse both a technical and a non-technical version of the fairness explanation and read the room in the first 30 seconds.

**Also flagging a discrepancy:** the brief says SOAIDEATHON-S30 with a 10-day internal timeline; you described this as SIH. If this is the SIH internal round feeding the national hackathon, the plan holds. If it's the national round, the timeline and the judging panel are different and some of this should be re-cut.

---

## Sources

- [Open Badges 3.0: What Is the Status in 2026?](https://www.virtualbadge.io/blog-articles/open-badges-3-0-what-is-the-status-in-2026)
- [Open Badges 3.0 Implementation Guide — 1EdTech](https://www.imsglobal.org/spec/ob/v3p0/impl)
- [Comprehensive Learner Record (CLR) and Open Badges FAQ — 1EdTech](https://www.1edtech.org/clr/faq)
- [Open Badges 3.0 vs W3C Verifiable Credentials](https://blog.kolleges.net/en/blog/open-badges-3-0-vs-verifiable-credentials/)
- [DigiLocker — API Setu (MeitY)](https://apisetu.gov.in/digilocker)
- [DigiLocker KYC: How Document-Based Verification Works in 2026](https://www.befisc.com/fintechsherlock/digilocker-kyc-verification-india/)
- [Academic Bank of Credits and APAAR — PIB, Government of India](https://www.pib.gov.in/FactsheetDetails.aspx?id=150693&NoteId=150693&ModuleId=16&reg=48&lang=2)
- [Academic Bank of Credits and APAAR Strengthen India's Digital Education Ecosystem](https://ddindia.co.in/2026/06/academic-bank-of-credits-and-apaar-strengthen-indias-digital-education-ecosystem/)
- [ABC Integration Guide for Indian Universities](https://unicoreos.com/blog/academic-bank-of-credits-integration-guide)
- [EU AI Act — Annex III: High-Risk AI Systems](https://artificialintelligenceact.eu/annex/3/)
- [EU AI Act Omnibus Agreement — Postponed High-Risk Deadlines — Gibson Dunn](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/)
- [EU Nears Approval of Agreement to Delay Rules for AI Use in Employment Decisions — Ogletree](https://ogletree.com/insights-resources/blog-posts/eu-nears-approval-of-agreement-to-delay-rules-for-ai-use-in-employment-decisions/)
- [NYC Local Law 144-21 and Algorithmic Bias — Deloitte](https://www.deloitte.com/us/en/services/audit-assurance/articles/nyc-local-law-144-algorithmic-bias.html)
- [Automated Employment Decision Tools — NYC Rules](https://rules.cityofnewyork.us/rule/automated-employment-decision-tools-2/)
- [DCWP AEDT FAQ — City of New York](https://www.nyc.gov/assets/dca/downloads/pdf/about/DCWP-AEDT-FAQ.pdf)
- [Null Compliance: NYC Local Law 144 and the Challenges of Algorithm Accountability (arXiv)](https://arxiv.org/html/2406.01399v1)
- [ESCO — Download and API](https://esco.ec.europa.eu/en/use-esco/download)
- [Lightcast Open Skills](https://lightcast.io/open-skills)
- [The Skills Extractor Library — ESCoE](https://www.escoe.ac.uk/the-skills-extractor-library/)
- [Contrastive Bi-Encoder Models for Multi-Label Skill Extraction (arXiv)](https://arxiv.org/pdf/2601.09119)
- [Submodularity in the Team Formation Problem](https://avradeep1.github.io/papers/Team-Formation_camera_ready.pdf)
- [Forming Coordinated Teams that Balance Task Coverage and Expert Workload (arXiv)](https://arxiv.org/html/2503.05898)
- [Detecting AI Coding Agents in Open Source: A Census of 180M Repositories (arXiv)](https://arxiv.org/pdf/2606.24429)
- [HybridCodeAuthorship: Line-Level Code Authorship Detection (arXiv)](https://arxiv.org/pdf/2606.12620)
- [Git AI — Git-native AI authorship provenance](https://github.com/git-ai-project/git-ai)
- [Velocity Network Foundation](https://www.velocitynetwork.foundation/the-latest)
- [Verifiable Credentials Wallets in a Skills-First Talent Marketplace — JFF](https://www.jff.org/idea/verifiable-credentials-wallets-in-a-skills-first-talent-marketplace/)
- [Skill Passport Launches in India (March 2026) — Business Standard](https://www.business-standard.com/content/press-releases-ani/skill-passport-launches-in-india-a-unified-digital-identity-for-professional-credentials-powered-by-blockchain-and-ai-126032800700_1.html)
- [Growth of Digital Tools: Digital Wallets, Skills Passports, Digital ID Wallets — Learn & Work Ecosystem Library](https://learnworkecosystemlibrary.com/topics/growth-of-digital-tools-digital-wallets-skills-passports-and-digital-id-wallets/)
- [Smart India Hackathon — Official Portal](https://sih.gov.in/)
- [SIH Evaluation Guidelines](https://www.scribd.com/document/712193023/Evaluation-Guideline-for-Smart-India-Hackathon-2023)

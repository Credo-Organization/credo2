# Phase 1 Plan — Breakdown, Counter Questions + Solutions
### Hinglish mein. Har counter ke saath solution. Kuch sugarcoat nahi.

---

## ⚖️ Pehle ek honest disclaimer

**Plan kharaab nahi hai.** Wo coherent hai, buildable hai, aur usme kam se kam ek genuinely smart idea hai (framework detection). Jo problems niche likhi hain wo **scope aur PS-compliance** ki hain — **quality** ki nahi. Ye farak important hai.

Aur ye bhi saaf kar deta hoon ki kya **fact** hai aur kya meri **rai**:

| Fact — verify kar sakte ho | Meri opinion — disagree kar sakte ho |
|---|---|
| Gender protected attribute hai, PS mein explicitly likha hai | "Career roadmap scope creep hai" |
| Internship matching PS ke title mein hai, plan mein nahi | "Stars fetch hi mat karo" |
| Plan mein koi signature verification nahi hai | Priority ka order |
| Mind map se fairness clause truncate hua hai | Kaunsa feature pehle cut ho |

Roadmap wali baat maine pichli baar zaroorat se zyada strongly boli thi. SIH impact aur future scope ko score karta hai — roadmap ka asli student impact hai. **Asli problem roadmap ka hona nahi hai. Asli problem matching ka na hona hai.** Dono ho sakte hain toh dono rakho.

---

# PART 1 — Friend ne actually kya propose kiya

## Step 1 — Login aur Onboarding
Google Sign-In. Fir form: naam, **gender**, country, education, graduation year, aur **career goal** (Frontend / Backend / Full Stack / AI / ML / Data Science). Career goal aage ka poora analysis decide karta hai.

## Step 2 — GitHub Connect
Repos, contribution activity, commit history, languages, **stars**, project metadata.

**Aur ek achhi cheez:** sirf "68% JavaScript" nahi. Repo ke andar dekh kar actual **frameworks** nikaalta hai — React, Next.js, Express, TensorFlow. Matlab student *bana kya raha hai*.

## Step 3 — Resume aur Certificates
AI extract karta hai: skills, projects, education, achievements, certificate names, issuing orgs, technologies.

## Step 4 — Evidence Engine
Cross-validation:
> React certificate + GitHub pe React projects → confidence **badhega**
> Sirf resume mein likha, koi support nahi → confidence **kam**

## Step 5 — Skill Passport
Profile, career goal, GitHub stats, tech stack, certificates, top projects, aur **har skill ke saath confidence level + uski wajah.** Arbitrary score nahi.

## Step 6 — Goal-Based Skill Gap Analysis
Current skills vs career goal ki requirements. *"Full Stack banna hai par sirf HTML/CSS/JS/React aata hai → Node.js, SQL, Docker missing."*

## Step 7 — Career Roadmap
AI banata hai: kya seekhna hai, kaunse project, kis order mein.

## Step 8 — Team Formation *(future — UI mockup)*

## Step 9 — QR Skill Passport *(optional)* — networking ke liye, recruitment ke liye nahi.

---

# PART 2 — COUNTER QUESTIONS + SOLUTIONS

---

## 🔴 ROOT CAUSE

### ❓ Counter 0 — Mind map se PS ka ek poora clause gayab hai

Tumhare canvas mein:
> *"...explain which evidence supports the match and identify missing skills."*

Asli PS:
> *"...explain which evidence supports the match, identify missing skills **and avoid ranking based on protected or irrelevant attributes**."*

**Fairness ka poora clause truncate ho gaya** — aur isliye Phase 1 mein fairness kahin nahi hai. Teen requirements mein se ek gayab, aur wahi jispe tumhara differentiation khada tha.

### ✅ SOLUTION

1. Portal se PS **copy-paste** karo, type mat karo. Mind map theek karo.
2. Ek **PS Compliance Checklist** banao — ek table jisme har PS requirement ke saamne feature ka naam ho:

| PS requirement | Feature | Status |
|---|---|---|
| convert verified coursework/projects/competitions/micro-credentials → portable passport | Evidence Engine + Passport | 🟡 verification missing |
| match to internships | Role Requirement Matching | 🔴 absent |
| match to multidisciplinary teams | Team Formation | 🟡 mockup |
| explain which evidence supports the match | Evidence grid | 🟡 match hi nahi hai |
| identify missing skills | Gap Analysis | ✅ |
| avoid ranking on protected/irrelevant attributes | — | 🔴 absent + violated |

Ye table deck mein bhi jaa sakta hai. **Judge ko dikhna chahiye ki tumne requirement-by-requirement socha hai.**

*Effort: 1 ghanta*

---

## 🔴 CRITICAL

### ❓ Counter 1 — Onboarding mein **gender** kyun?

Gender protected attribute hai. PS kehta hai protected attributes pe rank mat karo. Tum use signup ke step 1 pe, naam ke bagal mein collect kar rahe ho.

**Aur isse bura:** Slide 2 pe likha hai *"Protected attributes sit in a schema the matching engine cannot read."* Agar onboarding gender ko main profile mein likhta hai, **tumhari slide jhooth hai.** Judge ko code dekhne ki zaroorat nahi — bas dono cheezein saath rakhni hain.

Aur plan mein gender ka **koi use hi nahi bataya gaya.**

### ✅ SOLUTION — teen options, apni marzi se chuno

**Option A — Hatao (sabse simple, sabse safe)**
Onboarding se gender aur country dono hata do. Kaam khatam. Data minimisation principle: jo use nahi karna wo collect mat karo.

**Option B — Alag karo (agar fairness audit chahiye)**
```sql
-- Main schema mein NAHI
CREATE SCHEMA audit;

CREATE TABLE audit.demographics (
  user_id      uuid PRIMARY KEY,
  self_declared jsonb,        -- optional, student khud bharta hai
  consented_at timestamptz
);

REVOKE ALL ON SCHEMA audit FROM app_user;   -- matching engine ka role
GRANT USAGE ON SCHEMA audit TO auditor;
```
- Onboarding mein **nahi** — passport ban jaane ke **baad** ek alag optional screen
- Alag consent checkbox, saaf likha: *"sirf fairness audit ke liye, matching mein kabhi use nahi hoga"*
- Skip karna allowed ho

**Option C — Abhi hatao, Phase 2 mein Option B** ← *ye recommend karta hoon*

Aur ek bonus: Option B ka `REVOKE` statement ek **demo** ban jaata hai. Stage pe psql khol ke `SELECT * FROM audit.demographics;` chalao matching wale user se → `ERROR: permission denied`. Ye teen slides se zyada powerful hai.

*Effort: Option A = 10 minute · Option B = 2-3 ghante*

---

### ❓ Counter 2 — **Internship matching kahan hai?**

PS ka title: *"Verifiable Skill Passport and Explainable **Internship-Team** Matching Platform"*

Phase 1 mein: passport ✅, gap analysis ✅, roadmap ✅
Team formation: mockup
**Internship matching: kahin nahi**

Matlab matching ke **dono** hisse missing hain — jo PS ka aadha hai.

### ✅ SOLUTION — tumne ye already bana liya hai, bas naam galat hai

Sochо: student ki evidence ko **ek role ki requirements** se compare karna, coverage aur gaps nikaalna — **yahi requirement-based matching hai.** Tumne bana ke usko "career guidance" bol diya.

**Karo ye:**

**1. Do table add karo**
```sql
opportunities (
  id, org_name, title, description, is_demo
)

opportunity_requirements (
  opportunity_id, skill_id, weight, is_critical
)
```

**2. 8–10 internships seed karo.** Real postings uthao (Internshala, LinkedIn public listings, company career pages), requirements manually taxonomy pe map karo. Ye **research work** hai, coding nahi — koi non-dev team member kar sakta hai.

Example:
```
"AI/ML Intern — Analytics Startup"
  Python           30%   critical
  Machine Learning 25%   critical
  Pandas/NumPy     20%
  SQL              15%
  Docker           10%
```

**3. Wahi coverage function chalao** jo career-goal pe chala rahe ho. Code already likha hai.

**4. Ek screen add karo:**
```
AI/ML Intern — 78% requirement coverage

✅ Python              GitHub (12 repos) + certificate
✅ Machine Learning    2 projects + coursework
⚠️  SQL                sirf resume mein mila
❌ Docker              koi evidence nahi  → [Gap kaise bharein]
```

**Bas. Ek din ka kaam.** Aur ek PS-adjacent feature seedha **PS-compliant** ban jaata hai.

*Effort: roughly ek din (2 log)*

---

### ❓ Counter 3 — Tum **verify** kya kar rahe ho?

Flow mein kahin bhi nahi hai: signature verification · issuer registry · Open Badges · DigiLocker.

Evidence Engine jo kar raha hai wo **corroboration** hai. Useful hai, par wo Level 2 hai. **Verification nahi hai.**

Project ka naam **"Verifiable"** Skill Passport hai. Judge poochega — abhi jawab hai: kuch nahi.

### ✅ SOLUTION — teen levels, jitna time ho utna karo

**LEVEL 1 — Minimum (bina iske submit mat karo)**

Ek Open Badge / signed credential JSON accept karo aur uska signature check karo:

```python
import jwt
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

ISSUER_REGISTRY = {
    "did:web:demo-university.edu": "<public_key_pem>",
    "did:web:pramaan.app":         "<our_own_public_key>",
}

def verify_credential(vc_jwt: str):
    header = jwt.get_unverified_header(vc_jwt)
    issuer = jwt.decode(vc_jwt, options={"verify_signature": False})["iss"]

    if issuer not in ISSUER_REGISTRY:
        return {"status": "UNRECOGNISED_ISSUER", "level": 1}

    try:
        jwt.decode(vc_jwt, ISSUER_REGISTRY[issuer], algorithms=["EdDSA"])
        return {"status": "ISSUER_VERIFIED", "level": 4}
    except jwt.InvalidSignatureError:
        return {"status": "SIGNATURE_INVALID", "level": 0}
```

Teen alag alag outcome, teen alag UI states. **Ab tum sach mein kuch verify kar rahe ho.**

*Effort: 3-4 ghante*

**LEVEL 2 — Mock issuer + tamper demo**

Ek chhota `issuer-sandbox` service banao jo real Ed25519 keypair rakhta hai aur credentials sign karta hai — jaise ek university karti.

Demo: credential upload karo → 🟢 **Issuer-verified** → file mein **ek character** badlo → dobara upload → 🔴 **Signature invalid** → passport ki confidence aur match % dono live girte hue dikhao.

**Stage pe bolo:** *"Verification path bilkul real cryptography hai. Issuer yahan hamara sandbox hai kyunki DigiLocker onboarding ek institutional process hai, coding problem nahi. Endpoint badalna config change hai."*

*Effort: aadha din*

**LEVEL 3 — QR-based issuer check (agar time bache)**

NPTEL/AICTE type certificates pe QR hota hai jo issuer ke verification page pe le jaata hai. Wo path banao — **par usko Level 3.5 bolo, Level 4 nahi.** Wo page scraping hai, cryptography nahi. Do alag mechanism, do alag tier, honestly labelled.

*Effort: ek din*

---

### ❓ Counter 4 — Fairness ka mechanism kahan hai?

Impact ratios nahi · proxy test nahi · segregation nahi · **par gender collect ho raha hai.**

### ✅ SOLUTION — teen levels

**LEVEL 1 — Minimum viable fairness (sirf 2-3 ghante)**

Ye teen cheezein karo aur tum defensible ho jaate ho:

1. **Protected attributes matching store se physically bahar** (Counter 1 ka solution)
2. **Ek "What We Exclude" panel** UI mein — literally list karo:
   ```
   Ranking mein ye kabhi use nahi hote:
   ✗ Gender          ✗ College name / tier
   ✗ Country         ✗ GitHub stars & followers
   ✗ Age             ✗ Certificate count
   ✗ Photo           ✗ README quality
   ```
   Ye ek screen hai. Par wo **auditable claim** hai — judge check kar sakta hai.
3. **Code mein enforce karo** — matching function ke feature list mein ye fields hain hi nahi. Ek unit test likho jo fail ho agar koi add kare.

**LEVEL 2 — Impact ratio (agar synthetic data bana sako)**

40-50 synthetic profiles banao alag alag backgrounds ke. Ek opportunity pe matching chalao. Fir:

```python
selection_rate = {g: selected[g] / total[g] for g in groups}
best = max(selection_rate.values())
impact_ratio = {g: r / best for g, r in selection_rate.items()}
# 0.8 se neeche = flag
```

Screen pe dikhao. **Numbers ke saath.**

**LEVEL 3 — Proxy leakage probe**

Ek chhota classifier train karo jo *sirf tumhare matching features* se college tier predict kare. AUC report karo. 0.5 = koi leakage nahi. 0.65+ = problem hai.

> *"Hum bias-free hone ka dawa nahi kar rahe. Hum bias-measured hone ka dawa kar rahe hain."*

*Effort: L1 = 2-3 ghante · L2 = aadha din · L3 = aadha din*

---

## 🟡 IMPORTANT

### ❓ Counter 5 — Do student-controlled sources match karna verification kaise hua?

> *"React certificate + GitHub React projects → confidence badhega"*

**Dono cheezein student ne khud banayi hain.** Certificate Canva pe 10 minute, tutorial repo ek shaam. **Do self-assertions = ek hi claim do baar.**

Aur ye wahi trap hai jo original brief §11 mein tha — *"more evidence = better person"*. Jiske paas resources hain wo dono bana lega.

### ✅ SOLUTION — independence ko code mein define karo

```python
class SourceIndependence(str, Enum):
    SELF_PROVIDED   = "self"        # resume, uploaded cert, student's own repo
    PLATFORM_OBSERVED = "observed"  # GitHub commit authorship over time
    THIRD_PARTY_SIGNED = "signed"   # issuer-signed credential

def corroboration_bonus(sources) -> float:
    classes = {s.independence for s in sources}
    if len(classes) == 1 and SourceIndependence.SELF_PROVIDED in classes:
        return 0.0          # ← do self-provided sources = koi bonus nahi
    return min(0.15, 0.05 * (len(classes) - 1))
```

**Aur reason string mein sach likho:**

| Ab kya likhna hai | Pehle kya likh rahe the |
|---|---|
| *"2 sources — dono student-provided. Independent confirmation nahi."* | *"High confidence — multiple sources"* |
| *"University-signed credential + independent GitHub authorship"* | *"High confidence"* |

Ye ek change tumhe **imandaar** bana deta hai aur judge ke sabse tez sawaal ka jawab pehle se de deta hai.

*Effort: 2 ghante*

---

### ❓ Counter 6 — Career Roadmap PS mein hai hi nahi

*(Ye meri opinion hai, fact nahi — dekh ke faisla karo)*

PS kehta hai *"identify missing skills"* — wo gap analysis kar raha hai. Roadmap uske aage career-guidance territory hai. Risk: crowded category, LLM ka unverifiable output, aur build time kha raha hai.

### ✅ SOLUTION — hatao mat, demote karo

1. **Match ke neeche ek panel banao**, alag feature nahi:
   ```
   Docker — koi evidence nahi
   └─ [Ye gap kaise bharein ▾]
        · Docker ka basic course
        · Apne existing project ko containerise karo
        · Ya: 15-min task karke evidence banao →
   ```
2. **Roadmap ko "suggestion" bolo, "plan" nahi.** LLM ka output hai, admit karo.
3. Build order mein **matching ke baad** rakho.

Isse roadmap ka impact bhi rehta hai aur PS compliance bhi aa jaati hai.

*Effort: sirf reorder — naya kaam nahi*

---

### ❓ Counter 7 — GitHub **stars** kyun?

Stars = popularity, competence nahi. Original brief §12 mein stars/followers proxy bias ki list mein the. Achha developer jiska repo kisi ne nahi dekha = 0 stars. Viral tutorial repo = 500 stars.

### ✅ SOLUTION

Fetch kar lo, par saaf separate karo:

```python
class RepoSignals(BaseModel):
    # ── scoring mein use hote hain ──
    authored_commits: int
    commit_span_days: int
    is_fork: bool
    declared_deps: list[str]
    detected_frameworks: list[str]

    # ── SIRF display, scoring mein KABHI nahi ──
    display_only_stars: int
    display_only_followers: int
```

`display_only_` prefix ek convention hai jo code review mein turant dikh jaata hai. Ek unit test likho jo check kare ki scoring function inko touch na kare.

**Aur slide pe stars mat likho.**

*Effort: 30 minute*

---

### ❓ Counter 8 — Consent aur privacy kahan gaya?

Phase 1 mein kuch nahi: consent scopes, revocation, delete/export, recruiter ko kya dikhega.

Ye tumhare MVP list mein tha. QR feature bhi hai — bina consent model ke wo permanent public access hai.

### ✅ SOLUTION — teen cheezein, aadha din

**1. Share scope selector**
```
Apna passport share karein:
  ○ Sirf skills (evidence detail nahi)
  ○ Skills + evidence
  ○ Poora passport
Expiry:  [7 din ▾]
[Share link banao]
```

**2. Revoke button + share history**
```
Active shares:
  Acme Startup   · skills+evidence · 5 din baaki  [Revoke]
  Hackathon Team · sirf skills     · 2 din baaki  [Revoke]
```

**3. Account delete + JSON export** — ek button dono ke liye

**Plus RLS policy** — consent database mein enforce ho, application code mein nahi:
```sql
CREATE POLICY passport_share_scope ON evidence
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM consents c
      WHERE c.user_id = evidence.user_id
        AND c.grantee_id = auth.uid()
        AND c.revoked_at IS NULL
        AND c.expires_at > now()
    )
  );
```

**Judge ka sawaal:** *"recruiter ko sirf wahi dikhega jo student ne share kiya — ye kaise pakka?"*
**Jawab:** *"Ye Postgres policy hai, application code nahi. Code path bhoolna possible hai, policy bhoolna nahi."*

*Effort: aadha din*

---

### ❓ Counter 9 — Chhe software roles ko "multidisciplinary" kaise bologe?

Frontend, Backend, Full Stack, AI, ML, Data Science — sab ek hi discipline. PS mein *"multidisciplinary teams"* likha hai.

### ✅ SOLUTION — do role add karo, khatam

Career goal list mein ye jodо:
- **UI/UX Designer** — Figma, user research, design systems, prototyping
- **Product / Business Analyst** — requirements, SQL, analytics, documentation

Bas do entries. Ab "multidisciplinary" **sach** ho gaya, aur team formation demo bhi zyada convincing lagta hai — kyunki asli team mein designer hota hai.

*Effort: 1 ghanta (skill lists banane ka)*

---

## 🟢 JO SAHI HAI — genuinely

**1. Framework detection** — poore document ka best idea. "68% JavaScript" ki jagah manifests aur imports se React/Next/Express/TensorFlow nikaalna. Ye asli evidence hai. **Isko lead karo, slide pe pehle likho.**

**2. Confidence + reasons, arbitrary score nahi** — thesis se perfectly match.

**3. Career goal ko anchor banana** — bahut clever. Isi ne internship matching aasan kar diya (Counter 2 dekho).

**4. Honest phasing** — team formation ko openly "mockup" bolna. Ye maturity hai. Koi tumse jhooth bulwane ki koshish kare toh mat maanna.

---

# PART 3 — EXTRA SUGGESTIONS

Ye counters nahi hain. Ye wo cheezein hain jo plan mein nahi hain aur jo isko clearly behtar bana sakti hain.

---

### 💡 1. Evidence freshness — plan mein bilkul nahi hai

Abhi 2022 ki skill aur 2026 ki skill ek jaisi treat hoti hai. Ye original brief §16 mein tha aur ab gayab hai.

```python
HALF_LIFE_MONTHS = 18
DECAY_FLOOR      = 0.50   # ← ye fairness decision hai

def recency_factor(months_since):
    raw = math.exp(-math.log(2) * months_since / HALF_LIFE_MONTHS)
    return max(DECAY_FLOOR, raw)
```

**Floor ko defend karna:** floor ke bina, jo banda 4 saal pehle seekha aur usko use karne ka mauka nahi mila, wo zero ki taraf gir jaata hai. Wahi opportunity bias hai jiske tum khilaaf ho. **Floor ka matlab: purana evidence weak evidence hai, skill ka na hona nahi.**

Passport pe dikhao: *"React — Strong evidence · last demonstrated 2 months ago"*

*Effort: 2 ghante · Impact: high — passport "zinda" lagta hai, static resume nahi*

---

### 💡 2. "Insufficient evidence" ek alag state hona chahiye — "low confidence" nahi

Abhi plan mein sirf confidence levels hain. Par **"evidence kam hai"** aur **"skill kam hai"** do bilkul alag cheezein hain.

```python
if total_evidence_items < 3 or evidenced_requirements < 0.4 * total_requirements:
    return "INSUFFICIENT_EVIDENCE_TO_RANK"   # ← list ke neeche NAHI
```

Aur UI mein separate bucket: *"Insufficient evidence — manual review recommended"*, **list ke bottom pe nahi.**

⚠️ **Par ek honest warning:** agar ye bucket recruiter view mein chhupa hua rahega toh koi use kabhi nahi kholega — aur tumne bas rejection ko achha naam de diya. **Usko barabar prominence do**, ya gap-task automatically trigger karo. Warna ye fairness theatre hai.

*Effort: 3 ghante · Impact: ye §11 ke principle ko UI copy se control flow bana deta hai*

---

### 💡 3. Extraction accuracy naapo — koi team ye nahi karti

50 documents haath se label karo. Precision, recall, aur unmapped rate report karo.

> *"Humari skill extraction 50 hand-labelled resumes pe 0.86 precision, 0.79 recall deti hai. Sample chhota hai — hum ye bhi bata rahe hain."*

**Koi doosri team apna accuracy number nahi bataayegi.** Ek measured number — chahe modest ho — engineering maturity ka sabse strong signal hai.

*Effort: aadha din · Impact: credibility ke hisaab se sabse zyada return*

---

### 💡 4. "Recruiter ko main kaisa dikhta hoon" — preview screen

Plan 100% student-side hai. Poora recruiter portal banana mat — par ek **preview** banao jisme student dekhe ki uska scoped passport kaisa dikhta hai.

Teen fayde:
- Doosra app nahi banana padta
- Consent scoping visually demo ho jaati hai
- Matching ka output dikh jaata hai

*Effort: 3-4 ghante · Impact: demo mein bahut achha lagta hai*

---

### 💡 5. Unmapped skills chhupao mat — dikhao

Jab extraction koi aisi skill nikaale jo taxonomy mein nahi hai — usko silently drop mat karo.

```
Detected but not in our taxonomy:
  "Blockchain"  "Unity"  "Figma prototyping"
  [Ye mera skill hai — add karo]
```

Ye honesty dikhata hai (hum sab kuch nahi jaante) aur user ko control deta hai. Aur judge ko dikhta hai ki tumne edge case socha hai.

*Effort: 2 ghante*

---

### 💡 6. "Ye skill detect kyun nahi hui" — ulta explanation

Student sochta hai usse React aata hai, system "low confidence" bol raha hai. Wo bharosa tod deta hai — jab tak tum bata na do **kyun**.

```
React — Low confidence
├─ ✗ Kisi repo ke dependencies mein React nahi mila
├─ ✗ Certificate nahi
├─ ✓ Resume mein likha hai
└─ Ise theek karne ke liye: React project connect karo ya certificate upload karo
```

Explainability sirf matches ke liye nahi honi chahiye. **Non-matches ke liye bhi.** Ye PS ki spirit hai aur koi nahi karta.

*Effort: 3 ghante*

---

### 💡 7. Edge cases — abhi plan sirf happy path hai

| Case | Kya hoga? |
|---|---|
| Student ke paas GitHub hi nahi | Passport ban sakta hai? Ya app toot jaayegi? |
| GitHub pe 200 repos | Rate limit? Kitna time? |
| Sab repos private | Kya dikhega? |
| Resume scanned image hai | OCR nahi hai — saaf error do |
| Resume kisi aur language mein | Scope se bahar — bol do |

Judge stage pe apna GitHub de sakta hai. **Failure path rehearse karo.**

*Effort: aadha din · Impact: demo ko marne se bachata hai*

---

### 💡 8. GitHub responses cache karo — day 1 se

```sql
github_cache (
  handle, endpoint, response jsonb, fetched_at
)
```

Unauthenticated 60 req/hour, token ke saath 5,000. Demo profiles pre-warm karo. **Rate limit hackathon demo marne ka #1 kaaran hai.**

*Effort: 2 ghante · Impact: bahut zyada, effort ke hisaab se*

---

### 💡 9. Demo data pehle banao, Day 9 pe nahi

Fairness Toggle ke liye do contrasting profiles chahiye. Aur wo **realistic** hone chahiye, warna judge bolega "aapne data hi apne point ke liye banaya."

- 5-6 profiles banao, 2 nahi — taaki toggle ek cherry-picked pair na lage
- Slide pe likho: *"Illustrative example on synthetic profiles"*
- Ye **Day 2** ka kaam hai, Day 9 ka nahi

---

### 💡 10. Career goal "pata nahi" wala option

Abhi onboarding zabardasti career goal maangta hai. First-year student ko nahi pata hoga.

Ek option do: *"Abhi pata nahi — mera passport banao, roles baad mein dikhao"*. Bina goal ke bhi passport ban sakta hai; matching baad mein.

*Effort: 1 ghanta · Impact: chhota, par acceptance badhata hai*

---

# PART 4 — REVISED PHASE 1

| # | Kya | Note | Effort |
|---|---|---|---|
| 1 | Onboarding | **gender/country nahi** · "pata nahi" option | S |
| 2 | GitHub ingestion + cache | framework detection ✅ · stars `display_only` | M |
| 3 | Resume + certificate extraction | unmapped bucket dikhao | M |
| 4 | Evidence Engine | corroboration + **signature verification alag tiers** | L |
| 5 | Recency decay | floor 0.5 ke saath | S |
| 6 | Skill Passport | confidence + reasons + freshness | M |
| 7 | **Role Requirement Matching** | **8-10 seeded internships** ← missing piece | L |
| 8 | Gap + explanation + ulta explanation | | M |
| 9 | Consent scopes + revoke + delete | RLS se | M |
| 10 | "What we exclude" panel | | S |
| 11 | Recruiter preview | | S |
| 12 | Extraction accuracy report | 50 labelled docs | M |
| 13 | Team formation | **mockup — aur mockup bolna** | S |
| 14 | Roadmap | match ke neeche panel | S |
| 15 | QR | optional | S |

**Time kam pade toh cut order:** QR → Roadmap → Recruiter preview → Accuracy report
**Kabhi cut mat karo:** #4 verification · #7 matching · #9 consent

---

# PART 5 — Friend ko kaise bolo

Idea reject mat karo. **Upgrade karke wapas do.** Usne achha kaam kiya hai jo PS ko poora cover nahi karta — ye kharaab kaam se bilkul alag baat hai.

> "Bhai plan solid hai. Framework detection wala idea sabse achha hai poore document mein — wo actually asli evidence hai, na ki language percentage.
>
> Teen cheezein PS mein likhi hain jo plan mein nahi hain — internship matching, actual verification, aur fairness. Aur gender wala field humari apni slide ko jhootha bana raha hai, wo pehle hatana padega.
>
> Achhi khabar ye hai ki tera career-goal wala feature **already matching hai** — bas naam badalna hai aur 8-10 internships seed karni hain. Ek din ka kaam. Verification ke liye ek Open Badge signature check kaafi hai, 4 ghante. Roadmap rahega, bas match ke neeche panel ban jaayega.
>
> Baaki jo tune socha hai wo mostly theek hai — bas PS ke teen requirements ke saath line-by-line match karke dekh lete hain."

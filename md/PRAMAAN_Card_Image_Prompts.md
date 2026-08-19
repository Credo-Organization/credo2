# PRAMAAN Card — Image Generation Prompts

---

## 0. Two design decisions before you generate anything

### ⚠️ Decision 1 — Codolio's card is a *stats* card. Yours must not be.

Look at what Codolio shows: **Questions Solved 1010 · Active Days 348.** That is **volume scoring** — exactly what your Fairness Toggle on Slide 2 argues against.

If your card shows *"47 certificates · 23 repos · 1,200 commits"*, you have contradicted your own thesis on the most shareable artifact you own. A judge who saw slide 2 and then sees a count-based card will notice.

**Show evidence status, not counts:**

| ❌ Don't show | ✅ Show instead |
|---|---|
| 23 repositories | **3 Issuer-verified** |
| 1,200 commits | **7 Authorship-linked** |
| 47 certificates | **2 Task-demonstrated** |
| Streak / active days | **Last updated: 2 days ago** |

Same visual weight, opposite message. This is the single most important thing on this page.

### ⚠️ Decision 2 — think hard about the photo

Codolio has a face because it's a social flex card. Yours is a **credential shown to recruiters**. A photo reintroduces appearance, gender, and ethnicity — precisely the attributes your architecture goes to lengths to exclude from the matching path.

Recommendation: **initials-in-a-circle by default, photo opt-in.** If a judge asks why, *"we exclude protected attributes from ranking, so we don't put them on the card by default"* is a very good answer, and no other team will have thought about it.

The prompts below use initials. Swap if you disagree.

---

## 1. PRIMARY PROMPT — full card with text

> ⚠️ Image models garble text. Keep on-card strings short, then **zoom to 400% and read every character**. You've already lost characters twice in this deck. If any string comes out wrong, use Prompt B below instead.

```
A premium digital credential card, portrait orientation, 3:4.75 aspect ratio 
(vertical ID-card proportions), rendered as a photorealistic product mockup 
floating at a slight 8-degree tilt with a soft drop shadow on a clean dark 
charcoal background.

CARD SURFACE: deep indigo-to-midnight-navy gradient (#1E1B4B flowing to 
#0F172A), with a very subtle embossed circuit-trace pattern at 8% opacity 
across the lower half. Matte finish with a thin 1px light-emerald hairline 
border and a soft inner glow along the top edge. Slight glass-like 
reflection sweeping diagonally across the upper third.

LAYOUT, top to bottom:

TOP BAR — the word "PRAMAAN" in bold clean uppercase sans-serif, white, 
left-aligned, letter-spaced. Directly beneath it the words "SKILL PASSPORT" 
in smaller light-emerald uppercase letters. In the top-right corner, a small 
minimalist verification seal icon: a shield outline containing a checkmark, 
rendered in emerald green with a soft glow.

UPPER-MIDDLE — a circular avatar, 22% of the card width, centred, containing 
the initials "AK" in white on a soft indigo-violet gradient fill, ringed by a 
thin emerald circle. A tiny emerald verified-badge dot sits at the lower-right 
of the circle.

BELOW AVATAR — a name in white semibold sans-serif, centred. Under it, a small 
pill-shaped chip with a muted slate fill containing a handle in light grey.

EVIDENCE PANEL — three side-by-side rounded rectangles with dark translucent 
slate fill and thin borders. Each contains a large number in white bold above 
a small uppercase caption in light emerald. Left panel: "3" above 
"ISSUER-VERIFIED". Centre panel: "7" above "AUTHORSHIP-LINKED". Right panel: 
"2" above "TASK-DEMONSTRATED".

EVIDENCE TIER STRIP — a thin horizontal bar below the panels, divided into six 
small connected segments, colour-ramping left to right from pale slate-blue 
through soft teal to strong emerald green, suggesting increasing strength. No 
text inside the segments.

SKILL CHIPS — two rows of small rounded pill-shaped tags with dark translucent 
fill and thin emerald borders, containing short text: "PYTHON", "REACT", 
"FASTAPI", "SQL", "DOCKER".

BOTTOM SECTION — on the left, a crisp white QR code on a small dark rounded 
square tile with a thin emerald border. To the right of the QR, two short 
lines of small light-grey text: "SCAN TO VERIFY" above "EXPIRES IN 7 DAYS".

BOTTOM EDGE — a thin emerald-to-violet gradient accent line running the full 
width of the card.

STYLE: modern fintech credential aesthetic, high-end SaaS product design, 
crisp vector-clean icons, generous negative space, strong contrast, subtle 
depth. Studio lighting from upper left. Sharp focus, 4K quality, professional 
UI design mockup.

AVOID: credit-card chip graphics, contactless payment waves, stock-photo 
people, cartoon illustrations, busy backgrounds, lens flare, neon cyberpunk 
styling, gold or luxury-card styling, more text than specified, any counts of 
repositories or commits or certificates, progress bars, percentage scores.
```

---

## 2. PROMPT B — shell only, no text *(recommended)*

Generate the card **without any text**, then overlay real text in Figma, Canva, or PowerPoint. You get a beautiful shell with zero character errors, fully editable.

```
A premium blank digital credential card template, portrait orientation, 
3:4.75 vertical ID-card proportions, photorealistic product mockup floating at 
a slight 8-degree tilt with soft drop shadow on a clean dark charcoal 
background.

Deep indigo-to-midnight-navy gradient surface (#1E1B4B to #0F172A) with a 
subtle embossed circuit-trace pattern at 8% opacity across the lower half. 
Matte finish, thin 1px light-emerald hairline border, soft inner glow along 
the top edge, faint glass reflection sweeping diagonally across the upper third.

Composition uses EMPTY PLACEHOLDER SHAPES ONLY, no lettering anywhere:
- top-left: two blank horizontal bars suggesting a logo lockup
- top-right: a small emerald shield-with-checkmark seal icon
- upper-middle: an empty circular avatar frame ringed in emerald, with a small 
  emerald dot at its lower right
- below it: two centred blank rounded bars of decreasing width
- middle: three equal side-by-side rounded rectangles with dark translucent 
  slate fill and thin borders, each empty inside
- below them: a thin horizontal strip divided into six connected segments, 
  colour-ramping left to right from pale slate-blue through teal to strong 
  emerald
- lower area: two rows of small empty pill-shaped chips with emerald borders
- bottom-left: a crisp white QR code on a dark rounded tile with emerald border
- bottom-right of the QR: two short blank grey bars
- bottom edge: a thin emerald-to-violet gradient accent line, full width

STYLE: modern fintech credential design, high-end SaaS aesthetic, clean vector 
geometry, generous negative space, studio lighting from upper left, sharp 
focus, 4K, professional UI mockup.

AVOID: any text, any letters, any numbers, credit-card chips, contactless 
waves, faces, cartoon style, neon cyberpunk, gold luxury styling, busy 
backgrounds.
```

---

## 3. PROMPT C — the revocation demo (two cards side by side)

This is a slide asset, not a product shot. It shows your consent model working — the thing that separates your card from a digital business card.

```
Two identical premium digital credential cards shown side by side on a clean 
dark charcoal background, portrait orientation, vertical ID-card proportions, 
photorealistic product mockups with soft drop shadows, both facing forward.

LEFT CARD: deep indigo-to-navy gradient with emerald accents. A crisp white QR 
code in the lower section on a dark tile with emerald border. Above the QR, a 
small emerald pill-shaped badge containing the word "ACTIVE". The card looks 
bright and fully lit.

RIGHT CARD: identical design and layout but desaturated to muted grey-slate 
tones. The QR code area is dimmed and overlaid with a subtle diagonal 
cross-hatch pattern. The small pill-shaped badge above it is grey and contains 
the word "REVOKED". The card looks dimmed and inactive.

Between the two cards, a single clean white curved arrow points from left to 
right, with a small circular icon at its midpoint showing a simple toggle 
switch in the off position.

STYLE: modern fintech product design, high contrast, clean vector icons, 
generous negative space, studio lighting from upper left, sharp focus, 4K, 
professional UI mockup.

AVOID: faces, cartoon style, extra text beyond the two badge words, neon 
styling, busy backgrounds, credit-card chips.
```

---

## 4. Quick variants

Append one line to any prompt above:

| Want | Add |
|---|---|
| Landscape credit-card shape | `Change to landscape orientation, 1.586:1 credit-card proportions, rearranged into a two-column layout.` |
| Flat design instead of 3D | `Render flat and straight-on, no tilt, no shadow, no reflection — clean flat UI design.` |
| Light theme | `Invert to a light theme: off-white card surface, deep indigo text, emerald accents, soft grey shadows.` |
| Phone mockup | `Show the card displayed on a modern smartphone screen held at a slight angle.` |
| Print/physical | `Render as a physical matte-laminate plastic card resting on a dark textured surface, shallow depth of field.` |

---

## 5. What the QR must actually encode

The image is cosmetic; the mechanic is what a judge will question.

**Not** a permanent public profile URL. If it were, anyone who photographs the card has permanent unrevocable access to a student's profile — which destroys the consent model you built.

**Encode a scoped, expiring share token:**

```
https://pramaan.app/v/<opaque-token>
```

- Token maps to a **share instance**: grantee, scope, expiry, created-at
- Scope is chosen by the student — skills only / skills + evidence / full passport
- Every scan is **logged and visible to the student**
- Student can revoke instantly; the QR dies
- Default TTL: 7 days

Then your card stops being a business card and becomes a demonstration of consent. And you get a 15-second live demo: **scan → scoped view → tap Revoke → scan again → access denied.**

---

## 6. Honest notes

- **Text in generated images will break.** You've already lost characters twice (`Corroborated linked`, `ARCHJİTECTURE`). Prompt B exists for this reason and it's what I'd use.
- **Aspect ratio may not be respected.** Most image tools snap to fixed ratios. Generate, then crop — or state the ratio again in a follow-up message.
- **You will need 3–6 attempts.** Regenerate rather than trying to patch a bad output; these models don't reliably edit.
- **Colours are anchored to your deck** (indigo/navy base, emerald for verified) so the card doesn't look like it came from a different project. If you change the deck palette, change these hexes too.
- **The card is ~10% of the pitch.** It's the delivery surface, not the innovation. Slide 5 (Impact), not Slide 2.

# Knit App — Project Plan

A simple, friendly knitting app for a beginner knitter in Salé, Morocco. For now she knits **for family and close friends**; selling may come later, once she is confident.

- **Languages:** French by default, Arabic available (full right-to-left layout), switchable with one tap
- **Device:** her phone first (works on a computer too)
- **Cost:** free. Hosted on GitHub Pages, no app store, no account, no ads
- **Works offline:** once opened, it works without internet

---

## 1. Who it's for

| Fact | What it means for the app |
|---|---|
| Beginner, practising for about 2 months | Plain words, a stitch glossary, guided steps, no knitting jargon left unexplained |
| Already owns tools | Inventory of what she has, so she knows what fits each project |
| Knits for family and friends for now | Each project records *who it's for*; status "Offert" (given). Selling tools are kept for later |
| Lives in Salé, Morocco | French + Arabic, sharing to WhatsApp |
| Not a tech user | Big buttons, icons with every label, at most 3 taps to anything, nothing to install from a store |

---

## 2. Technical choices

**Progressive Web App (PWA)** built with plain HTML, CSS and JavaScript.

- **Why a PWA:** she opens a link once, taps "Add to home screen", and it behaves like a normal app with its own icon. No Play Store, no build tools, easy to update from GitHub.
- **Hosting:** GitHub Pages from this repository (free, HTTPS).
- **Storage:** everything stays on her phone (IndexedDB for projects and photos). No server, no login, nothing leaves the phone.
- **Backup:** "Export my data" button that produces a file she can send to herself on WhatsApp or save to Google Drive, plus "Import" to restore it on a new phone. *(Important: without this, a lost phone means lost data.)*
- **Translations:** one file per language (`lang/fr.js`, `lang/ar.js`); the Arabic version flips the layout with `dir="rtl"`.
- **Fonts:** the phone's own fonts (they handle French and Arabic well and need no download). Large default text size.

### Folder structure

```
Knitapp/
├── index.html
├── manifest.json        # app name, icon, colors (for "Add to home screen")
├── sw.js                # service worker (offline mode)
├── css/style.css
├── js/
│   ├── app.js           # navigation between screens
│   ├── db.js            # saving data on the phone
│   ├── i18n.js          # French / Arabic switching
│   ├── util.js
│   └── views/           # one file per screen (projects, counter, settings…)
├── lang/
│   ├── fr.js
│   └── ar.js
├── data/stitches.json   # stitch glossary content
└── icons/
```

---

## 3. Features, in build order

### Phase 1: Everyday knitting (the first version she uses)

1. **My projects (Mes projets / مشاريعي)**
   - Create a project: name, who it's for, yarn used, needle size, start date, notes, photos
   - Status: idea → in progress → finished → given (offert)
   - Add progress photos
2. **Row counter (Compteur de rangs / عداد الصفوف)**
   - One giant "+1" button, plus "−1" and reset
   - One counter per project, saved automatically
   - Optional second counter (for repeats, for example "every 6 rows, decrease")
   - Screen stays on while counting; small vibration on each tap
3. **Language switch** FR ⇄ AR on every screen
4. **Install and offline**: home-screen icon, works without internet

### Phase 2: Learning ✅ done (v1.1.0)

5. **One technique per screen (Les leçons / الدروس)**: 12 lessons, big numbered steps, a slow looping video and a "Revoir" (show me again) button. The pattern abbreviation (for example *m. end.*) stays hidden until she taps "Je sais le faire". Each lesson plays a French YouTube beginner video in the app (official YouTube player, needs internet). Own videos in `videos/` replace them and work offline (see `videos/README.md`).
6. **"Est-ce juste ?" photo check**: she photographs her knitting, then answers one question at a time, comparing with drawings of a correct stitch and the mistake: dropped stitch, twisted stitch, accidental hole, wrong stitch count, rolling edges (normal). Each "yes" shows how to fix it. No AI: free and offline.
7. **Voice row counter**: "Compter à la voix" on the counter screen. She says "suivant" (or "زيد" / "التالي") to add a row and "annuler" (or "رجع") to undo; the phone says the new number out loud. Needs internet and Chrome.
8. **Three starter projects**: a dishcloth, then a scarf, then a simple hat. Each unlocks when the previous project is marked "Terminé".
9. **Family mode**: a family member's name and WhatsApp number in Settings. When a project is finished, a "Bravo !" card offers to send the photo on WhatsApp. A "Montrer à …" button shares progress any time.

### Later, if she wants them

- Tools and yarn list, linked to projects
- Calculators: stitches to cast on from a swatch, yarn quantity, needle size conversion
- More projects after the hat (baby items, a cardigan)

### Phase 3 (later, only when she wants to sell): Selling

9. **Price calculator (Calcul du prix / حساب الثمن)**
   - Yarn cost + other materials + (hours × her hourly rate) + margin = suggested price in DH
   - A timer on each project to record real hours spent, so prices are based on facts, not guesses
10. **Orders and clients (Commandes / الطلبيات)**
    - Client name, phone, what was ordered, size, colour, price, **deposit received (avance)**, delivery date
    - "Contact on WhatsApp" button that opens a chat with the client
    - List of upcoming deadlines on the home screen
11. **Portfolio (Mes créations / إبداعاتي)**
    - Gallery of finished pieces with photo, price and description
    - Share button to send to WhatsApp, Instagram or Facebook
12. **Simple money tracking**
    - Income per month (sold pieces) minus expenses (yarn, tools) = profit
    - Shows which items are the most profitable

### Later ideas (only if useful)

- Sync between phone and computer (would need an online service, adds complexity)
- Pattern library with her own written patterns
- Printable price list or catalogue as PDF

---

## 4. Milestones

| Step | Content | Result |
|---|---|---|
| 1 | Skeleton: navigation, FR/AR switch, design, install on phone | She can open and install the app ✅ done |
| 2 | Projects + row counter + backup/export | **First usable version, she tests it** ✅ done (v1.0.0) |
| 3 | Lessons with videos, photo check, voice counter, 3 starter projects, family mode | Helps her learn ✅ done (v1.1.0) |
| 4 | Price calculator, orders, portfolio, money tracking | Ready for selling |
| 5 | Polish from her feedback | Adjust words, button sizes, what she actually uses |

Each step is shown to her before starting the next one. Her feedback matters more than the plan.

---

## 5. Design rules

- Large text (at least 18px), large buttons (at least 48px tall)
- Every button has an icon **and** a word
- Warm, calm colours (wool-like tones: cream, terracotta, sage green), good contrast
- Bottom navigation: **Projets · Compteur · Apprendre · Réglages**
- Confirmation before deleting anything
- Every screen checked in Arabic (right-to-left) as well as French

---

## 6. Content to prepare with her

- ~~Default language~~ → French by default, Arabic available
- Check the YouTube videos with her; swap any she finds hard to follow (see `videos/README.md`)
- Later, if she decides to sell: her hourly rate target in DH and usual yarn prices
- Her own photos of finished pieces for the portfolio

---

## 7. For later: tips if she decides to sell

- **Selling channels** commonly used in Morocco: Instagram, WhatsApp Business (catalogue feature), Facebook Marketplace and groups, Avito, local craft fairs and bazaars
- **Legal status:** Morocco's *auto-entrepreneur* status is designed for small independent activity like this; worth checking the current conditions on the official auto-entrepreneur portal or at a Barid Al-Maghrib office before selling regularly
- **Pricing:** always ask for a deposit (avance) on custom orders, since yarn is bought in advance

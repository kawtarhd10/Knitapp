# Tests

Deux vérifications, à lancer depuis le dossier du projet (il faut Node.js et Playwright).

## 1. Le contenu tricot : `content-check.mjs`

```bash
node tests/content-check.mjs
```

- Simule le tricot maille par maille pour vérifier les modèles des 3 projets :
  les côtes de l'écharpe et du bonnet forment de vraies colonnes, les diminutions du bonnet
  tombent juste (90 → 80 → … → 10), les nombres écrits dans les textes français et arabe sont les bons.
- Vérifie que chaque leçon, chaque erreur et chaque texte existe dans les deux langues.
- Vérifie que chaque vidéo YouTube existe toujours et peut être lue dans l'application
  (ajouter `--offline` pour sauter cette partie).

## 2. Un vrai parcours sur le site en ligne : `live-journey.mjs`

```bash
node tests/live-journey.mjs
```

Joue les premières semaines d'une débutante sur https://kawtarhd10.github.io/Knitapp/ :
5 leçons avec leurs vidéos, la lavette (65 rangs comptés au doigt et à la voix, avec une erreur corrigée),
la photo envoyée sur WhatsApp, l'écharpe qui se débloque, « Est-ce juste ? », l'arabe,
une sauvegarde restaurée sur un deuxième téléphone, et l'application sans internet.

Pour tester une version locale : `python3 -m http.server 8000`, puis
`node tests/live-journey.mjs http://localhost:8000/`.

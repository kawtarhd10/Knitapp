# 🧶 Mon Tricot / حياكتي

Application simple pour suivre ses tricots, en **français** (par défaut) et en **arabe**.
Fonctionne sur téléphone, sans internet, sans compte, gratuitement.

## Ce que fait la version 1

- **Mes projets** : nom, pour qui, laine, taille des aiguilles, date de début, notes, photos.
  Étapes : Idée → En cours → Terminé → Offert.
- **Compteur de rangs** : un grand bouton « +1 », un compteur par projet, enregistré automatiquement.
  - Motif qui se répète (ex. tous les 6 rangs) : le téléphone vibre à la fin du motif.
  - Objectif de rangs avec une barre d'avancement.
  - L'écran reste allumé pendant le comptage.
- **Français ⇄ العربية** : bouton en haut de l'écran (l'arabe s'affiche de droite à gauche).
- **Sauvegarde** : Réglages → « Sauvegarder mes données » crée un fichier à envoyer sur WhatsApp
  ou Google Drive. « Restaurer une sauvegarde » le remet sur un nouveau téléphone.

> Les projets sont gardés **uniquement sur le téléphone**. Pensez à faire une sauvegarde de temps en temps.
> L'application le rappelle tous les 30 jours.

## Installer sur le téléphone

1. Ouvrir le lien de l'application dans **Chrome**.
2. Appuyer sur **⋮** (en haut à droite) puis **« Ajouter à l'écran d'accueil »**.
3. L'icône 🧶 apparaît comme une application normale.

## Mettre l'application en ligne (GitHub Pages)

1. Sur GitHub : **Settings → Pages**.
2. *Source* : **Deploy from a branch**, choisir la branche et le dossier **/ (root)**, puis **Save**.
3. Après une minute, le lien apparaît : `https://<utilisateur>.github.io/Knitapp/`.

GitHub Pages est gratuit pour un dépôt **public**. (Pour un dépôt privé, il faut un compte GitHub payant.)

## Pour les développeurs

HTML, CSS et JavaScript simples, sans outil de build.

```bash
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000.

- `lang/fr.js`, `lang/ar.js` : tous les textes de l'application
- `js/views/` : un fichier par écran
- `js/db.js` : stockage sur le téléphone (IndexedDB)
- `sw.js` : mode hors-ligne. **Changer `VERSION` à chaque modification** pour que les téléphones
  reçoivent la nouvelle version.

Voir [PLAN.md](PLAN.md) pour les prochaines étapes.

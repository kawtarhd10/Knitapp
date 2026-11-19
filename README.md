# 🧶 Mon Tricot / حياكتي

Application simple pour suivre ses tricots, en **français** (par défaut) et en **arabe**.
Fonctionne sur téléphone, sans internet, sans compte, gratuitement.

## Ce que fait l'application

- **Mes projets** : nom, pour qui, laine, taille des aiguilles, date de début, notes, photos.
  Étapes : Idée → En cours → Terminé → Offert.
- **Compteur de rangs** : un grand bouton « +1 », un compteur par projet, enregistré automatiquement.
  - Motif qui se répète (ex. tous les 6 rangs) : le téléphone vibre à la fin du motif.
  - Objectif de rangs avec une barre d'avancement.
  - L'écran reste allumé pendant le comptage.
- **Compter à la voix** : dire « suivant » (ou « زيد ») pour ajouter un rang, « annuler » (ou « رجع ») pour corriger. Fonctionne avec Chrome et internet.
- **Apprendre** :
  - **Les leçons** : une technique par écran, une vidéo YouTube au ralenti qui tourne en boucle (il faut internet), le bouton « Revoir ».
    Le mot utilisé dans les modèles (ex. « m. end. ») n'apparaît qu'une fois la technique apprise.
  - **Mes 3 premiers projets** : une lavette, puis une écharpe, puis un bonnet. Chacun se débloque quand le précédent est « Terminé ».
  - **Est-ce juste ?** : prendre son tricot en photo, puis le comparer avec des dessins des erreurs fréquentes, avec la façon de les réparer.
- **Famille** : dans Réglages, le prénom et le numéro WhatsApp d'un proche. Quand un projet est terminé,
  l'application propose de lui envoyer la photo.
- **Français ⇄ العربية** : bouton en haut de l'écran (l'arabe s'affiche de droite à gauche).
- **Sauvegarde** : Réglages → « Sauvegarder mes données » crée un fichier à envoyer sur WhatsApp
  ou Google Drive. « Restaurer une sauvegarde » le remet sur un nouveau téléphone.

> Les projets sont gardés **uniquement sur le téléphone**. Pensez à faire une sauvegarde de temps en temps.
> L'application le rappelle tous les 30 jours.

## Ajouter les vidéos des leçons

Les leçons utilisent des vidéos YouTube en français. On peut les remplacer par ses propres vidéos :
voir [videos/README.md](videos/README.md).

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
- `js/data/` : contenu des leçons, des 3 projets et des erreurs fréquentes (français et arabe)
- `js/views/` : un fichier par écran
- `js/db.js` : stockage sur le téléphone (IndexedDB)
- `sw.js` : mode hors-ligne. **Changer `VERSION` à chaque modification** pour que les téléphones
  reçoivent la nouvelle version.

Voir [PLAN.md](PLAN.md) pour les prochaines étapes.

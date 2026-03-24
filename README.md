# SoundSwipe - Application de Découverte Musicale

SoundSwipe est une application web de découverte musicale inspirée de Tinder et TikTok. Elle permet aux utilisateurs de découvrir de nouvelles musiques de manière interactive en swipant ou en utilisant des boutons, avec des recommandations basées sur des genres musicaux et des artistes populaires via l'API Deezer.

## Fonctionnalités Principales
- **Découverte rapide** : Écoutez des extraits de musique aléatoirement ou filtrés par genre/artiste.
- **Interactions simples** : Swipe ou boutons pour liker, disliker ou passer.
- **Favoris** : Sauvegardez vos musiques préférées localement.
- **Recherche** : Trouvez des musiques spécifiques via la barre de recherche.
- **Responsive** : Fonctionne sur PC et mobile.

## Installation et Lancement
Cette application est une page web statique utilisant des modules ES6. Pour l'installer et la lancer :

1. **Clonez ou téléchargez le projet** :
   ```
   git clone https://github.com/votre-repo/TP_API_Petersct_Tsigrisn.git
   ```

2. **Lancez un serveur local** (requis pour les modules ES6 et les appels API) :
   - Utilisez un serveur HTTP simple comme `http-server` (installez via npm si nécessaire) :
     ```
     npx http-server .
     ```
   - Ou avec Python :
     ```
     python -m http.server 8000
     ```
   - Ou avec Node.js et `live-server` :
     ```
     npx live-server
     ```

3. **Ouvrez dans un navigateur** :
   - Allez à `http://localhost:8000` (ou le port de votre serveur).
   - L'application se charge automatiquement.

**Note** : L'application utilise un proxy CORS pour accéder à l'API Deezer, donc elle fonctionne directement sans configuration supplémentaire.

## Rôles des Fichiers
Voici une description du rôle de chaque fichier dans le projet :

### Fichiers Racine
- `index.html` : Page principale HTML, définit la structure de l'interface utilisateur (Vue).
- `README.md` : Ce fichier, documentation du projet.
- `favicon-js.ico` : Icône du site.

### Dossier `images/`
- `attente-ajax.gif` : Image de chargement pour les requêtes AJAX.
- `croix.svg` : Icône de fermeture.
- `etoile-pleine.svg` : Icône d'étoile pleine (pour les likes).
- `etoile-vide.svg` : Icône d'étoile vide (pour les non-likes).
- `loupe.svg` : Icône de recherche.

### Dossier `static/css/`
- `styles.css` : Feuille de styles CSS pour l'apparence et les animations de l'application.

### Dossier `static/js/`
- `app.js` : Contrôleur principal, gère les événements utilisateur (swipe, clics), les animations et la coordination entre Vue et Modèle.
- `likes.js` : Modèle pour la gestion des likes et dislikes, utilise le stockage local.
- `main.js` : Contrôleur pour les appels API (genres, recherche, artistes tendances), mise à jour des playlists.
- `player.js` : Contrôleur pour le lecteur audio, gestion de l'état de lecture et mise à jour de l'interface.
- `storage.js` : Utilitaires pour la persistance des données (localStorage).

## Fonctionnement sur PC
Sur ordinateur, l'application utilise des boutons pour les interactions :
- **Bouton "Passer"** : Passe à la musique suivante.
- **Bouton "Like"** : Ajoute la musique aux favoris (étoile pleine/vide).
- **Barre de recherche** : Cliquez sur la loupe pour ouvrir la recherche, tapez un mot-clé et appuyez sur Entrée pour rechercher.
- **Genres** : Cliquez sur les boutons de genres en haut pour filtrer les musiques.
- **Favoris** : Ouvrez la barre latérale pour voir vos favoris groupés par artiste.
- La musique se lance automatiquement, et vous pouvez cliquer sur les cartes de favoris pour les rejouer.

## Fonctionnement sur Mobile
Sur mobile (smartphone/tablette), l'application est optimisée pour le swipe tactile :
- **Swipe vers le haut** : Passe à la musique suivante (skip).
- **Swipe vers la droite** : Like la musique (ajoute aux favoris, avec animation).
- **Swipe vers la gauche** : Dislike la musique (elle ne reviendra pas).
- **Recherche** : Touchez la loupe pour ouvrir la barre de recherche.
- **Genres et favoris** : Touchez les boutons ou la barre latérale.
- Les gestes sont détectés avec des seuils de distance et vitesse pour une expérience fluide.

## Technologies Utilisées
- **HTML/CSS/JavaScript** : Base de l'application.
- **API Deezer** : Source des données musicales (extraits, couvertures, artistes).
- **LocalStorage** : Stockage des likes/dislikes côté client.
- **ES6 Modules** : Modularité du code JavaScript.

## Remarques
- Les extraits musicaux sont limités à 30 secondes par l'API Deezer.
- Les données sont stockées localement (pas de compte utilisateur).
- Pour les développeurs : Le code suit une architecture MVC légère pour une séparation des préoccupations.

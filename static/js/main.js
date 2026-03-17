let playlistActuelle = [];
let indexMusiqueActuelle = 0;


function chargerGenres() {
    const urlDeezer = 'https://api.deezer.com/genre';
    const urlProxy = `https://corsproxy.io/?${encodeURIComponent(urlDeezer)}`;

    fetch(urlProxy)
        .then(response => response.json())
        .then(data => {
            if (data.data) {
                const conteneurGenres = document.getElementById('genre-list');
                conteneurGenres.innerHTML = '';


                const topGenres = data.data.slice(0, 10);

                topGenres.forEach((genre, index) => {
                    const btn = document.createElement('button');
                    btn.className = 'genre-pill';
                    if (index === 0) btn.classList.add('active');

                    btn.textContent = genre.name;
                    btn.dataset.id = genre.id;

                    btn.addEventListener('click', function() {
                        document.querySelectorAll('.genre-pill').forEach(b => b.classList.remove('active'));
                        this.classList.add('active');
                        chargerMusiqueParGenreId(genre.id);
                    });

                    conteneurGenres.appendChild(btn);
                });


                chargerMusiqueParGenreId(topGenres[0].id);
            }
        })
        .catch(err => console.error("Erreur chargement genres :", err));
}

// ==========================================
// 2. CHARGER LA MUSIQUE (PAR GENRE)
// ==========================================
function chargerMusiqueParGenreId(genreId) {
    const urlDeezer = `https://api.deezer.com/chart/${genreId}/tracks?limit=20`;
    const urlProxy = `https://corsproxy.io/?${encodeURIComponent(urlDeezer)}`;

    fetch(urlProxy)
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {
                playlistActuelle = data.data;
                // On commence à un endroit au hasard dans la liste
                indexMusiqueActuelle = Math.floor(Math.random() * playlistActuelle.length);
                mettreAJourLecteur(playlistActuelle[indexMusiqueActuelle]);
            }
        })
        .catch(err => console.error("Erreur API Tracks :", err));
}

// ==========================================
// 3. CHARGER LA MUSIQUE (RECHERCHE LIBRE)
// ==========================================
function rechercherMusiqueLibre(motCle) {
    const urlDeezer = `https://api.deezer.com/search?q=${motCle}&limit=20`;
    const urlProxy = `https://corsproxy.io/?${encodeURIComponent(urlDeezer)}`;

    fetch(urlProxy)
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {
                playlistActuelle = data.data;
                indexMusiqueActuelle = 0; // On commence par le 1er résultat de la recherche

                mettreAJourLecteur(playlistActuelle[indexMusiqueActuelle]);

                // On met à jour la barre du haut avec le mot clé et les artistes associés
                mettreAJourBarreRecherche(motCle, data.data);
            } else {
                alert(`Aucun résultat trouvé pour "${motCle}" 😢`);
            }
        })
        .catch(err => console.error("Erreur recherche :", err));
}

// ==========================================
// 4. METTRE À JOUR LA BARRE (APRÈS RECHERCHE)
// ==========================================
function mettreAJourBarreRecherche(motCle, musiquesTrouvees) {
    const conteneurGenres = document.getElementById('genre-list');
    conteneurGenres.innerHTML = '';

    // 1. Bouton "Retour à l'accueil"
    const btnTop = document.createElement('button');
    btnTop.className = 'genre-pill';
    btnTop.textContent = '🔙 Top';
    btnTop.addEventListener('click', function() {
        chargerGenres();
    });
    conteneurGenres.appendChild(btnTop);

    // 2. Bouton de la recherche actuelle
    const btnRecherche = document.createElement('button');
    btnRecherche.className = 'genre-pill active';
    btnRecherche.textContent = motCle.charAt(0).toUpperCase() + motCle.slice(1);
    conteneurGenres.appendChild(btnRecherche);

    // 3. Extraire les artistes associés (featurings) sans doublons
    let artistesAssocies = new Set();
    musiquesTrouvees.forEach(musique => {
        if (musique.artist.name.toLowerCase() !== motCle.toLowerCase()) {
            artistesAssocies.add(musique.artist.name);
        }
    });

    // 4. Créer les boutons pour les 3 premiers artistes associés
    let topArtistes = Array.from(artistesAssocies).slice(0, 3);
    topArtistes.forEach(artiste => {
        const btnArtiste = document.createElement('button');
        btnArtiste.className = 'genre-pill';
        btnArtiste.textContent = artiste;

        btnArtiste.addEventListener('click', function() {
            rechercherMusiqueLibre(artiste);
        });

        conteneurGenres.appendChild(btnArtiste);
    });
}

// ==========================================
// 5. METTRE À JOUR LE LECTEUR (ÉCRAN)
// ==========================================
function mettreAJourLecteur(musique) {
    if (!musique) return; // Sécurité

    document.getElementById('bg-cover').src = musique.album.cover_xl;
    document.getElementById('track-title').textContent = musique.title;
    document.getElementById('track-artist').textContent = musique.artist.name;

    const lecteur = document.getElementById('audio-player');
    lecteur.src = musique.preview;
    lecteur.play().catch(e => console.log("Lecture automatique bloquée par le navigateur", e));
}

// ==========================================
// 6. PASSER AU SON SUIVANT (CROIX OU SWIPE)
// ==========================================
function passerMusiqueSuivante() {
    if (playlistActuelle.length > 0) {
        indexMusiqueActuelle++;
        // Boucle infinie : si on arrive à la fin, on recommence au début de la liste
        if (indexMusiqueActuelle >= playlistActuelle.length) {
            indexMusiqueActuelle = 0;
        }
        mettreAJourLecteur(playlistActuelle[indexMusiqueActuelle]);
    }
}

// ==========================================
// 7. ÉVÉNEMENTS GLOBAUX (LOUPE, CROIX, SWIPE)
// ==========================================

// Clic sur la Loupe
const btnRecherche = document.getElementById('btn-search');
if (btnRecherche) {
    btnRecherche.addEventListener('click', function() {
        let motCle = prompt("Quel artiste ou titre cherches-tu ?");
        if (motCle && motCle.trim() !== "") {
            rechercherMusiqueLibre(motCle);
        }
    });
}

// Clic sur la Croix (Passer)
const btnPasser = document.getElementById('btn-pass');
if (btnPasser) {
    btnPasser.addEventListener('click', passerMusiqueSuivante);
}

// Gestion du Swipe vers le haut (Tactile)
let touchStartY = 0;
let touchEndY = 0;
const appContainer = document.querySelector('.tiktok-app');

if (appContainer) {
    appContainer.addEventListener('touchstart', function(event) {
        touchStartY = event.changedTouches[0].screenY;
    });

    appContainer.addEventListener('touchend', function(event) {
        touchEndY = event.changedTouches[0].screenY;
        // Si on a glissé vers le haut de plus de 50px
        if (touchStartY - touchEndY > 50) {
            passerMusiqueSuivante();
        }
    });
}

// ==========================================
// LANCEMENT DE L'APPLICATION
// ==========================================
chargerGenres();
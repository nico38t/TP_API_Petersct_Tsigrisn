let playlistActuelle = [];
let indexMusiqueActuelle = 0;
let musiqueActuelle = null;

/**
 * Définit la playlist actuelle
 * @param {Array} playlist
 */
export function setPlaylist(playlist) {
    playlistActuelle = playlist;
}

/**
 * Définit l'index de la musique en cours
 * @param {number} index
 */
export function setIndex(index) {
    indexMusiqueActuelle = index;
}

export function getMusiqueActuelle() {
    return musiqueActuelle;
}

/**
 * Met à jour l'interface du lecteur avec les données du morceau
 * @param {Object} musique
 */
export function mettreAJourLecteur(musique) {
    if (!musique) return;

    musiqueActuelle = musique;

    // Mise à jour de la pochette et des textes principaux
    document.getElementById('bg-cover').src = musique.album.cover_xl;
    document.getElementById('track-title').textContent = musique.title;
    document.getElementById('track-artist').textContent = musique.artist.name;

    // --- LOGIQUE POUR LES ARTISTES SOUS L'IMAGE (PC UNIQUEMENT) ---
    const pcArtistsContainer = document.getElementById('pc-artists-display');
    if (pcArtistsContainer) {
        pcArtistsContainer.innerHTML = ''; // On vide l'ancien affichage

        // Création de la bulle pour l'artiste principal
        const mainArtistCard = document.createElement('div');
        mainArtistCard.className = 'artist-mini-card';
        mainArtistCard.innerHTML = `
            <img src="${musique.artist.picture_medium || musique.album.cover_medium}" class="artist-mini-img">
            <span class="artist-mini-name">${musique.artist.name}</span>
        `;
        pcArtistsContainer.appendChild(mainArtistCard);

        // Ajout des contributeurs (featurings) si présents dans les données Deezer
        if (musique.contributors) {
            musique.contributors.forEach(contributor => {
                // On évite de doubler l'artiste principal s'il est aussi dans les contributeurs
                if (contributor.name !== musique.artist.name) {
                    const featCard = document.createElement('div');
                    featCard.className = 'artist-mini-card';
                    featCard.innerHTML = `
                        <img src="${contributor.picture_medium}" class="artist-mini-img">
                        <span class="artist-mini-name">${contributor.name}</span>
                    `;
                    pcArtistsContainer.appendChild(featCard);
                }
            });
        }
    }

    // Gestion de l'audio
    const lecteur = document.getElementById('audio-player');
    lecteur.src = musique.preview;
    lecteur.play().catch(e => console.log("Lecture bloquée", e));

    // notifier changement
    document.dispatchEvent(new Event('musiqueChangee'));
    lecteur.play().catch(e => console.log("Lecture bloquée par le navigateur", e));
}

/**
 * Passe au morceau suivant dans la playlist actuelle
 */
export function passerMusiqueSuivante() {
    if (playlistActuelle.length > 0) {
        indexMusiqueActuelle++;

        // Boucle infinie : on revient au début si on dépasse la fin
        if (indexMusiqueActuelle >= playlistActuelle.length) {
            indexMusiqueActuelle = 0;
        }

        mettreAJourLecteur(playlistActuelle[indexMusiqueActuelle]);
    }
}


export function jouerMusique(musique) {
    mettreAJourLecteur(musique);
}


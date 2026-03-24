// State global du player
let playlistActuelle = [];
let indexMusiqueActuelle = 0;
let musiqueActuelle = null;

export function setPlaylist(playlist) { playlistActuelle = playlist; }
export function setIndex(index) { indexMusiqueActuelle = index; }
export function getMusiqueActuelle() { return musiqueActuelle; }

// Injecte les data du son dans le DOM et lance l'audio
export function mettreAJourLecteur(musique) {
    if (!musique) return;
    musiqueActuelle = musique;

    document.getElementById('bg-cover').src = musique.album.cover_xl;
    document.getElementById('track-title').textContent = musique.title;
    document.getElementById('track-artist').textContent = musique.artist.name;

    // Rendu spécifique desktop pour les covers des feats/artistes
    const pcArtistsContainer = document.getElementById('pc-artists-display');
    if (pcArtistsContainer) {
        pcArtistsContainer.innerHTML = '';
        const mainArtistCard = document.createElement('div');
        mainArtistCard.className = 'artist-mini-card';
        mainArtistCard.innerHTML = `
            <img src="${musique.artist.picture_medium || musique.album.cover_medium}" class="artist-mini-img">
            <span class="artist-mini-name">${musique.artist.name}</span>
        `;
        pcArtistsContainer.appendChild(mainArtistCard);

        if (musique.contributors) {
            musique.contributors.forEach(contributor => {
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

    const lecteur = document.getElementById('audio-player');
    lecteur.src = musique.preview;

    // Auto-play avec catch si le nav bloque (standard)
    lecteur.play().catch(e => console.log("Lecture bloquée", e));
    document.dispatchEvent(new Event('musiqueChangee'));
}

// Next track avec boucle sur la playlist
export function passerMusiqueSuivante() {
    if (playlistActuelle.length > 0) {
        indexMusiqueActuelle++;
        if (indexMusiqueActuelle >= playlistActuelle.length) {
            indexMusiqueActuelle = 0;
        }
        mettreAJourLecteur(playlistActuelle[indexMusiqueActuelle]);
    }
}

export function jouerMusique(musique) {
    mettreAJourLecteur(musique);
}
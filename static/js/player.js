let playlistActuelle = [];
let indexMusiqueActuelle = 0;
let musiqueActuelle = null;

export function setPlaylist(playlist) {
    playlistActuelle = playlist;
}

export function setIndex(index) {
    indexMusiqueActuelle = index;
}

export function getMusiqueActuelle() {
    return musiqueActuelle;
}

export function mettreAJourLecteur(musique) {
    if (!musique) return;

    musiqueActuelle = musique;

    document.getElementById('bg-cover').src = musique.album.cover_xl;
    document.getElementById('track-title').textContent = musique.title;
    document.getElementById('track-artist').textContent = musique.artist.name;

    const lecteur = document.getElementById('audio-player');
    lecteur.src = musique.preview;
    lecteur.play().catch(e => console.log("Lecture bloquée", e));

    // notifier changement
    document.dispatchEvent(new Event('musiqueChangee'));
}

export function passerMusiqueSuivante() {
    if (playlistActuelle.length > 0) {
        indexMusiqueActuelle++;

        if (indexMusiqueActuelle >= playlistActuelle.length) {
            indexMusiqueActuelle = 0;
        }

        mettreAJourLecteur(playlistActuelle[indexMusiqueActuelle]);
    }
}
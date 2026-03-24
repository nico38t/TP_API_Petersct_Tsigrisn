import { saveToStorage, getFromStorage } from './storage.js';

// CRUD basique pour les likes et dislikes en local.
// On check systématiquement les doublons via l'id avant l'insert.

export function ajouterLike(musique) {
    let likes = getFromStorage('likes') || [];
    if (!likes.find(m => m.id === musique.id)) {
        likes.push(musique);
        saveToStorage('likes', likes);
    }
}

export function supprimerLike(id) {
    let likes = getFromStorage('likes') || [];
    likes = likes.filter(m => m.id !== id);
    saveToStorage('likes', likes);
}

export function estLike(id) {
    let likes = getFromStorage('likes') || [];
    return likes.some(m => m.id === id);
}

export function getLikes() {
    return getFromStorage('likes') || [];
}

export function ajouterDislike(musique) {
    let dislikes = getFromStorage('dislikes') || [];
    if (!dislikes.find(m => m.id === musique.id)) {
        dislikes.push(musique);
        saveToStorage('dislikes', dislikes);
    }
}

export function estDislike(id) {
    let dislikes = getFromStorage('dislikes') || [];
    return dislikes.some(m => m.id === id);
}

export function getDislikes() {
    return getFromStorage('dislikes') || [];
}
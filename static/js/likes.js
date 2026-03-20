import { saveToStorage, getFromStorage } from './storage.js';

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
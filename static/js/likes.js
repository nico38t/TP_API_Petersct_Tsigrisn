import { saveToStorage, getFromStorage } from './storage.js';

export function ajouterLike(musique) {
    let likes = getFromStorage('likes') || [];

    if (!likes.find(m => m.id === musique.id)) {
        likes.push(musique);
        saveToStorage('likes', likes);
    }
}

export function getLikes() {
    return getFromStorage('likes') || [];
}
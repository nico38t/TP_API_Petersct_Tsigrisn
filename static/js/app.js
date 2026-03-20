import { chargerGenres, rechercherMusiqueLibre } from './main.js';
import { passerMusiqueSuivante } from './player.js';

// boutons
const btnSearch = document.getElementById('btn-search');
const btnPass = document.getElementById('btn-pass');
const btnSearchQuit = document.getElementById('btn-search-quit');
const slidebar = document.querySelector('.slidebar');

// recherche
btnSearch.onclick = () => {
    slidebar.classList.add('active');
    slidebar.querySelector('input').focus();
};

btnSearchQuit.onclick = () => {
    slidebar.classList.remove('active');
};

btnPass.onclick = passerMusiqueSuivante;

// swipe mobile
let startY = 0;

document.querySelector('.tiktok-app')?.addEventListener('touchstart', e => {
    startY = e.changedTouches[0].screenY;
});

document.querySelector('.tiktok-app')?.addEventListener('touchend', e => {
    if (startY - e.changedTouches[0].screenY > 50) {
        passerMusiqueSuivante();
    }
});

// lancer app
chargerGenres();
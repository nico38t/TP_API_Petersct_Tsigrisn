import { chargerGenres, rechercherMusiqueLibre,
    actualiserGrilleRechercheGenres,
    actualiserArtistesTendances } from './main.js';
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


const searchInput = document.getElementById('search-input');

searchInput.addEventListener('keypress', (e) => {

    if (e.key === 'Enter') {
        const query = searchInput.value.trim();

        if (query !== "") {
            rechercherMusiqueLibre(query);
            slidebar.classList.remove('active');
            searchInput.value = "";
        }
    }
});

chargerGenres();
actualiserGrilleRechercheGenres();
actualiserArtistesTendances();

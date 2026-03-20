import { chargerGenres, rechercherMusiqueLibre,
    actualiserGrilleRechercheGenres,
    actualiserArtistesTendances } from './main.js';
import { passerMusiqueSuivante } from './player.js';
import { ajouterLike, supprimerLike, estLike, getLikes } from './likes.js';
import { getMusiqueActuelle } from './player.js';

// boutons
const btnSearch = document.getElementById('btn-search');
const btnPass = document.getElementById('btn-pass');
const btnSearchQuit = document.getElementById('btn-search-quit');
const slidebar = document.querySelector('.slidebar');

const btnLike = document.getElementById('btn-like');
const likeIcon = btnLike.querySelector('img');

const inputSearch = document.getElementById('search-input');

// ------------------ SEARCH ------------------

btnSearch.onclick = () => {
    slidebar.classList.add('active');
    slidebar.querySelector('input').focus();
    afficherFavoris();
};

btnSearchQuit.onclick = () => {
    slidebar.classList.remove('active');
};

inputSearch.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        rechercherMusiqueLibre(inputSearch.value);
    }
});

// ------------------ PLAYER ------------------

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

// ------------------ LIKE ------------------

btnLike.onclick = () => {
    const musique = getMusiqueActuelle();
    if (!musique) return;

    if (estLike(musique.id)) {
        supprimerLike(musique.id);
    } else {
        ajouterLike(musique);
    }

    updateLikeIcon();
};

function updateLikeIcon() {
    const musique = getMusiqueActuelle();
    if (!musique) return;

    if (estLike(musique.id)) {
        likeIcon.src = "images/etoile-pleine.svg";
    } else {
        likeIcon.src = "images/etoile-vide.svg";
    }
}

// update icone quand musique change
document.addEventListener('musiqueChangee', updateLikeIcon);

// ------------------ FAVORIS ------------------

function afficherFavoris() {
    const conteneur = document.getElementById('favorites-grid');
    conteneur.innerHTML = '';

    const likes = getLikes();

    if (likes.length === 0) {
        conteneur.innerHTML = "<p>Aucun favori</p>";
        return;
    }

    likes.forEach(m => {
        const div = document.createElement('div');
        div.className = 'card-placeholder';

        div.innerHTML = `
            <p>${m.title}</p>
            <small>${m.artist.name}</small>
            <button class="remove-btn">❌</button>
        `;

        // jouer musique
        div.onclick = () => {
            const audio = document.getElementById('audio-player');
            audio.src = m.preview;
            audio.play();
        };

        // supprimer
        div.querySelector('.remove-btn').onclick = (e) => {
            e.stopPropagation();
            supprimerLike(m.id);
            afficherFavoris();
        };

        conteneur.appendChild(div);
    });
}

// ------------------ INIT ------------------

chargerGenres();
actualiserGrilleRechercheGenres();
actualiserArtistesTendances();

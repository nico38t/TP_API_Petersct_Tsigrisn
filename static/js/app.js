import { chargerGenres, rechercherMusiqueLibre,
    actualiserGrilleRechercheGenres,
    actualiserArtistesTendances } from './main.js';
import { passerMusiqueSuivante, jouerMusique, getMusiqueActuelle } from './player.js';
import { ajouterLike, supprimerLike, estLike, getLikes } from './likes.js';
import { ajouterDislike } from './likes.js';


// boutons
const btnSearch = document.getElementById('btn-search');
const btnPass = document.getElementById('btn-pass');
const btnSearchQuit = document.getElementById('btn-search-quit');
const slidebar = document.querySelector('.slidebar');

const btnLike = document.getElementById('btn-like');
const likeIcon = btnLike.querySelector('img');

const inputSearch = document.getElementById('search-input');

const volumeControl = document.getElementById('volume-control');
const audio = document.getElementById('audio-player');

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
let startX = 0;
let startY = 0;

const app = document.querySelector('.tiktok-app');
const overlay = document.getElementById('swipe-overlay');

app?.addEventListener('touchstart', e => {
    // Ignorer les swipes si le menu de recherche est actif
    if (slidebar.classList.contains('active')) {
        return;
    }
    startX = e.changedTouches[0].screenX;
    startY = e.changedTouches[0].screenY;
});

app?.addEventListener('touchmove', e => {
    // Ignorer les swipes si le menu de recherche est actif
    if (slidebar.classList.contains('active')) {
        return;
    }

    const currentX = e.changedTouches[0].screenX;
    const diffX = currentX - startX;

    // déplacement + rotation
    app.style.transform = `translateX(${diffX}px) rotate(${diffX * 0.05}deg)`;

    // effet visuel
    if (diffX > 50) {
        overlay.textContent = "❤️";
        overlay.style.opacity = "1";
        app.classList.add("swipe-like");
        app.classList.remove("swipe-dislike");
    } else if (diffX < -50) {
        overlay.textContent = "👎";
        overlay.style.opacity = "1";
        app.classList.add("swipe-dislike");
        app.classList.remove("swipe-like");
    } else {
        overlay.style.opacity = "0";
        app.classList.remove("swipe-like", "swipe-dislike");
    }
});

app?.addEventListener('touchend', e => {
    // Ignorer les swipes si le menu de recherche est actif
    if (slidebar.classList.contains('active')) {
        return;
    }

    const endX = e.changedTouches[0].screenX;
    const endY = e.changedTouches[0].screenY;

    const diffX = endX - startX;
    const diffY = startY - endY;

    const musique = getMusiqueActuelle();
    if (!musique || !musique.id) {
        resetPosition();
        return;
    }

    // 🔥 PRIORITÉ AUX SWIPES HORIZONTAUX
    if (Math.abs(diffX) > Math.abs(diffY)) {

        // 👉 LIKE
        if (diffX > 120) {
            app.style.transform = "translateX(100vw) rotate(20deg)";
            ajouterLike(musique);
            setTimeout(() => resetCard(), 300);
        }

        // 👉 DISLIKE (FIX ICI)
        else if (diffX < -120) {
            app.style.transform = "translateX(-100vw) rotate(-20deg)";
            ajouterDislike(musique);
            setTimeout(() => resetCard(), 300);
        }

        else {
            resetPosition();
        }
    }

    // 👉 SWIPE VERTICAL
    else {
        if (diffY > 100) {
            app.style.transform = "translateY(-100vh)";
            setTimeout(() => resetCard(), 300);
        } else {
            resetPosition();
        }
    }
});

function resetPosition() {
    app.style.transform = "translateX(0) rotate(0)";
    overlay.style.opacity = "0";
    app.classList.remove("swipe-like", "swipe-dislike");
}

function resetCard() {
    passerMusiqueSuivante();
    resetPosition();
}

app?.addEventListener('touchend', e => {
    // Ignorer les swipes si le menu de recherche est actif
    if (slidebar.classList.contains('active')) {
        return;
    }

    const endX = e.changedTouches[0].screenX;
    const endY = e.changedTouches[0].screenY;

    const diffX = endX - startX;
    const diffY = startY - endY;

    const musique = getMusiqueActuelle();
    if (!musique) return;

    // 👉 LIKE (droite)
    if (diffX > 80) {
        ajouterLike(musique);
        console.log("❤️ Like");
        passerMusiqueSuivante();
    }

    // 👉 DISLIKE (gauche)
    else if (diffX < -80) {
        ajouterDislike(musique);
        console.log("👎 Dislike");
        passerMusiqueSuivante();
    }

    // 👉 SKIP (haut)
    else if (diffY > 80) {
        console.log("⏭ Skip");
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

    // 🔥 regrouper par artiste
    const groupes = {};

    likes.forEach(m => {
        const artiste = m.artist.name;

        if (!groupes[artiste]) {
            groupes[artiste] = [];
        }

        groupes[artiste].push(m);
    });

    Object.entries(groupes).forEach(([artiste, musiques]) => {

        // 🔹 CAS 1 : un seul son → affichage direct
        if (musiques.length === 1) {
            const m = musiques[0];

            const div = document.createElement('div');
            div.className = 'card-placeholder';

            div.innerHTML = `
                <img src="${m.album.cover_medium}" style="width:100%; border-radius:8px;">
                <p>${m.title}</p>
                <small>${artiste}</small>
                <button class="remove-btn">❌</button>
            `;

            conteneur.appendChild(div);

            // Gérer le clic principal AVANT le bouton
            div.addEventListener('click', (e) => {
                // Si on clique sur la croix, ne pas jouer la musique
                if (e.target.closest('.remove-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                // Sinon, jouer la musique
                jouerMusique(m);
                slidebar.classList.remove('active');
            }, true);

            // Récupérer le bouton après insertion dans le DOM
            const removeBtn = div.querySelector('.remove-btn');
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                supprimerLike(m.id);
                afficherFavoris();
            }, true);
        }

        // 🔹 CAS 2 : plusieurs sons → carte artiste
        else {
            const cover = musiques[0].artist.picture_medium;

            const div = document.createElement('div');
            div.className = 'card-placeholder';

            div.innerHTML = `
                <img src="${cover}" style="width:100%; border-radius:8px;">
                <p>${artiste}</p>
                <small>${musiques.length} sons</small>
            `;

            // 🔥 clic = ouvrir ses sons
            div.onclick = () => {
                afficherSousCategorie(artiste, musiques);
            };

            conteneur.appendChild(div);
        }
    });
}


function afficherSousCategorie(artiste, musiques) {
    const conteneur = document.getElementById('favorites-grid');
    conteneur.innerHTML = '';

    // 🔙 bouton retour
    const backBtn = document.createElement('button');
    backBtn.textContent = "⬅ Retour";
    backBtn.onclick = afficherFavoris;
    conteneur.appendChild(backBtn);

    // titre artiste
    const title = document.createElement('h3');
    title.textContent = artiste;
    conteneur.appendChild(title);

    musiques.forEach(m => {
        const div = document.createElement('div');
        div.className = 'card-placeholder';

        div.innerHTML = `
            <img src="${m.album.cover_medium}" style="width:100%; border-radius:8px;">
            <p>${m.title}</p>
            <button class="remove-btn">❌</button>
        `;

        conteneur.appendChild(div);

        // Gérer le clic principal AVANT le bouton
        div.addEventListener('click', (e) => {
            // Si on clique sur la croix, ne pas jouer la musique
            if (e.target.closest('.remove-btn')) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            // Sinon, jouer la musique
            jouerMusique(m);
            slidebar.classList.remove('active');
        }, true);

        // Récupérer le bouton après insertion dans le DOM
        const removeBtn = div.querySelector('.remove-btn');
        removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            supprimerLike(m.id);

            const nouveauxLikes = getLikes();
            const nouveauGroupe = nouveauxLikes.filter(x => x.artist.name === artiste);

            if (nouveauGroupe.length === 0) {
                afficherFavoris();
            } else {
                afficherSousCategorie(artiste, nouveauGroupe);
            }
        }, true);
    });
}

// ...existing code...



// ------------------ INIT ------------------

chargerGenres();
actualiserGrilleRechercheGenres();
actualiserArtistesTendances();
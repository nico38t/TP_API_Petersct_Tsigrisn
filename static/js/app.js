import { chargerGenres, rechercherMusiqueLibre, actualiserGrilleRechercheGenres, actualiserArtistesTendances } from './main.js';
import { passerMusiqueSuivante, jouerMusique, getMusiqueActuelle } from './player.js';
import { ajouterLike, supprimerLike, estLike, getLikes, ajouterDislike } from './likes.js';

// Setup DOM refs
const btnSearch = document.getElementById('btn-search');
const btnPass = document.getElementById('btn-pass');
const btnSearchQuit = document.getElementById('btn-search-quit');
const slidebar = document.querySelector('.slidebar');
const btnLike = document.getElementById('btn-like');
const likeIcon = btnLike.querySelector('img');
const inputSearch = document.getElementById('search-input');
const overlay = document.getElementById('swipe-overlay');
const app = document.querySelector('.tiktok-app');

// --- Events UI Base ---
btnSearch.onclick = () => {
    slidebar.classList.add('active');
    slidebar.querySelector('input').focus();
    afficherFavoris();
};
btnSearchQuit.onclick = () => slidebar.classList.remove('active');

inputSearch.addEventListener('keypress', e => {
    if (e.key === 'Enter') rechercherMusiqueLibre(inputSearch.value);
});
btnPass.onclick = passerMusiqueSuivante;

// --- Paramètres d'animation & Physique ---
const DIST_THRESHOLD = 130;    // Distance min pour valider sans vitesse (px)
const Y_DIST_THRESHOLD = 110;  // Seuil swipe haut (skip)
const VELOCITY_THRESHOLD = 0.55; // Vitesse "flick" min (px/ms)
const EXIT_ANIM_MS = 350;       // Synchro avec durée animation CSS

// --- State interne du moteur de swipe ---
let startX = 0, startY = 0, startTime = 0;
let isDragging = false;

app?.addEventListener('touchstart', e => {
    if (slidebar.classList.contains('active')) return;
    const touch = e.changedTouches[0];
    startX = touch.screenX;
    startY = touch.screenY;
    startTime = Date.now();
    isDragging = true;

    // Coupe toute transition pour un drag super réactif au doigt
    app.style.transition = 'none';
}, {passive: true});

app?.addEventListener('touchmove', e => {
    if (!isDragging || slidebar.classList.contains('active')) return;

    const touch = e.changedTouches[0];
    const diffX = touch.screenX - startX;
    const diffY = touch.screenY - startY;

    // Verrouillage de l'axe : si on bouge bcp plus en X qu'en Y
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Feedback visuel Like/Dislike (Axe X)
        // Ajout d'une rotation "amortie" basée sur la distance
        const rotation = diffX * 0.07;
        app.style.transform = `translateX(${diffX}px) rotate(${rotation}deg)`;

        // Visual feedback overlay
        if (diffX > 60) {
            overlay.innerHTML = "<i class='icon-heart'></i>";
            overlay.style.opacity = "1";
            app.classList.add("swipe-like");
            app.classList.remove("swipe-dislike");
        } else if (diffX < -60) {
            overlay.innerHTML = "<i class='icon-dislike'></i>";
            overlay.style.opacity = "1";
            app.classList.add("swipe-dislike");
            app.classList.remove("swipe-like");
        } else {
            overlay.style.opacity = "0";
            app.classList.remove("swipe-like", "swipe-dislike");
        }

        // Empêche le scroll natif Y pendant qu'on swipe horizontalement
        if (e.cancelable) e.preventDefault();
    } else {
        // Feedback visuel Skip (Axe Y, haut uniquement)
        if (diffY < 0) {
            // Amorti sur le drag vers le haut (rubber-band effect)
            const dampedY = diffY * 0.6;
            app.style.transform = `translateY(${dampedY}px)`;
            overlay.style.opacity = "0";
        }
    }
});

app?.addEventListener('touchend', e => {
    if (!isDragging || slidebar.classList.contains('active')) return;
    isDragging = false;

    const touch = e.changedTouches[0];
    const diffX = touch.screenX - startX;
    const diffY = startY - touch.screenY; // Inverse Y car écran 0 top
    const timeTaken = Date.now() - startTime;

    // Calcul vélocité (px par ms)
    const velocityX = timeTaken > 0 ? (Math.abs(diffX) / timeTaken) : 0;

    const musique = getMusiqueActuelle();

    // Remet une transition par défaut pour le reset ou le début de l'anim de sortie
    app.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease';

    if (!musique || !musique.id) return resetPosition();

    // Heuristique Flick (rapide) ou Drag long (lent)
    const isFlickX = velocityX > VELOCITY_THRESHOLD && timeTaken < 250;
    const absDiffY = Math.abs(touch.screenY - startY);

    // Priorité axe horizontal
    if (Math.abs(diffX) > absDiffY) {
        if (diffX > DIST_THRESHOLD || (isFlickX && diffX > 0)) { // Swipe/Flick Droit -> Like
            app.classList.add("exit-like"); // Trigger anim CSS
            ajouterLike(musique);
            setTimeout(resetCard, EXIT_ANIM_MS);
        } else if (diffX < -DIST_THRESHOLD || (isFlickX && diffX < 0)) { // Swipe/Flick Gauche -> Dislike
            app.classList.add("exit-dislike"); // Trigger anim CSS
            ajouterDislike(musique);
            setTimeout(resetCard, EXIT_ANIM_MS);
        } else {
            resetPosition();
        }
    } else {
        // Vélocité Axe Y (Skip)
        const velocityY = timeTaken > 0 ? (Math.abs(startY - touch.screenY) / timeTaken) : 0;
        const isFlickY = velocityY > VELOCITY_THRESHOLD && timeTaken < 250;

        if (diffY > Y_DIST_THRESHOLD || (isFlickY && diffY > 0)) { // Swipe Haut -> Skip
            app.classList.add("exit-skip"); // Trigger anim CSS
            setTimeout(resetCard, EXIT_ANIM_MS);
        } else {
            resetPosition();
        }
    }
});

function resetPosition() {
    // Transition "snap back" élastique
    app.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
    app.style.transform = "translateX(0) translateY(0) rotate(0)";
    overlay.style.opacity = "0";
    app.classList.remove("swipe-like", "swipe-dislike");
    // Nettoyage classes anim au cas où
    setTimeout(() => app.classList.remove("exit-like", "exit-dislike", "exit-skip"), 100);
}

function resetCard() {
    passerMusiqueSuivante();

    // Setup carte suivante invisible
    app.style.transition = 'none';
    app.style.opacity = '0';
    app.style.transform = "translateX(0) translateY(0) rotate(0)";

    // Nettoyage état d'anim
    app.classList.remove("exit-like", "exit-dislike", "exit-skip", "swipe-like", "swipe-dislike");
    overlay.style.opacity = "0";

    // Fade in de la nouvelle carte
    setTimeout(() => {
        app.style.transition = 'opacity 0.4s ease';
        app.style.opacity = '1';
    }, 50);
}

// --- Bouton Like statique ---
btnLike.onclick = () => {
    const musique = getMusiqueActuelle();
    if (!musique) return;
    estLike(musique.id) ? supprimerLike(musique.id) : ajouterLike(musique);
    updateLikeIcon();
};

function updateLikeIcon() {
    const musique = getMusiqueActuelle();
    if (!musique) return;
    likeIcon.src = estLike(musique.id) ? "images/etoile-pleine.svg" : "images/etoile-vide.svg";
}
document.addEventListener('musiqueChangee', updateLikeIcon);

// --- Rendu vue Favoris (Regroupement par artiste) ---
function afficherFavoris() {
    const conteneur = document.getElementById('favorites-grid');
    conteneur.innerHTML = '';
    const likes = getLikes();

    if (likes.length === 0) {
        conteneur.innerHTML = "<p>Aucun favori</p>";
        return;
    }

    const groupes = {};
    likes.forEach(m => {
        const artiste = m.artist.name;
        if (!groupes[artiste]) groupes[artiste] = [];
        groupes[artiste].push(m);
    });

    Object.entries(groupes).forEach(([artiste, musiques]) => {
        // Un seul son -> Card directe
        if (musiques.length === 1) {
            const m = musiques[0];
            const div = document.createElement('div');
            div.className = 'card-placeholder';
            div.innerHTML = `
                <img src="${m.album.cover_medium}" style="width:100%; border-radius:8px;">
                <p>${m.title}</p>
                <small>${artiste}</small>
                <button class="remove-btn"><i class="icon-close"></i></button>
            `;
            conteneur.appendChild(div);

            div.addEventListener('click', (e) => {
                if (e.target.closest('.remove-btn')) return;
                jouerMusique(m);
                slidebar.classList.remove('active');
            }, true);

            div.querySelector('.remove-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                supprimerLike(m.id);
                afficherFavoris();
            }, true);
        } else {
            // Plusieurs sons -> Card dossier artiste
            const div = document.createElement('div');
            div.className = 'card-placeholder';
            div.innerHTML = `
                <img src="${musiques[0].artist.picture_medium}" style="width:100%; border-radius:8px;">
                <p>${artiste}</p>
                <small>${musiques.length} sons</small>
            `;
            div.onclick = () => afficherSousCategorie(artiste, musiques);
            conteneur.appendChild(div);
        }
    });
}

function afficherSousCategorie(artiste, musiques) {
    const conteneur = document.getElementById('favorites-grid');
    conteneur.innerHTML = '';

    const backBtn = document.createElement('button');
    backBtn.className = 'back-to-fav-btn';
    backBtn.innerHTML = "<i class='icon-arrow-left'></i> Retour";
    backBtn.onclick = afficherFavoris;
    conteneur.appendChild(backBtn);

    const title = document.createElement('h3');
    title.textContent = artiste;
    conteneur.appendChild(title);

    musiques.forEach(m => {
        const div = document.createElement('div');
        div.className = 'card-placeholder';
        div.innerHTML = `
            <img src="${m.album.cover_medium}" style="width:100%; border-radius:8px;">
            <p>${m.title}</p>
            <button class="remove-btn"><i class="icon-close"></i></button>
        `;
        conteneur.appendChild(div);

        div.addEventListener('click', (e) => {
            if (e.target.closest('.remove-btn')) return;
            jouerMusique(m);
            slidebar.classList.remove('active');
        }, true);

        div.querySelector('.remove-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            supprimerLike(m.id);
            const nouveauxLikes = getLikes();
            const nouveauGroupe = nouveauxLikes.filter(x => x.artist.name === artiste);
            nouveauGroupe.length === 0 ? afficherFavoris() : afficherSousCategorie(artiste, nouveauGroupe);
        }, true);
    });
}

// --- Init app ---
chargerGenres();
actualiserGrilleRechercheGenres();
actualiserArtistesTendances();
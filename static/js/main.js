import { setPlaylist, setIndex, mettreAJourLecteur } from './player.js';
import { getLikes, getDislikes } from './likes.js';

const proxy = url => `https://corsproxy.io/?${encodeURIComponent(url)}`;

export function chargerGenres() {
    fetch(proxy('https://api.deezer.com/genre'))
        .then(res => res.json())
        .then(data => {
            const conteneur = document.getElementById('genre-list');
            conteneur.innerHTML = '';

            const topGenres = data.data.slice(0, 10);

            topGenres.forEach((genre, index) => {
                const btn = document.createElement('button');
                btn.className = 'genre-pill';
                if (index === 0) btn.classList.add('active');

                btn.textContent = genre.name;

                btn.onclick = () => {
                    document.querySelectorAll('.genre-pill')
                        .forEach(b => b.classList.remove('active'));

                    btn.classList.add('active');
                    chargerMusiqueParGenreId(genre.id);
                };

                conteneur.appendChild(btn);
            });

            chargerMusiqueParGenreId(topGenres[0].id);
        });
}

// 🔥 VERSION AMÉLIORÉE
export function chargerMusiqueParGenreId(id) {
    fetch(proxy(`https://api.deezer.com/chart/${id}/tracks?limit=20`))
        .then(res => res.json())
        .then(data => {
            if (!data.data) return;

            const likes = getLikes();
            const dislikes = getDislikes();

            // ❌ enlever dislikes
            let musiques = data.data.filter(m =>
                !dislikes.some(d => d.id === m.id)
            );

            // ❤️ favoriser artistes likés
            musiques.sort((a, b) => {
                const scoreA = likes.some(l => l.artist.name === a.artist.name) ? 1 : 0;
                const scoreB = likes.some(l => l.artist.name === b.artist.name) ? 1 : 0;
                return scoreB - scoreA;
            });

            setPlaylist(musiques);

            const random = Math.floor(Math.random() * musiques.length);
            setIndex(random);
            mettreAJourLecteur(musiques[random]);
        });
}

export function rechercherMusiqueLibre(motCle) {
    fetch(proxy(`https://api.deezer.com/search?q=${motCle}&limit=20`))
        .then(res => res.json())
        .then(data => {
            if (!data.data.length) return alert("Aucun résultat");

            setPlaylist(data.data);
            setIndex(0);

            mettreAJourLecteur(data.data[0]);
            mettreAJourBarreRecherche(motCle, data.data);
        });
}

function mettreAJourBarreRecherche(motCle, musiques) {
    const conteneur = document.getElementById('genre-list');
    conteneur.innerHTML = '';

    const btnTop = document.createElement('button');
    btnTop.textContent = '🔙 Top';
    btnTop.onclick = chargerGenres;
    conteneur.appendChild(btnTop);

    const btnRecherche = document.createElement('button');
    btnRecherche.textContent = motCle;
    btnRecherche.className = 'active';
    conteneur.appendChild(btnRecherche);

    const artistes = [...new Set(musiques.map(m => m.artist.name))].slice(0, 3);

    artistes.forEach(a => {
        const btn = document.createElement('button');
        btn.textContent = a;
        btn.onclick = () => rechercherMusiqueLibre(a);
        conteneur.appendChild(btn);
    });
}

export function actualiserGrilleRechercheGenres() {
    const url = 'https://api.deezer.com/genre';
    fetch(proxy(url))
        .then(res => res.json())
        .then(data => {
            const grid = document.getElementById('genres-grid');
            if (!grid) return;
            grid.innerHTML = '';

            data.data.slice(0, 12).forEach(genre => {
                const card = document.createElement('div');
                card.className = 'card-placeholder';
                card.textContent = genre.name;
                card.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${genre.picture_medium})`;
                card.style.backgroundSize = 'cover';

                card.onclick = () => {
                    chargerMusiqueParGenreId(genre.id);
                    document.getElementById('search-bar').classList.remove('active');
                };

                grid.appendChild(card);
            });
        });
}

export function actualiserArtistesTendances() {
    const url = 'https://api.deezer.com/chart/0/artists';
    fetch(proxy(url))
        .then(res => res.json())
        .then(data => {
            const grid = document.getElementById('artists-grid');
            if (!grid) return;
            grid.innerHTML = '';

            data.data.slice(0, 12).forEach(artist => {
                const card = document.createElement('div');
                card.className = 'card-placeholder';
                card.innerHTML = `
                    <img src="${artist.picture_medium}" style="border-radius:50%; width:60px; height:60px; object-fit:cover; margin-bottom:10px;">
                    <p>${artist.name}</p>
                `;

                card.onclick = () => {
                    rechercherMusiqueLibre(artist.name);
                    document.getElementById('search-bar').classList.remove('active');
                };

                grid.appendChild(card);
            });
        });
}
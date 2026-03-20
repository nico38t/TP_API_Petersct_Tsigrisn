import { setPlaylist, setIndex, mettreAJourLecteur } from './player.js';

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

export function chargerMusiqueParGenreId(id) {
    fetch(proxy(`https://api.deezer.com/chart/${id}/tracks?limit=20`))
        .then(res => res.json())
        .then(data => {
            if (!data.data) return;

            setPlaylist(data.data);
            const random = Math.floor(Math.random() * data.data.length);

            setIndex(random);
            mettreAJourLecteur(data.data[random]);
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
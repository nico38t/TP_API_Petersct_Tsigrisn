function chargerMusique(motCle) {


    console.log(`Recherche en cours pour : ${motCle}...`);


    const urlDeezer = `https://api.deezer.com/search?q=${motCle}&limit=10`;


    const urlProxy = `https://corsproxy.io/?${encodeURIComponent(urlDeezer)}`;

    fetch(urlProxy)

        .then(response => {
            if (!response.ok) throw new Error("Erreur réseau du proxy");
            return response.json();
        })
        .then(dataDeezer => {

            if (dataDeezer.data && dataDeezer.data.length > 0) {

                const musique = dataDeezer.data[0];
                console.log("Musique trouvée :", musique.title);

                document.getElementById('bg-cover').src = musique.album.cover_xl;
                document.getElementById('track-title').textContent = musique.title;
                document.getElementById('track-artist').textContent = musique.artist.name;


                const lecteur = document.getElementById('audio-player');
                lecteur.src = musique.preview;
                lecteur.play();

            } else {
                console.log("Aucun résultat trouvé.");
            }
        })
        .catch(erreur => {
            console.error("Problème avec l'API :", erreur);
        });
}


const premierBoutonGenre = document.querySelectorAll('.genre-pill')[1];

premierBoutonGenre.addEventListener('click', function() {

    let motcle = prompt('Quel est le titre de ton son');

    chargerMusique(motcle);
});
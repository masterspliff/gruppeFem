document.addEventListener('DOMContentLoaded', function() {
    fetchAlbumData();
});

// stort magi til at indlæse albums.json
async function fetchAlbumData() {
    try {
        const response = await fetch('albums.json');
        albumsData = await response.json();
        displayAlbums(albumsData);
    } catch (error) {
        console.error('Failed to fetch albums:', error);
    }
}

// viser album container for hver album der findes i albums.json --> opretter div med class id ".album-container".
function displayAlbums(albums) {
    const albumContainer = document.querySelector('.album-container');
    albumContainer.innerHTML = albums.map(album => createAlbumHTML(album)).join('');
    albumContainer.querySelectorAll('.album').forEach(albumDiv => {
        albumDiv.addEventListener('click', () => toggleTracksDisplay(albumDiv, albumsData.find(album => album.albumName === albumDiv.dataset.albumName)));
    });
}

// opretter fysiske album structur, og hvordan det skal se ud. 
function createAlbumHTML(album) {
    return `
        <div class="album" data-album-name="${album.albumName}">
            <img src="${album.coverImage}" alt="${album.albumName} Cover" class="albumCover">
            <h3 class="text-lg font-bold">${album.albumName} <br> ${album.artistName}</h3>
            <p class="genre">Genre: ${album.genre.map(genre => `<br><span class="genre-text">${genre}</span>  `).join('')}</p>
            <p class="fact">Fact: ${album.fact}</p>
            <br>
            <div class="tracks hidden"></div>
        </div>
    `;
}

// funktion til at kunnne vise og skjule tracks fra albums, når man klikker.
function toggleTracksDisplay(albumDiv, album) {
    const tracksContainer = albumDiv.querySelector('.tracks');
    if (tracksContainer.classList.contains('hidden')) {
        tracksContainer.classList.remove('hidden');
        tracksContainer.innerHTML = `
            Tracks:
            <ul>${album.trackList.map(track => `<ul>${track.trackNumber}. ${track.trackTitle} - ${formatTrackTime(track.trackTimeInSeconds)}</ul>`).join('')}</ul>
        `;
    } else {
        tracksContainer.classList.add('hidden');
        tracksContainer.innerHTML = '';
    }
}

// formater tallet i json til at se pænere ud med minut og sekundtal.
function formatTrackTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}


// filter funktion. 
function filterByGenre(selectedGenre) {
    const filteredAlbums = selectedGenre === 'All' ? albumsData : albumsData.filter(album => album.genre.includes(selectedGenre));
    displayAlbums(filteredAlbums);
}

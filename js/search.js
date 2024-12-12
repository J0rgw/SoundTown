document.addEventListener('DOMContentLoaded', function() {
  var searchInput = document.getElementById("search");

  // Retrieve the access token from localStorage
  let access_token = localStorage.getItem('access_token');

  if (searchInput) {
    searchInput.addEventListener('keyup', function (event) {
      if (event.key === 'Enter') {
        let query = searchInput.value.trim().replace(/\s/g, "%20");
        if (query) {
          // Store the query in localStorage to access it in search.html
          localStorage.setItem('spotifySearchQuery', query);
          // Redirect to search.html
          window.location.href = '/html/search.html';
        }
      }
    });
  }

  if (window.location.pathname.endsWith('/html/search.html')) {
    let query = localStorage.getItem('spotifySearchQuery');
    if (query && access_token) {
      fetchSpotifyData(query, access_token);
    }
  }
});

function fetchSpotifyData(query, access_token) {
  fetch('https://api.spotify.com/v1/search?q=' + query + '&type=album,artist,track&limit=3', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + access_token
    }
  })
  .then(response => response.json())
  .then(data => {
    displayResults(data);
  })
  .catch(error => console.error('Error:', error));
}


function displayResults(data) {
    // Clear previous results
    document.querySelectorAll('.track, .artist, .album').forEach(element => {
        element.innerHTML = '';
    });

    // Display tracks
    var i=0;
    if (data.tracks && data.tracks.items.length > 0) {
        i=0;
        data.tracks.items.forEach((track) => {
            const trackDiv = document.querySelectorAll('.track');
            const trackCard = document.createElement('div');
            trackCard.classList.add('flip-container');
            trackCard.innerHTML = `
          <div class="flipper">
            <div class="front">
              <img src="${track.album.images[0].url}" alt="${track.name}">
              <p>${track.name}</p>
              <div id="spotify"><a class="info" target="_blank" href="${data.tracks.items[i].album.external_urls.spotify}"><img src="/img/spotify-icon.svg" alt="link to spotify"></a></div>
            </div>
            <div class="back">
              <p>Artist: ${track.artists[0].name}</p>
              <p>Album: ${track.album.name}</p>
            </div>
          </div>
        `;
            trackDiv[i].appendChild(trackCard);
            i++;
        });
    }

    // Display artists
    if (data.artists && data.artists.items.length > 0) {
        i=0;
        data.artists.items.forEach((artist) => {
            const artistDiv = document.querySelectorAll('.artist');
            const artistCard = document.createElement('div');
            artistCard.classList.add('flip-container');
            artistCard.innerHTML = `
          <div class="flipper">
            <div class="front">
              <img src="${artist.images[0] ? artist.images[0].url : '/img/default-artist.png'}" alt="${artist.name}">
              <p>${artist.name}</p>
              <div id="spotify"><a class="info" target="_blank" href="${data.tracks.items[i].album.external_urls.spotify}"><img src="/img/spotify-icon.svg" alt="link to spotify"></a></div>
            </div>
            <div class="back">
              <p>Followers: ${artist.followers.total}</p>
              <p>Genres: ${artist.genres.join(', ')}</p>
            </div>
          </div>
        `;
            artistDiv[i].appendChild(artistCard);
            i++;
        });
    }

    // Display albums
    if (data.albums && data.albums.items.length > 0) {
        i=0;
        data.albums.items.forEach((album) => {
            const albumDiv = document.querySelectorAll('.album');
            const albumCard = document.createElement('div');
            albumCard.classList.add('flip-container');
            albumCard.innerHTML = `
          <div class="flipper">
            <div class="front">
              <img src="${album.images[0].url}" alt="${album.name}">
              <p>${album.name}</p>
              <div id="spotify"><a class="info" target="_blank" href="${data.tracks.items[i].album.external_urls.spotify}"><img src="/img/spotify-icon.svg" alt="link to spotify"></a></div>
            </div>
            <div class="back">
              <p>Artist: ${album.artists[0].name}</p>
              <p>Release Date: ${album.release_date}</p>
            </div>
          </div>
        `;
            albumDiv[i].appendChild(albumCard);
            i++;
        });
    }
}

$(".flipper").each().click(function (event) {
        event.srcElement.toggleClass('rotation');
        console.log($(this));

});



function generateRandomString(length) {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  
  async function generateCodeChallenge(codeVerifier) {
    const digest = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(codeVerifier),
    );
  
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
  
  function generateUrlWithSearchParams(url, params) {
    const urlObject = new URL(url);
    urlObject.search = new URLSearchParams(params).toString();
  
    return urlObject.toString();
  }
  
  function redirectToSpotifyAuthorizeEndpoint() {
    const codeVerifier = generateRandomString(64);
  
    generateCodeChallenge(codeVerifier).then((code_challenge) => {
      window.localStorage.setItem('code_verifier', codeVerifier);
  
      window.location = generateUrlWithSearchParams(
        'https://accounts.spotify.com/authorize',
        {
          response_type: 'code',
          client_id: '85e79f9ec9e14e429c5b2c6c36bdd97f',
          scope: 'user-read-private user-read-email user-top-read',
          code_challenge_method: 'S256',
          code_challenge,
          redirect_uri: 'https://j0rgw.github.io./',
        },
      );
    });
  }
  
  document
    .getElementById('login-button')
    .addEventListener('click', redirectToSpotifyAuthorizeEndpoint, false);
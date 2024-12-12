(function () {
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

      // Redirect to example:
      // GET https://accounts.spotify.com/authorize?response_type=code&client_id=77e602fc63fa4b96acff255ed33428d3&redirect_uri=http%3A%2F%2Flocalhost&scope=user-follow-modify&state=e21392da45dbf4&code_challenge=KADwyz1X~HIdcAG20lnXitK6k51xBP4pEMEZHmCneHD1JhrcHjE1P3yU_NjhBz4TdhV6acGo16PCd10xLwMJJ4uCutQZHw&code_challenge_method=S256

      window.location = generateUrlWithSearchParams(
        'https://accounts.spotify.com/authorize',
        {
          response_type: 'code',
          client_id,
          scope: 'user-read-private user-read-email user-top-read',
          code_challenge_method: 'S256',
          code_challenge,
          redirect_uri,
        },
      );

      // If the user accepts spotify will come back to your application with the code in the response query string
      // Example: http://127.0.0.1:8080/?code=NApCCg..BkWtQ&state=profile%2Factivity
    });
  }

  function exchangeToken(code) {
    const code_verifier = localStorage.getItem('code_verifier');

    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: new URLSearchParams({
        client_id,
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        code_verifier,
      }),
    })
      .then(addThrowErrorToFetch)
      .then((data) => {
        processTokenResponse(data);

        // clear search query params in the url
        window.history.replaceState({}, document.title, '/');
      })
      .catch(handleError);
  }

  function refreshToken() {
    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: new URLSearchParams({
        client_id,
        grant_type: 'refresh_token',
        refresh_token,
      }),
    })
      .then(addThrowErrorToFetch)
      .then(processTokenResponse)
      .catch(handleError);
  }

  function handleError(error) {
    console.error(error);
    mainPlaceholder.innerHTML = errorTemplate({
      status: error.response.status,
      message: error.error.error_description,
    });
  }

  async function addThrowErrorToFetch(response) {
    if (response.ok) {
      return response.json();
    } else {
      throw { response, error: await response.json() };
    }
  }

  function logout() {
    localStorage.clear();
    window.location.reload();
  }
  function reload() {
    getMeTopTracksData();
    getMeTopTracksDataYear();
    getMeTopTracksDataRelease();
    getUserData();
    getMeTopArtistData();
  }

  function processTokenResponse(data) {
    console.log(data);

    access_token = data.access_token;
    refresh_token = data.refresh_token;

    const t = new Date();
    expires_at = t.setSeconds(t.getSeconds() + data.expires_in);

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('expires_at', expires_at);
    console.log(access_token);


    /*
    oauthPlaceholder.innerHTML = oAuthTemplate({
      access_token,
      refresh_token,
      expires_at,
    });
    */

    // load data of logged in user
  }

  function getMeTopTracksData() {
    fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    }).then(response => response.json())
      .then(data => {
        for (var i = 0; i < 5; i++) {
          getAlbumMonthData(data.items[i].album.id, i);
        }
      })
      .catch(error => console.error('Error:', error));
  }

  function getMeTopArtistData() {
    fetch('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    }).then(response => response.json())
      .then(data => {
        for (var i = 0; i < 5; i++) {

          weeklyDiscoversData(data.items[i].genres[0].replace(/\s/g, "%2B"), i);
        }
      })
      .catch(error => console.error('Error:', error));
  }

  //monthly albums
  function getAlbumMonthData(id, pos) {
    var img = document.createElement("img");
    var adder = document.getElementById("front");
    fetch('https://api.spotify.com/v1/albums/' + id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    }).then(response => response.json())
      .then(data => {
        $("#album-month .front").each(function (index) {
          if (index == pos) {
            img.src = data.images[0].url;
            this.appendChild(img);
            this.innerHTML += `<div id="spotify"><a class="info" target="_blank" href="${data.external_urls.spotify}"><img src="/img/spotify-icon.svg" alt="link to spotify"></a></div>`;
          }
        });
        $("#album-month .back").each(function (index) {
          if (index == pos) {
            this.innerHTML = albumPrintableData2Lvl(data);
          }
        });
      }).catch(error => console.error('Error:', error));
  }
  //year
  function getMeTopTracksDataYear() {
    fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    }).then(response => response.json())
      .then(data => {
        for (var i = 0; i < 5; i++) {
          getAlbumYearData(data.items[i].album.id, i);
        }
      })
      .catch(error => console.error('Error:', error));
  }

  function getAlbumYearData(id, pos) {
    var img = document.createElement("img");
    fetch('https://api.spotify.com/v1/albums/' + id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    }).then(response => response.json())
      .then(data => {
        $("#album-year .front").each(function (index) {
          if (index == pos) {
            img.src = data.images[0].url;
            this.appendChild(img);
            this.innerHTML += `<div id="spotify"><a class="info" target="_blank" href="${data.external_urls.spotify}"><img src="/img/spotify-icon.svg" alt="link to spotify"></a></div>`;
          }
        });
        $("#album-year .back").each(function (index) {
          if (index == pos) {
            this.innerHTML = albumPrintableData2Lvl(data);
          }
        });
      }).catch(error => console.error('Error:', error));
  }
  //releases
  //fix releases find new based on most listened genres
  function getMeTopTracksDataRelease() {
    var img = document.createElement("img");
    fetch('https://api.spotify.com/v1/browse/new-releases?limit=5', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    }).then(response => response.json())
      .then(data => {
        for (var i = 0; i < 5; i++) {
          $("#album-releases .front").each(function (index) {
            if (index == i) {
              img.src = data.albums.items[i].images[0].url;
              this.appendChild(img);
              this.innerHTML += `<div id="spotify"><a class="info" target="_blank" href="${data.albums.items[i].artists[0].external_urls.spotify}"><img src="/img/spotify-icon.svg" alt="link to spotify"></a></div>`;
            }
          });
          $("#album-releases .back").each(function (index) {
            if (index == i) {
              this.innerHTML = albumPrintableData1Lvl(data, i);
            }
          });
        }
      })
      .catch(error => console.error('Error:', error));
  }

  //weekly
  //data.items[i].genres[0];
  function weeklyDiscoversData(genre, num) {
    var img = document.createElement("img");
    console.log(genre);
    fetch('https://api.spotify.com/v1/search?q=genre%3A' + genre + '&type=album%2Cartist%2Ctrack&market=ES&limit=15&', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    }).then(response => response.json())
      .then(data => {
        var i = 0, j = 0;
        var albumsDiscover = [];
        if (albumsDiscover.indexOf(data.tracks.items[i].artists[0].id) >= 0) {
          console.log("f");
        } else {
          albumsDiscover.push(data.tracks.items[num].artists[0].id);
          $("#album-discover .front").each(function (index) {
            if (index == num) {
              console.log(data.tracks.items[num].album.name);
              img.src = data.tracks.items[num].album.images[0].url;
              this.appendChild(img);
              this.innerHTML += `<div id="spotify"><a class="info" target="_blank" href="${data.tracks.items[i].album.external_urls.spotify}"><img src="/img/spotify-icon.svg" alt="link to spotify"></a></div>`;
            }
          });
          $("#album-discover .back").each(function (index) {
            if (index == num) {
              this.innerHTML = albumPrintableDataDiscovers(data, num);
            }
          });

        }
        i++;
      }).catch(error => console.error('Error:', error));
  }

  function albumPrintableDataDiscovers(data, num) {
    return `
              <div class="info">
                  <p>${data.tracks.items[num].album.name}</p>
                  <p>${data.tracks.items[num].artists[0].name}</p>
                  <p>Total Tracks: ${data.tracks.items[num].album.total_tracks}</p>
                  <p>${data.tracks.items[num].album.release_date}</p>
              </div>
              `;
  }

  //https://api.spotify.com/v1/search?q=genre%3Ahip+hop+tag%3Ahipster&type=album%2Cartist%2Ctrack&market=ES&limit=5
  //https://api.spotify.com/v1/tracks?market=ES&ids=7ouMYWpwJ422jRcDASZB7P%2C4VqPOruhp5EdPBeR92t6lQ%2C2takcwOaAZWiXQijPHIx7B
  //   What I am doing as an alternative is using /search, as @Ryuko4w mentioned above.
  // I am getting both the currently played artist and track and then pass them to /search - i.e. '<artist_name> <track_name>'. Then, I get the tracks after the first suggestion and use them as a list of recommendations.
  // It is not ideal, but we have to adapt to the current situation
  //template album info
  function albumPrintableData2Lvl(data) {
    return `
              <div class="info">
                  <p>${data.name}</p>
                  <p>${data.artists[0].name}</p>
                  <p>Total Tracks: ${data.total_tracks}</p>
                  <p>${data.release_date.split('-')[0]}</p>
              </div>
              `;
  }
  function albumPrintableData1Lvl(data, num) {
    return `
              <div class="info">
                  <p>${data.albums.items[num].name}</p>
                  <p>${data.albums.items[num].artists[0].name}</p>
                  <p>Total Tracks: ${data.albums.items[num].total_tracks}</p>
                  <p>${data.albums.items[num].release_date}</p>
              </div>
              `;
  }
  //miliseconds to clock
  function msToTime(duration) {

    var seconds = Math.floor((parseInt(duration) / 1000) % 60),
      minutes = Math.floor((parseInt(duration) / (1000 * 60)) % 60),
      hours = Math.floor((parseInt(duration) / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return hours + ":" + minutes + ":" + seconds;
  }

  //user data photo+name
  function getUserData() {
    fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw await response.json();
        }
      })
      .then((data) => {
        console.log(data);
        //document.getElementById('login').style.display = 'none';
        //document.getElementById('loggedin').style.display = 'unset';
        login.style.background = "url('" + data.images[0]?.url + "') no-repeat";
        login.style.backgroundSize = "cover";
        login.style.borderRadius = "inherit";
        //login.innerHTML = userProfileTemplate(data);
      })
      .catch((error) => {
        console.error(error);
        mainPlaceholder.innerHTML = errorTemplate(error.error);
      });
  }

  function userProfileTemplate(data) {
    return `
            <p>${artist}</p>    
            <label for="Genre" class+"form-label" sol-sm-12>${title}:</label>
            <label for="artist" class+"form-label" sol-sm-12>By ${artist}:</label>
            <label for="track" class+"form-label" sol-sm-12>Tracks:</label>
            <label for="tracks" class+"form-label" sol-sm-12>Most Popular:</label>
            <button id="btnDialog">x</button>
        </form>
        `;
  }


  function oAuthTemplate(data) {
    return `<h2>oAuth info</h2>
        <table>
          <tr>
              <td>Access token</td>
              <td>${data.access_token}</td>
          </tr>
          <tr>
              <td>Refresh token</td>
              <td>${data.refresh_token}</td>
          </tr>
          <tr>
              <td>Expires at</td>
              <td>${new Date(parseInt(data.expires_at, 10)).toLocaleString()}</td>
          </tr>
        </table>`;
  }



  function errorTemplate(data) {
    return `<h2>Error info</h2>
        <table>
          <tr>
              <td>Status</td>
              <td>${data.status}</td>
          </tr>
          <tr>
              <td>Message</td>
              <td>${data.message}</td>
          </tr>
        </table>`;
  }

  // Your client id from your app in the spotify dashboard:
  // https://developer.spotify.com/dashboard/applications
  const client_id = '85e79f9ec9e14e429c5b2c6c36bdd97f';
  const redirect_uri = 'http://127.0.0.1:5501'; // Your redirect uri

  // Restore tokens from localStorage
  let access_token = localStorage.getItem('access_token') || null;
  let refresh_token = localStorage.getItem('refresh_token') || null;
  let expires_at = localStorage.getItem('expires_at') || null;

  // References for HTML rendering
  const mainPlaceholder = document.getElementById('main');
  const oauthPlaceholder = document.getElementById('oauth');

  // References for HTML rendering
  const login = document.getElementById('login-button');

  // If the user has accepted the authorize request spotify will come back to your application with the code in the response query string
  // Example: http://127.0.0.1:8080/?code=NApCCg..BkWtQ&state=profile%2Factivity
  const args = new URLSearchParams(window.location.search);
  const code = args.get('code');

  if (code) {
    // we have received the code from spotify and will exchange it for a access_token
    exchangeToken(code);
    document.getElementById('login-button').addEventListener('click', logout, false);

  } else if (access_token && refresh_token && expires_at) {
    // we are already authorized and reload our tokens from localStorage
    /*document.getElementById('loggedin').style.display = 'unset';

    oauthPlaceholder.innerHTML = oAuthTemplate({
      access_token,
      refresh_token,
      expires_at,
    });
*/
    getUserData();
  } else {
    // we are not logged in so show the login button
    document.getElementById('login').style.display = 'unset';
  }

  document
    .getElementById('login-button')
    .addEventListener('click', redirectToSpotifyAuthorizeEndpoint, false);


  window.onload = function () {
    reload();
  }

  /*
  document
    .getElementById('refresh-button')
    .addEventListener('click', refreshToken, false);
  */
  document
    .getElementById('logout-button')
    .addEventListener('click', logout, false);

})();
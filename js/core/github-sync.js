/* Eignungstest-Trainer.1.0 · GitHub REST API Auto-Sync Engine
   Enables direct commits from the client-side app to the repository. */
window.EGTGithubSync = (function () {
  'use strict';

  // Helper for UTF-8 safe base64 encoding (browser safe)
  function utob(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  }

  // Helper for UTF-8 safe base64 decoding
  function btou(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str.replace(/\s/g, '')), function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  function getApiHeaders(token) {
    return {
      'Authorization': 'token ' + token,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };
  }

  function getPathForCategory(cat) {
    switch (cat) {
      case 'Mathematik':
        return 'data/question-bank-mathe.js';
      case 'Kaufm. Rechnen':
      case 'Bürowissen':
        return 'data/question-bank-kaufm.js';
      case 'Pädagogik':
      case 'Situationen':
        return 'data/question-bank-sozial.js';
      case 'IT/FISI':
        return 'data/question-bank-it-extra.js';
      default:
        return 'data/question-bank.js';
    }
  }

  function publishQuestion(q, config, onProgress, onSuccess, onError) {
    var owner = config.owner;
    var repo  = config.repo;
    var token = config.token;

    if (!owner || !repo || !token) {
      onError('GitHub-Konfiguration unvollständig (Owner, Repo oder Token fehlt).');
      return;
    }

    var path = getPathForCategory(q.category);
    var url = 'https://api.github.com/repos/' + owner + '/' + repo + '/contents/' + path;

    onProgress('Verbindung zu GitHub wird aufgebaut...');

    // 1. Fetch current question bank file
    fetch(url, {
      method: 'GET',
      headers: getApiHeaders(token)
    })
    .then(function (res) {
      if (!res.ok) {
        throw new Error('Datei ' + path + ' konnte nicht geladen werden. Status: ' + res.status);
      }
      return res.json();
    })
    .then(function (fileData) {
      onProgress('Bestehende Aufgabenbank geladen. Analysiere Struktur...');
      var sha = fileData.sha;
      var fileContent = btou(fileData.content);

      // Find the last closing brace '}' that ends the last object in push( ... )
      var lastBrace = fileContent.lastIndexOf('}');
      if (lastBrace === -1) {
        throw new Error('Ungültiges Aufgabenbank-Format (keine schließende Klammer } gefunden).');
      }

      // Format question object with trailing indentations
      var qStr = JSON.stringify(q, null, 2);

      // Inject the question as the new last element of the push array
      var updated = fileContent.substring(0, lastBrace + 1) + ',\n  ' + qStr + fileContent.substring(lastBrace + 1);

      onProgress('Upload der aktualisierten Aufgabenbank...');

      // Push updated file back to GitHub
      return fetch(url, {
        method: 'PUT',
        headers: getApiHeaders(token),
        body: JSON.stringify({
          message: 'Admin Scan: Aufgabe ' + q.id + ' hinzugefügt',
          content: utob(updated),
          sha: sha
        })
      });
    })
    .then(function (res) {
      if (!res.ok) {
        throw new Error('Upload der Aufgabenbank fehlgeschlagen. Status: ' + res.status);
      }
      onProgress('Aufgabenbank aktualisiert! Aktualisiere Update-Status (update-check.json)...');
      
      // 2. Fetch update-check.json to bump version
      var updateUrl = 'https://api.github.com/repos/' + owner + '/' + repo + '/contents/update-check.json';
      return fetch(updateUrl, {
        method: 'GET',
        headers: getApiHeaders(token)
      }).then(function (res2) {
        if (res2.ok) return res2.json();
        return null;
      });
    })
    .then(function (updateData) {
      if (!updateData) {
        onSuccess();
        return;
      }

      var sha = updateData.sha;
      var currentCheck = JSON.parse(btou(updateData.content));
      
      // Bump patch version (e.g. 9.1.0 -> 9.1.1)
      var vParts = currentCheck.version.split('.');
      if (vParts.length === 3) {
        vParts[2] = String(Number(vParts[2]) + 1);
        currentCheck.version = vParts.join('.');
      } else {
        currentCheck.version = '9.1.1';
      }
      currentCheck.date = new Date().toISOString().split('T')[0];
      currentCheck.message = 'V' + currentCheck.version + ': Admin-Upload neue Aufgabe (' + q.id + ').';
      currentCheck.label = 'V' + currentCheck.version + ' Release Update';

      var updateUrl = 'https://api.github.com/repos/' + owner + '/' + repo + '/contents/update-check.json';
      
      return fetch(updateUrl, {
        method: 'PUT',
        headers: getApiHeaders(token),
        body: JSON.stringify({
          message: 'Admin Scan: Version-Bumping auf ' + currentCheck.version,
          content: utob(JSON.stringify(currentCheck, null, 2)),
          sha: sha
        })
      });
    })
    .then(function (res) {
      if (res && !res.ok) {
        console.warn('Update-check.json konnte nicht aktualisiert werden, die Fragenbank wurde jedoch gespeichert.');
      }
      onSuccess();
    })
    .catch(function (err) {
      onError(err && err.message ? err.message : 'Unbekannter API-Fehler');
    });
  }

  return {
    publishQuestion: publishQuestion
  };
})();

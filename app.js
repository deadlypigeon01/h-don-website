(function () {
  // Kontaktformular: Submission an die HubSpot Forms API (kein Embed-Script, keine Cookies).
  var HS_URL = 'https://api-eu1.hsforms.com/submissions/v3/integration/submit/148321681/899cf51d-01e0-4478-83f9-d83457cd53a9';
  var form = document.getElementById('kontakt-form');
  if (form) {
    form.hidden = false; // ohne JavaScript bleibt das Formular ausgeblendet (siehe noscript-Hinweis)
    var danke = document.getElementById('danke');
    var fehler = document.getElementById('fehler');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.querySelector('.hp').checked) return; // Honeypot
      var teile = document.getElementById('kf-name').value.trim().split(/\s+/).filter(Boolean);
      var nachname = teile.length ? teile[teile.length - 1] : '';
      var vorname = teile.slice(0, -1).join(' ');
      var felder = [
        { objectTypeId: '0-1', name: 'email', value: document.getElementById('kf-email').value.trim() },
        { objectTypeId: '0-1', name: 'lastname', value: nachname },
        { objectTypeId: '0-1', name: 'message', value: document.getElementById('kf-nachricht').value.trim() }
      ];
      if (vorname) felder.push({ objectTypeId: '0-1', name: 'firstname', value: vorname });
      var btn = form.querySelector('button[type="submit"]');
      var btnText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Wird gesendet …';
      fetch(HS_URL, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: felder,
          context: { pageUri: 'https://h-don.de/', pageName: 'H-DON · Kontakt' }
        })
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        form.reset();
        fehler.hidden = true;
        danke.hidden = false;
        danke.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }).catch(function () {
        fehler.hidden = false;
      }).then(function () {
        btn.disabled = false;
        btn.textContent = btnText;
      });
    });
  }
})();

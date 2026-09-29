/* Launch page for « Voir chez vous »: ?m=<code>_<moyen|grand>_<passe-partout|dibond|caisse-noir|caisse-blanc|caisse-chene>
 * iPhone and iPad: AR Quick Look on the USDZ, wall-anchored, true size (allowsContentScaling=0). Quick Look only
 *   opens from a tap, so the page shows one button (the picture is also a rel="ar" link).
 * Android: Google Scene Viewer on the GLB, vertical placement, not resizable. The page tries to open it at once;
 *   Chrome may require a tap, so the same button stays.
 * Anything else: the page says to open it on a phone. */
(function () {
  'use strict';
  var PRES = {
    'passe-partout': 'Papier Fine Art et passe-partout', 'dibond': 'Dibond',
    'caisse-noir': 'Dibond en caisse américaine, noir satiné', 'caisse-blanc': 'Dibond en caisse américaine, blanc satiné',
    'caisse-chene': 'Dibond en caisse américaine, chêne brut',
  };
  var FORMAT = { moyen: 'Moyen', grand: 'Grand' };
  var $ = function (s) { return document.querySelector(s); };
  var params = new URLSearchParams(location.search);
  var key = (params.get('m') || '').toLowerCase();
  var m = key.match(/^([a-z0-9-]+)_(moyen|grand)_(passe-partout|dibond|caisse-(?:noir|blanc|chene))$/);
  var msg = $('[data-msg]'), go = $('[data-go]');
  var say = function (t) { msg.textContent = t; };

  function device() {
    var a = document.createElement('a');
    return {
      quickLook: !!(a.relList && a.relList.supports && a.relList.supports('ar')),
      android: /android/i.test(navigator.userAgent),
    };
  }

  function sceneViewer(glb, title, link) {
    var q = new URLSearchParams({ file: glb, mode: 'ar_preferred', enable_vertical_placement: 'true', resizable: 'false', disable_occlusion: 'true', title: title.slice(0, 60), link: link });
    var fallback = link + (link.indexOf('?') >= 0 ? '&' : '?') + 'auto=0';
    return 'intent://arvr.google.com/scene-viewer/1.2?' + q.toString() +
      '#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;' +
      'S.browser_fallback_url=' + encodeURIComponent(fallback) + ';end;';
  }

  // Say so when the AR viewer did not take over the screen.
  function watch(text) {
    var left = false;
    var mark = function () { left = true; };
    document.addEventListener('visibilitychange', mark, { once: true });
    window.addEventListener('pagehide', mark, { once: true });
    window.addEventListener('blur', mark, { once: true });
    setTimeout(function () { if (!left) say(text); }, 3500);
  }

  function render(works) {
    var w = m && works[m[1]];
    var v = w && w.variants[m[2] + '_' + m[3]];
    if (!v) {
      $('[data-lead]').textContent = 'Cette adresse ne mène à aucune œuvre. Le QR code a peut-être été mal lu, et vous pouvez le scanner à nouveau.';
      return;
    }
    document.title = 'Voir « ' + w.title + ' » sur votre mur · Galerie Artwave';
    $('[data-title]').textContent = '« ' + w.title + ' »';
    $('[data-meta]').textContent = FORMAT[m[2]] + ' · ' + v.dims + ' · ' + PRES[m[3]];
    var base = new URL('models/' + m[1] + '/' + key, location.href).href;
    var usdz = base + '.usdz#allowsContentScaling=0', glb = base + '.glb';
    var page = location.href.split('#')[0].replace(/[?&]auto=0/, '');

    var img = new Image();
    img.src = 'thumbs/' + m[1] + '.jpg';
    img.alt = w.title + ', ' + w.series;
    img.width = w.tw; img.height = w.th;
    var d = device();
    if (d.quickLook) {
      var a = document.createElement('a');
      a.rel = 'ar'; a.href = usdz; a.setAttribute('aria-label', 'Placer « ' + w.title + ' » sur mon mur');
      a.appendChild(img);
      $('[data-wall]').appendChild(a);
      go.hidden = false;
      go.addEventListener('click', function () {
        a.click();
        watch('Rien ne s’est ouvert ? Ouvrez cette page dans Safari, sur un iPhone ou un iPad récent.');
      });
    } else if (d.android) {
      $('[data-wall]').appendChild(img);
      var open = function () {
        location.href = sceneViewer(glb, w.title, page);
        watch('Si rien ne s’ouvre, touchez le bouton ci-dessus. Ce téléphone n’est peut-être pas compatible avec la réalité augmentée de Google (ARCore).');
      };
      go.hidden = false;
      go.addEventListener('click', open);
      if (params.get('auto') !== '0') { try { open(); } catch (e) { /* Chrome wants a tap: the button stays */ } }
    } else {
      $('[data-wall]').appendChild(img);
      $('[data-lead]').textContent = 'Ouvrez cette page sur un iPhone, un iPad ou un téléphone Android, et l’œuvre apparaîtra sur votre mur, à sa taille réelle.';
    }
  }

  fetch('works.json').then(function (r) { return r.json(); }).then(render).catch(function () {
    say('La page n’a pas pu se charger. Vérifiez la connexion, puis rechargez-la.');
  });
})();

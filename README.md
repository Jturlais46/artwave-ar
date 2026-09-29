# artwave-ar

The augmented reality models behind « Voir chez vous » in the Galerie Artwave prototype, served by GitHub Pages at https://jturlais46.github.io/artwave-ar/.

- `index.html?m=<code>_<format>_<presentation>` opens one artwork on the visitor's wall at true size: AR Quick Look on iPhone and iPad (one tap), Google Scene Viewer on Android (opens at once, or after one tap when Chrome asks for it). For example `?m=hz002_moyen_dibond`.
- `models/<code>/`: 9 models per artwork (Moyen: papier et passe-partout, Dibond, caisse américaine noir, blanc or chêne; Grand: Dibond and the three caisses), each as `.usdz` (iPhone) and `.glb` (Android), wall-anchored and not resizable.
- `thumbs/`, `works.json`, `manifest.csv`: the pictures, titles, sizes and the build report.

**Temporary host.** GitHub Pages refuses sites over 1 GB, so the artwork textures are capped at 1024 px (about 0.84 GB in all). At the launch of the real site, the models move to Shopify at full resolution.

The page is hidden from search engines (`noindex` on every page). The artwork images are the ones already published on galerie-artwave.fr, at a lower resolution. © Anne Turlais, all rights reserved.

Do not edit by hand. Everything here is generated from the GalerieArtwave repository by `scripts/ar/build_pages_site.py`.

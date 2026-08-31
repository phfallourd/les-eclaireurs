# Les Éclaireurs! — Application mobile (PWA)

Application installable destinée aux électriciens sur chantier. Elle donne
accès au catalogue de formations de la plateforme et aux hotlines fabricants.

## Stack

- React 18 + Vite 5
- PWA : `manifest.json` + service worker (mode hors ligne)
- Aucune dépendance UI externe

## Lancer en local

```bash
npm install
npm run dev
```

→ http://localhost:5173

## Le catalogue vient du repo principal

Les formations ne sont **pas** définies ici. La source unique de vérité est le
repo [`les-eclaireurs`](https://github.com/phfallourd/les-eclaireurs), dans
`src/data/catalog.js`. Ce repo publie le catalogue en JSON statique, que la PWA
récupère au runtime :

```
https://les-eclaireurs-two.vercel.app/data/catalog.json
```

**Pour ajouter ou modifier une formation, c'est dans le repo principal.**
Aucun déploiement de la PWA n'est nécessaire : elle verra la nouvelle formation
au prochain lancement.

### Robustesse hors ligne

Trois niveaux de repli, du plus frais au plus robuste :

1. **réseau** — catalogue à jour
2. **localStorage** — dernier catalogue vu par cet appareil
3. **`src/data/catalog-fallback.json`** — snapshot figé au build, utilisé
   uniquement au tout premier lancement sans réseau

Le snapshot peut dériver avec le temps. Pour le rafraîchir :

```bash
npm run sync-catalog
```

## État des fonctionnalités

| Écran | État |
|---|---|
| Catalogue (recherche, filtres, fiches, liens officiels) | fonctionnel |
| Hotline fabricants | fonctionnel (numéros réels, `tel:`) |
| Assistant terrain | aperçu — nécessite un backend |
| Réseau de pairs | aperçu — nécessite comptes et modération |

Les deux derniers écrans sont volontairement présentés comme non actifs plutôt
que simulés : en test terrain, un faux assistant ou de faux profils fausseraient
les retours des utilisateurs.

## Déploiement

Vercel, build automatique sur `main`.

- Build : `npm run build`
- Sortie : `dist/`

`vercel.json` gère les en-têtes du service worker (`no-cache`, indispensable
pour que les mises à jour parviennent aux utilisateurs) et les rewrites SPA.

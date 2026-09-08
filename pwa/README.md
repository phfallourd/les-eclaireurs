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
| Assistant terrain (texte + micro) | fonctionnel — moteur local, agent IA optionnel |
| Tutos vidéo (recherche, filtres, liens) | fonctionnel |
| Formations qualifiantes | fonctionnel |
| Mes formations (enregistrement) | fonctionnel — **local à l'appareil** |
| Hotline fabricants | fonctionnel (numéros réels, `tel:`) |
| Réseau de pairs | aperçu — nécessite comptes et modération |

### L'assistant terrain

Deux niveaux, l'application bascule automatiquement de l'un à l'autre :

**Par défaut — moteur de correspondance local.** Il tourne dans le téléphone,
sans réseau ni clé d'API. Il reconnaît le vocabulaire de chantier (« borne
22 kW », « PAC air/eau », « witty ») et oriente vers les vidéos et formations
correspondantes. Ce n'est pas un modèle de langage : il ne rédige pas de
réponse, il aiguille. C'est déjà l'essentiel du besoin d'orientation.

**En option — agent conversationnel.** `api/assistant.js` est une fonction
serverless prête à déployer. Tant que la variable d'environnement
`ANTHROPIC_API_KEY` n'est pas définie, elle renvoie 501 et l'app reste sur son
moteur local. Pour l'activer :

1. Vercel → projet PWA → Settings → Environment Variables
2. Ajouter `ANTHROPIC_API_KEY`
3. Redéployer

La clé reste côté serveur et n'est jamais exposée au navigateur. Attention au
coût : chaque question consomme des jetons. Prévoir une limitation par appareil
avant toute ouverture large.

Le prompt système encadre les réponses : pas de procédure d'intervention sous
tension, rappel de l'habilitation requise, rappel de l'obligation de
qualification IRVE au-delà de 3,7 kW, et renvoi vers la hotline ou un bureau de
contrôle quand la question sort du champ de la formation.

### La dictée vocale

Utilise l'API Web Speech du navigateur. Le bouton micro n'apparaît que si le
navigateur la supporte — correct sur Chrome/Android et Safari iOS récent,
absent sur Firefox. La reconnaissance transite par les serveurs du navigateur
(Google ou Apple selon la plateforme), pas par nos services.

### Le profil et « Mes formations »

**Limite importante :** le profil et les formations enregistrées sont stockés
sur le téléphone uniquement. Ils ne sont **pas** synchronisés avec la version
web : les deux applications sont servies depuis des domaines différents, et
deux origines distinctes ne peuvent pas partager le stockage du navigateur.

Une vraie synchronisation demandera :

1. une authentification (comptes utilisateurs),
2. une base de données côté serveur,
3. le remplacement du stockage local par des appels API.

En attendant, le bouton « Partager ma sélection » permet à l'électricien de
s'envoyer sa liste (partage natif iOS/Android, ou copie dans le presse-papier).

## Déploiement

Vercel, build automatique sur `main`.

- Build : `npm run build`
- Sortie : `dist/`

`vercel.json` gère les en-têtes du service worker (`no-cache`, indispensable
pour que les mises à jour parviennent aux utilisateurs) et les rewrites SPA.

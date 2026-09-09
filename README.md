# Les Éclaireurs!

Plateforme de montée en compétences de la filière électrique française.
Deux applications, une seule base de données.

```
site/   Plateforme web — catalogue, parcours, communauté, événements, financement
pwa/    Assistant terrain — application mobile installable (assistant, tutos, pairs, hotline)
```

## Base de données

Les deux applications lisent le même projet Supabase (`Les Eclaireurs!`, région
eu-west-1). Le catalogue est servi par une fonction SQL unique :

```
GET https://eutjonpxqoxldrkhxjzt.supabase.co/rest/v1/rpc/catalogue_json
```

Elle renvoie le document complet — `courses`, `sources`, `themes`, `formats`,
`regions` — au format que les deux applications consommaient déjà. Une formation
ajoutée en base apparaît des deux côtés sans redéploiement.

L'authentification est partagée : un électricien crée son compte sur le site ou
dans l'application, et retrouve son profil et ses formations enregistrées dans
les deux.

La clé publiable est publique par conception : la sécurité repose sur les
politiques RLS de la base. La clé `service_role` ne doit jamais figurer ici.

## Développement

```bash
cd site && npm install && npm run dev    # http://localhost:5173
cd pwa  && npm install && npm run dev    # http://localhost:5173
```

Aucune variable d'environnement n'est nécessaire : les valeurs Supabase ont une
valeur par défaut dans le code. `VITE_SUPABASE_URL` et
`VITE_SUPABASE_PUBLISHABLE_KEY` permettent de pointer vers un autre projet.

## Déploiement

Dépôt unique : `github.com/phfallourd/les-eclaireurs`. Deux projets Vercel,
chacun avec son **Root Directory** :

| Projet Vercel        | Root Directory | Domaine                         |
| -------------------- | -------------- | ------------------------------- |
| les-eclaireurs-two   | `site`         | les-eclaireurs-two.vercel.app   |
| les-eclaireurs-pwa   | `pwa`          | les-eclaireurs-pwa.vercel.app   |

Chaque projet ne se redéploie que si son dossier a changé (option
« Only build if there are changes in the Root Directory »).

Les noms des projets Vercel (`les-eclaireurs-two`, `les-eclaireurs-pwa`) datent
d'avant la réorganisation en dépôt unique. Les renommer changerait les
domaines `.vercel.app` communiqués aux testeurs : à faire seulement après la
phase de test, ou en posant un domaine propre.


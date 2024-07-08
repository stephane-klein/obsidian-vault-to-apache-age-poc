---
title: Projet 7 - "Améliorer et mettre à jour le projet restic-pg_dump-docker"
aliases:
  - Projet 7 - "Améliorer et mettre à jour le projet restic-pg_dump-docker"
tags:
  - backup
  - admin-sys
  - docker
  - project-completed
---
Date de la création de cette note : 2024-06-05.

**Ce projet est terminé :** voir [[2024-07-06_1116]].

**Quel est l'objectif de ce projet ?**

Bien que j'aie beaucoup travaillé de décembre 2023 janvier 2024 sur le projet [Implémenter un POC de pgBackRest](https://github.com/stephane-klein/backlog/issues/322), je souhaite mettre à jour et améliorer le repository [`restic-pg_dump-docker`](https://github.com/stephane-klein/restic-pg_dump-docker).

Quelques tâches à réaliser :

- [x] Mettre à jour tous les composants ;
- [x] Publier le `Dockerfile` de [`stephaneklein/restic-backup-docker`](https://github.com/stephane-klein/restic-pg_dump-docker/blob/f18f28ab4ccdb3e998eadf423f4964f63584dc4f/Dockerfile#L3) ;
- [ ] Réaliser et publier un screencast ;
- [x] Améliorer le `README.md`.

**Pourquoi je souhaite réaliser ce projet ?**

Pourquoi continuer ce projet alors que j'ai travaillé sur [[pgBackRest]] qui semble bien mieux ?

Pour plusieurs raisons :

- Je ne peux pas installer [[pgBackRest]] dans un « sidecar container Docker » — en tout cas, je n'ai pas trouvé comment réaliser cela 🤷‍♂️. [Je dois utiliser un container Docker PostgreSQL qui intègre pgBackRest](https://github.com/stephane-klein/poc-pgbackrest/blob/main/Dockerfile).
- Pour le moment, je ne comprends pas très bien la taille consommée par les "WAL segments" sauvegardés dans les buckets.
- Pour le moment, je ne sais pas combien de temps prend la restauration d'un backup d'une base de données d'une taille supérieure à un test. Par exemple, combien de temps prend la restauration d'une base de données de 100 Mo 🤔.
- Je ne suis pas rassuré de devoir lancer un cron — [`supercronic`](https://github.com/stephane-klein/poc-pgbackrest/blob/bfa5eb505646c5790189bff6c4d0a775898747e8/Dockerfile#L12) — lancé par [`tini`](https://github.com/stephane-klein/poc-pgbackrest/blob/bfa5eb505646c5790189bff6c4d0a775898747e8/Dockerfile#L27C15-L27C19)

Bien que `pgBackRest` permette un backup en temps "réel" et est sans doute plus rapide que "ma" méthode "restic-pg_dump", pour toutes les raisons listée ci-dessus, je pense que la méthode "restic-pg_dump" est moins complexe à mettre en place et à utiliser.

#JeMeDemande si la fonctionnalité "incremental backups" la version 17 de PostgreSQL sera une solution plus pratique que [[pgBackRest]] et la méthode "restic-pg_dump" 🤔.

**Repository de ce projet :**

https://github.com/stephane-klein/restic-pg_dump-docker

Je vais travailler dans la branche nommée [`june-2024-working-session`](https://github.com/stephane-klein/restic-pg_dump-docker/tree/june-2024-working-session)

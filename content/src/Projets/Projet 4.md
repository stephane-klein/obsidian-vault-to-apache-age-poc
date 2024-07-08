---
title: Projet 4 - "Je souhaite apprendre les bases d'utilisation de Apache Age"
aliases:
  - Projet 4 - "Je souhaite apprendre les bases d'utilisation de Apache Age"
tags:
  - postgresql
  - graph
  - database
  - POC
  - coding
started_at: 2024-04-20
toggl_task: apache-age
---

Date de la création de cette note : 2024-05-02  
J'ai commencé ce projet le 20 avril 2024

**Quel est l'objectif de ce projet ?**

Je souhaite dans un premier temps être capable de reproduire ce que j'avais fait dans le projet [`neo4j-playground`](https://github.com/stephane-klein/neo4j-playground) et peut être même ensuite d'aller un peu plus loin dans mon apprentissage du [[Cypher|langage de Query Cypher]].

[[2024-05-02_2257|Voir le résulat de ce projet…]] 

**Pourquoi je souhaite réaliser ce projet ?**

J'ai envie d'ajouter à ma stack de compétence, un moteur de base de données orienté [[Graph]]. Idéalement, j'aimerais que ça soit [[Apache Age]] parce que c'est un projet libre et basé sur [[PostgreSQL]]. Cela me permettrait de facilement coupler les avantages d'une base de données relationnel avec une [[Graph|base de données Graph]].

**Repository de ce projet :**

https://github.com/stephane-klein/apache-age-playground

**Idées après ce projet :**

Si j'arrive à terminer ce projet, j'ai les idées suivantes :

- Écrire un script d'importation d'un vault [[Obsidian]] vers [[Apache Age]], avec importation des tags, alias. => voir [[Projet 5]]
- Écrire des scripts de benchmark pour comparer PostgreSQL vs Apache Age sur les aspects suivants : vitesse de lecture, vitesse d'écriture et espace disque consommé.
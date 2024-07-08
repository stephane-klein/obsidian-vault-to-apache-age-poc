---
title: Projet 8 - CodeMirror, conceal, Svelte"
aliases:
  - Projet 8 - "CodeMirror, conceal, Svelte"
---
Date de la création de cette note : mercredi 3 juillet 2024.

**Quel est l'objectif de ce projet ?**

Je souhaite implémenter un éditeur Markdown dans une application web frontend utilisant [[Svelte]]. Cet éditeur doit supporter la fonctionnalité de [[conceal]] en utilisant la librairie [[CodeMirror]].

Plus précisément, mon objectif est de reproduire le comportement des ["liens internes avec texte d'affichage"](https://help.obsidian.md/Linking+notes+and+files/Internal+links#Change+the+link+display+text) de [[Obsidian]]. Cela signifie que lorsque le curseur de l'éditeur n'est pas positionné sur la ligne contenant `[[foobar|title]]`, seul `title` est affiché avec un style spécifique. Lorsque le curseur se trouve sur la ligne de `[[foobar|title]]`, alors `[[foobar|title]]` est affiché intégralement.

Ce projet est en lien avec [[Projet 1|Projet 1 - "CodeMirror, autocomplétion, Svelte"]].

**Pourquoi je souhaite réaliser ce projet ?**

J'ai besoin d'implémenter une fonctionnalité [[Conceal]] dans l'application [[Value Props]].

**Repository de ce projet :**

https://github.com/stephane-klein/svelte-codemirror-conceal-poc (non publié pour le moment)


# Import Obsidian vault to Apache Age

In this project, I want to try and import an [Obsidian](https://obsidian.md/) vault into an [Apache Age](https://age.apache.org/) graph-oriented database.

```sh
$ mise install
$ pnpm install
$ docker compose up -d --wait
```

```sh
$ ./scripts/enter-in-pg.sh -f init.sql
$ ./import.js
```

## Age Viewer

```sh
$ firefox http://localhost:3000/
```

<img src="screenshots/connect-to-database.png" />

Run the following queries either in Age Viewer or in the psql command prompt:

```
$ ./scripts/enter-in-pg.sh
```

```sql
SET search_path = ag_catalog, "$user", public;
SELECT *
FROM cypher('graph', $$
    MATCH (note:Note)
    WITH note.file_name AS file_name, note.file_path AS file_path
    ORDER BY note.file_name
    RETURN file_name, file_path
$$) as (file_name agtype, file_path agtype);
```

<img src="screenshots/execute-query.png" />

Query all tags:

```sql
SELECT *
FROM ag_catalog.cypher('graph', $$
    MATCH (note:Tag)
    RETURN note.file_name
$$) as (file_name ag_catalog.agtype);
```

Query notes and tags:

```sql
SELECT note_file_name, tag_name
FROM ag_catalog.cypher('graph', $$
    MATCH (note:Note)-[:LABELED_BY]->(tag:Tag)
    RETURN note.file_name AS note_file_name, tag.name AS tag_name
$$) as (note_file_name ag_catalog.agtype, tag_name ag_catalog.agtype);
```

Query notes linked to `SvelteKit`:

```sql
SELECT file_name
FROM ag_catalog.cypher('graph', $$
    MATCH (note:Note)-[:LINKED_TO]->(note2:Note {file_name: "SvelteKit.md"})
    RETURN note.file_name
$$) as (file_name ag_catalog.agtype);
```

## Generate html from note path

```sh
$ ./render.js content/src/Notes\ éphémères/2024-05-02_1937.md
```

## Execute tests

```
$ pnpm run tests
```

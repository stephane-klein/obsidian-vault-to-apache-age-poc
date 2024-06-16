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

```sql
SELECT *
FROM cypher('graph', $$
    MATCH (note:Note)
    RETURN note.filename
$$) as (edges agtype);
```

<img src="screenshots/execute-query.png" />

#!/usr/bin/env node
import { glob } from "glob";
import matter from "gray-matter";
import yaml from "js-yaml";
import postgres from "postgres";

const sql = postgres(
    process.env.POSTGRES_ADMIN_URL || "postgres://postgres:password@localhost:5432/postgres",
    {
        connection: {
            search_path: "ag_catalog"
        }
    }
);

for await (const filename of (await glob("content/**/*.md"))) {
    const data = matter.read(filename, {
        engines: {
            yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA })
        }
    });
    await sql.unsafe(`
        SELECT *
        FROM cypher('graph', $$
            MERGE (n:Note {filename: '${filename}', title: '${data.data.title}'})
        $$) AS (v agtype);
    `);
    const noteId = (await sql`
        INSERT INTO public.notes
        (
            filename,
            content
        )
        VALUES(
            ${filename},
            ${data.content}
        )
        ON CONFLICT (filename) DO UPDATE
            SET content=${data.content}
        RETURNING id
    `)[0].id;

    await sql`
        DELETE FROM public.note_aliases WHERE note_id=${noteId}
    `;
    if (data.data.aliases) {
        for await (const name of data.data.aliases) {
            await sql`
                INSERT INTO public.note_aliases
                (
                    note_id,
                    name
                )
                VALUES (
                    ${noteId},
                    ${name}
                )
            `;
        };
    }

    if (data.data.tags) {
        for await (const tagName of data.data.tags) {
            await sql.unsafe(`
                SELECT *
                FROM cypher('graph', $$
                    MATCH
                        (n:Note)
                    WHERE
                        n.filename = '${filename}'

                    CREATE (
                        t:Tag
                        {
                            name: '${tagName}'
                        }
                    )

                    CREATE
                        (n)-[:LABELED_BY]->(t)
                $$) AS (v agtype)
            `);
        };
    }
};

sql.end();

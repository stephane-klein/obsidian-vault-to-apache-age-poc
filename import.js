#!/usr/bin/env node
import { glob } from "glob";
import path from "path";
import matter from "gray-matter";
import yaml from "js-yaml";
import postgres from "postgres";
import { extractLinks } from "./utils.js";

const sql = postgres(
    process.env.POSTGRES_ADMIN_URL || "postgres://postgres:password@localhost:5432/postgres",
    {
        connection: {
            search_path: "ag_catalog"
        }
    }
);

await sql.unsafe(`
    DELETE FROM public.notes CASCADE;
    SELECT drop_graph('graph', true);
    SELECT create_graph('graph');
`);

for await (const filePath of (await glob("content/**/*.md"))) {
    const data = matter.read(filePath, {
        engines: {
            yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA })
        }
    });
    console.log(`Import ${filePath}`);
    const fileName = path.basename(filePath);
    const node = (await sql.unsafe(`
        SELECT *
        FROM cypher('graph', $$
            MATCH (note:Note {file_name: '${fileName.replace(/'/g, "\\'")}'})
            RETURN note
        $$) AS (note agtype)
    `))[0]?.note;
    if (node) {
        await sql.unsafe(`
            SELECT *
            FROM cypher('graph', $$
                MATCH (n:Note {file_name: '${fileName.replace(/'/g, "\\'")}'})
                SET n += {
                    file_path: '${filePath.replace(/'/g, "\\'")}',
                    title: '${(data.data?.title || path.parse(fileName).name) .replace(/'/g, "\\'") }'
                }
            $$) AS (v agtype);
        `);
    } else {
        await sql.unsafe(`
            SELECT *
            FROM cypher('graph', $$
                MERGE (
                    n:Note {
                        file_path: '${filePath.replace(/'/g, "\\'")}',
                        file_name: '${fileName.replace(/'/g, "\\'")}',
                        title: '${(data.data?.title || path.parse(fileName).name) .replace(/'/g, "\\'") }'
                    }
                )
            $$) AS (v agtype);
        `);
    }

    const noteId = (await sql`
        INSERT INTO public.notes
        (
            file_path,
            content
        )
        VALUES(
            ${filePath},
            ${data.content}
        )
        ON CONFLICT (file_path) DO UPDATE
            SET content=${data.content}
        RETURNING id
    `)[0].id;

    await sql`
        DELETE FROM public.note_aliases WHERE note_id=${noteId}
    `;
    if (data.data.aliases) {
        for await (const name of (typeof data.data.aliases === 'string' ? [data.data.aliases] : data.data.aliases)) {
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
                ON CONFLICT DO NOTHING
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
                        n.file_path = '${filePath.replace(/'/g, "\\'")}'

                    CREATE (
                        t:Tag
                        {
                            name: '${tagName.replace(/'/g, "\\'")}'
                        }
                    )

                    CREATE
                        (n)-[:LABELED_BY]->(t)
                $$) AS (v agtype)
            `);
        };
    }

    for await (const WikiLink of extractLinks(data.content)) {
        const node = (await sql.unsafe(`
            SELECT *
            FROM cypher('graph', $$
                MATCH (n:Note {file_name: '${WikiLink.replace(/'/g, "\\'")}.md'})
                RETURN n
            $$) AS (note agtype)
        `))[0]?.note;

        if (!node) {
            await sql.unsafe(`
                SELECT *
                FROM cypher('graph', $$
                    MERGE (
                        n:Note {
                            file_name: '${WikiLink.replace(/'/g, "\\'")}.md',
                            title: '${(path.parse(WikiLink).name) .replace(/'/g, "\\'") }'
                        }
                    )
                $$) AS (v agtype);
            `);
        }

        await sql.unsafe(`
            SELECT *
            FROM cypher('graph', $$
                MATCH
                    (n1:Note)
                WHERE
                    n1.file_path = '${filePath.replace(/'/g, "\\'")}'

                MATCH (
                    n2:Note
                    {
                        file_name: '${WikiLink.replace(/'/g, "\\'")}.md'
                    }
                )

                CREATE
                    (n1)-[:LINKED_TO]->(n2)
            $$) AS (v agtype)
        `);
    }
};

sql.end();

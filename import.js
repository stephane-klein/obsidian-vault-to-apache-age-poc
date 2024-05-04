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
            CREATE (
                :Note
                {
                    filename: '${filename}',
                    title: '${data.data.title}'
                }
            )
        $$) AS (v agtype)
    `);
};

sql.end();

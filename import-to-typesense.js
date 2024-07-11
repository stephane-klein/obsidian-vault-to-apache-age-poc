#!/usr/bin/env node
import path from "path";
import { glob } from "glob";
import matter from "gray-matter";
import yaml from "js-yaml";

import Typesense from "typesense";

let client = new Typesense.Client({
  'nodes': [{
    'host': '127.0.0.1',
    'port': 8108,
    'protocol': 'http'
  }],
  'apiKey': 'xyz',
  'connectionTimeoutSeconds': 2
})

let notesSchema = {
    "name": "notes",
    "fields": [
        { "name": "filename", "type": "string", "index": false },
        { "name": "title", "type": "string" },
        { "name": "tags", "type": "string[]", "facet": true },
        { "name": "content", "type": "string" }
    ]
}

client.collections("notes").delete()

client.collections().create(notesSchema);

for await (const filename of (await glob("content/**/*.md"))) {
    const data = matter.read(filename, {
        engines: {
            yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA })
        }
    });
    console.log(`Import ${filename}`);

    client.collections("notes").documents().create({
        "filename": filename,
        "title": data.data?.title || path.basename(filename, path.extname(filename)),
        "tags": data.data?.tags || [],
        "content": data.content
    });
}

console.log(await client.keys().create({
  'description': 'Search-only key',
  'actions': ['documents:search'],
  'collections': ['notes']
}));

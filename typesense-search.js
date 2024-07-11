#!/usr/bin/env node
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

let result = await client.collections("notes")
    .documents()
    .search({
        "q": "Codemirror",
        "query_by": "title,content"
    });

console.dir(result, { depth: null });

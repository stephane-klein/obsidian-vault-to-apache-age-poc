#!/usr/bin/env node
import MarkdownIt from "markdown-it";
import wikirefs_plugin from "markdown-it-wikirefs";
import * as wikirefs from "wikirefs";
import { hashtag, spanHashAndTag } from "@fedify/markdown-it-hashtag";
import postgres from "postgres";
import stopmarkdown from "stopmarkdown";

const args = process.argv.slice(2);

const sql = postgres(
    process.env.POSTGRES_ADMIN_URL || "postgres://postgres:password@localhost:5432/postgres",
    {
        connection: {
            search_path: "ag_catalog"
        }
    }
);

const md = new MarkdownIt()
const options = {
  resolveHtmlHref: (_env, fname) => {
    const extname = wikirefs.isMedia(fname) ? path.extname(fname) : '';
    fname = fname.replace(extname, '');
    return '/' + fname.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + extname;
  },
  resolveHtmlText: (_env, fname) => fname.replace(/-/g, ' '),
  resolveEmbedContent: (_env, fname) => fname + ' content',
};
md.use(wikirefs_plugin, options);
md.use(hashtag, {
  link: (tag) => `/tags/${tag.substring(1)}`,
  linkAttributes: () => ({ class: "hashtag" }),
  label: spanHashAndTag,
});

const note = (await sql`
    SELECT content FROM public.notes WHERE file_path=${args[0]}
`)[0];

if (note) {
    console.log(
        md.render(note.content)
    );
    console.log(stopmarkdown(note.content));
}

sql.end();

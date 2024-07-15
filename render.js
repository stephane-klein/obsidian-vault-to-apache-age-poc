#!/usr/bin/env node
import MarkdownIt from "markdown-it";
import wikirefs_plugin from "markdown-it-wikirefs";
import * as wikirefs from 'wikirefs';
import { hashtag, spanHashAndTag } from "@fedify/markdown-it-hashtag";

const args = process.argv.slice(2);
console.log(args[0]);

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
  link: (tag) => `https://example.com/tags/${tag.substring(1)}`,
  linkAttributes: () => ({ class: "hashtag" }),
  label: spanHashAndTag,
});

console.log(
    md.render(`
# hello

Ha ha

[[Page 1]]

Para2 #tag1 text2
`)
);

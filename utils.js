import MarkdownIt from "markdown-it";
import wikirefs_plugin from "markdown-it-wikirefs";
import { hashtag, spanHashAndTag } from "@fedify/markdown-it-hashtag";
import path from "path";

function extractWikiLinksAndTagsFromTokens(tokens, links, tags) {
  tokens.forEach(token => {
    if (token.type === "wikilink_open") {
      const hrefIndex = token.attrIndex("filename");
      if (hrefIndex >= 0) {
        links.push(token.attrs[hrefIndex][1]);
      }
    }
    if (token.type === "hashtag") {
      const hrefIndex = token.attrIndex("href");
      if (hrefIndex >= 0) {
        tags.push(token.attrs[hrefIndex][1].substr(1));
      }
    }
    if (token.children) {
      extractWikiLinksAndTagsFromTokens(token.children, links, tags);
    }
  });
}

export function extractLinksAndTags(markdown) {
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
    md.use(hashtag);

    const links = [];
    const tags = [];
    const tokens = md.parse(markdown, {});
    extractWikiLinksAndTagsFromTokens(tokens, links, tags);
    return [links, tags];
}

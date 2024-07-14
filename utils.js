import MarkdownIt from "markdown-it";
import wikirefs_plugin from "markdown-it-wikirefs";
import path from "path";

function extractWikiLinksFromTokens(tokens, links) {
  tokens.forEach(token => {
    if (token.type === 'wikilink_open') {
      const hrefIndex = token.attrIndex('filename');
      if (hrefIndex >= 0) {
        links.push(token.attrs[hrefIndex][1]);
      }
    }
    if (token.children) {
      extractWikiLinksFromTokens(token.children, links);
    }
  });
}

export function extractLinks(markdown) {
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

    const links = [];
    const tokens = md.parse(markdown, {});
    //console.dir(tokens, {depth: null});
    extractWikiLinksFromTokens(tokens, links);
    return links;
}

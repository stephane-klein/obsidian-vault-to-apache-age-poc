import MarkdownIt from "markdown-it";
import wikirefs_plugin from "markdown-it-wikirefs";
import path from "path";

function tagLinksPlugin(md) {
    const tagPattern = /#([\wÀ-ÿ]+)/g;

    function linkifyTags(state) {
        const tokens = state.tokens;
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].type === 'inline') {
                const inlineTokens = tokens[i].children;
                for (let j = 0; j < inlineTokens.length; j++) {
                    if (inlineTokens[j].type === 'text') {
                        const text = inlineTokens[j].content;
                        const newTokens = [];
                        let lastIndex = 0;
                        let match;

                        while ((match = tagPattern.exec(text)) !== null) {
                            if (match.index > lastIndex) {
                                newTokens.push(
                                    new state.Token('text', '', 0, {
                                        content: text.slice(lastIndex, match.index)
                                    })
                                );
                            }

                            const tagName = match[1];
                            const linkToken = new state.Token('tag_open', 'a', 1);
                            linkToken.attrs = [['name', `${tagName}`]];
                            newTokens.push(linkToken);

                            newTokens.push(
                                new state.Token('text', '', 0, {
                                    content: `#${tagName}`
                                })
                            );

                            newTokens.push(new state.Token('link_close', 'a', -1));

                            lastIndex = tagPattern.lastIndex;
                        }

                        if (lastIndex < text.length) {
                            newTokens.push(
                                new state.Token('text', '', 0, {
                                    content: text.slice(lastIndex)
                                })
                            );
                        }

                        inlineTokens.splice(j, 1, ...newTokens);
                        j += newTokens.length - 1;
                    }
                }
            }
        }
    }

    md.core.ruler.push('linkify_tags', linkifyTags);
};

function extractWikiLinksAndTagsFromTokens(tokens, links, tags) {
  tokens.forEach(token => {
    if (token.type === 'wikilink_open') {
      const hrefIndex = token.attrIndex('filename');
      if (hrefIndex >= 0) {
        links.push(token.attrs[hrefIndex][1]);
      }
    }
    if (token.type === 'tag_open') {
      const hrefIndex = token.attrIndex('name');
      if (hrefIndex >= 0) {
        tags.push(token.attrs[hrefIndex][1]);
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
    md.use(tagLinksPlugin);

    const links = [];
    const tags = [];
    const tokens = md.parse(markdown, {});
    extractWikiLinksAndTagsFromTokens(tokens, links, tags);
    return [links, tags];
}

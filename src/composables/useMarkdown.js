import { marked } from 'marked';
import hljs from 'highlight.js';

export function useMarkdown() {
  marked.setOptions({
    highlight: function (code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    }
  });

  const renderContent = (content) => {
    if (typeof content === 'string') {
      return marked(content);
    }
    return content;
  };

  return {
    renderContent
  };
}
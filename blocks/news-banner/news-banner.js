import { fetchIndex, getLanguage } from '../../scripts/scripts.js';
import { fetchPlaceholders } from '../../scripts/lib-franklin.js';

function setNewsBanner(block, text, path, title, lm) {
  let date;
  if (lm) {
    const dt = new Date(lm * 1000);
    date = dt.toLocaleDateString(getLanguage(), { year: 'numeric', month: 'long', day: 'numeric' });
  } else {
    date = '';
  }

  const newsHTML = `<span>${text}</span> <span>${date}</span>
    <a href="${path}">${title}</a>`;
  block.innerHTML = newsHTML;
}

export async function setLatestNewsArticle(block, placeholders) {
  const json = await fetchIndex('query-index', `${getLanguage()}-search`);

  const result = json.data
    .filter((entry) => entry.path.includes('/news/'))
    .sort((x, y) => y.lastModified - x.lastModified);

  if (!result.length) {
    return;
  }

  const article = result[0];
  const newsTitle = article.pagename || article.title || article.breadcrumbtitle;

  setNewsBanner(block, placeholders.newstext, article.path, newsTitle, article.lastModified);
}

export default async function decorate(block) {
  const lang = getLanguage();
  const placeholders = await fetchPlaceholders(lang);

  // Initialize the news banner with empty content
  setNewsBanner(block, placeholders.newstext, '', '', undefined);

  // Update it with the news article asynchronously
  setLatestNewsArticle(block, placeholders);
}

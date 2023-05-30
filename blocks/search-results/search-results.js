import { getSearchWidget } from '../../scripts/common.js';

function getSearchParams() {
  const searchTerm = new URLSearchParams(window.location.search).get('s');
  return searchTerm;
}

async function searchPages(term) {
  const resp = await fetch(`${window.location.origin}/query-index.json`);
  const json = await resp.json();

  const result = json.data
    .filter((entry) => (entry.description + entry.title).toLowerCase()
      .includes(term.toLowerCase()));

  const div = document.createElement('div');

  const summary = document.createElement('h3');
  summary.className = 'search-summary';
  summary.innerHTML = `${result.length} result${result.length === 1 ? '' : 's'} found for "<strong>${term}</strong>"`;
  div.appendChild(summary);

  const firstPage = result.slice(0, 3);

  /* eslint-disable no-restricted-syntax */ // TODO
  for (const line of firstPage) {
    const res = document.createElement('div');
    res.className = 'search-result';
    const header = document.createElement('h3');
    const link = document.createElement('a');
    link.innerText = line.title;
    link.href = line.path;
    header.appendChild(link);
    res.appendChild(header);
    const para = document.createElement('p');
    para.innerText = line.description;
    res.appendChild(para);
    div.appendChild(res);
  }

  return div.children;
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const searchTerm = getSearchParams();

  block.innerHTML = '';
  block.append(getSearchWidget(searchTerm));

  if (searchTerm) {
    const results = await searchPages(searchTerm);
    block.append(...results);
  }
}

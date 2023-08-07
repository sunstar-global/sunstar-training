import {
  fetchIndex,
  fixExcelFilterZeroes,
  getLanguage,
  getLanguangeSpecificPath,
} from '../../scripts/scripts.js';
import { fetchPlaceholders } from '../../scripts/lib-franklin.js';

function prependSlash(path) {
  return path.startsWith('/') ? path : `/${path}`;
}

function renderBreadcrumb(breadcrumbs, block) {
  const li = document.createElement('li');
  li.classList.add('breadcrumb-item');

  li.innerHTML = (breadcrumbs.category_url_path || breadcrumbs.url_path) ? `
    <a href="${prependSlash(breadcrumbs.category_url_path ?? breadcrumbs.url_path)}">
        ${breadcrumbs.category_name ?? breadcrumbs.name}
    </a>
  ` : `${breadcrumbs.category_name ?? breadcrumbs.name}`;
  block.append(li);
}

async function createAutoBreadcrumb(block, placeholders) {
  const pageIndex = (await fetchIndex('query-index')).data;
  fixExcelFilterZeroes(pageIndex);
  const { pathname } = window.location;
  const pathSeparator = '/';
  // eslint-disable-next-line max-len
  const urlForIndex = (index) => prependSlash(pathname.split(pathSeparator).slice(1, index + 2).join(pathSeparator));
  const pathSplit = pathname.split(pathSeparator);

  const breadcrumbs = [
    {
      name: placeholders.hometext,
      url_path: `${getLanguangeSpecificPath(pathSeparator)}`,
    },
    ...pathSplit.slice(1, -1).map((part, index) => ({
      // get the breadcrumb title from the index; if the index does not contain it,
      // use the placeholders by appending '-title' to the part
      // if no breadcrumb title is found, skip the part (empty string)
      // eslint-disable-next-line max-len
      name: pageIndex.find((page) => page.path === urlForIndex(index))?.breadcrumbtitle ?? (placeholders[`${part}-title`] ?? ''),
      url_path: urlForIndex(index),
    })),
    {
      // eslint-disable-next-line max-len
      name: pageIndex.find((page) => page.path === urlForIndex(pathSplit.length - 1))?.breadcrumbtitle ?? pathSplit[pathSplit.length - 1],
    },
  ];
  breadcrumbs.forEach((crumb) => {
    if (crumb.name) {
      renderBreadcrumb(crumb, block);
    }
  });

  const breadcrumbContainer = document.querySelector('.section.breadcrumb-container');
  if (breadcrumbContainer) {
    breadcrumbContainer.classList.add('visible');
  }
  block.classList.add('visible');
}

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders(getLanguage());
  createAutoBreadcrumb(block, placeholders);
}

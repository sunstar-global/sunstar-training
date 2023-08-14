/* eslint-disable no-console */
import { fetchIndex } from '../../scripts/scripts.js';

const cachedResponses = {};
const brokenLinks = [];

function template() {
  return `
  <div class="container">
    <h2>Site Selector Search</h2>
    <form id="filterForm">
      <div class="form-group">
        <label for="desiredSelector">Desired Selector:</label>
        <input type="text" id="desiredSelector" name="desiredSelector" required>
        Few Examples:
        <table>
          <tr>
            <th>Item</th>
            <th>Selector</th>
          </tr>
          <tr>
            <td>Cards Block</td>
            <td><pre>.cards</pre></td>
          </tr>
          <tr>
            <td>Breadcrumb Block</td>
            <td><pre>.breadcrumb</pre></td>
          </tr>
        </table>
      </div>
      <button type="submit">Filter URLs</button>
      <h3>Results will appear below<h3>
      <h6>For the first search on page load, the search results take time (~ 1 minute) to appear. Subsequent searches would be faster.</h6>
    </form>
    <div id="spinner" class="spinner"></div>
    <div id="resultContainer"></div>
  </div>    `;
}

function replaceIndex(path) {
  if (path.endsWith('/index')) {
    return path.slice(0, -6);
  }
  return path;
}
function pathToUrl(path) {
  return `${window.location.origin}${replaceIndex(path)}`;
}

async function fetchHtml(url) {
  if (cachedResponses[url]) {
    return cachedResponses[url];
  }
  const response = await fetch(url);
  const html = await response.text();
  cachedResponses[url] = html;
  return html;
}

async function checkURLValidity(url) {
  const checkUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  try {
    const response = await fetch(checkUrl, {
      method: 'GET',
      redirect: 'follow',
    });
    return response.status;
  } catch (error) {
    console.error(`Error while checking validity of ${checkUrl}: ${error}`);
  }
  return 0;
}

function excludeDomain(url) {
  const excludedDomains = ['twitter.com',
    'facebook.com',
    'linkedin.com',
    'youtube.com',
    'mailto',
    'tel',
    'javascript',
    'amazon.com',
    'amazon.de',
    'instagram.com',
    'pinterest.com',
    'google.com',
    'www.invest-in-bavaria.com',
    'www.sunstarqais.com',
    'www.u-vix.com',
    'www.tsubamex.co.jp',
    'sunstar.com',
    'kukanjizai.com',
    'www.rinya.maff.go.jp',
    'www.sunstar-kc.jp',
    'www.sho-han.com',
    'www.braking.com',
    'sunstar-braking.com',
    'www.sunstarmoto.com',
    'corp.sunstar-engineering.com',
    'jp.sunstar-engineering.com',
    'store.sunstarqais.com',
    'www.daytona.co.jp',
    'bit.ly',
    'www.risesearch.it'];

  // eslint-disable-next-line no-restricted-syntax
  for (const excludedDomain of excludedDomains) {
    if (url.includes(excludedDomain)) {
      return true;
    }
  }
  return false;
}

async function checkBrokenLink(link, page) {
  if (!excludeDomain(link)) {
    // eslint-disable-next-line no-await-in-loop
    const respcode = await checkURLValidity(link);
    if (respcode !== 200) {
      brokenLinks.push({ url: link, respcode });
      console.log(`Broken link: ${link}, ${respcode}`);
      document.getElementById('invalid-links-count').textContent = parseInt(document.getElementById('invalid-links-count').textContent, 10) + 1;
      const brokenLinkRow = document.createElement('tr');

      const brokenLinkUrl = document.createElement('td');
      brokenLinkUrl.textContent = link;
      brokenLinkRow.appendChild(brokenLinkUrl);

      const brokenLinkRespCode = document.createElement('td');
      brokenLinkRespCode.textContent = respcode;
      brokenLinkRow.appendChild(brokenLinkRespCode);

      const brokenLinkPage = document.createElement('td');
      brokenLinkPage.textContent = page;
      brokenLinkRow.appendChild(brokenLinkPage);

      document.getElementById('brokenLinksTable').appendChild(brokenLinkRow);
    } else {
      console.log(`Valid link: ${link}, ${respcode}`);
      document.getElementById('valid-links-count').textContent = parseInt(document.getElementById('valid-links-count').textContent, 10) + 1;
    }
  }
}

async function checkBrokenLinks(matchingElements, page) {
  if (matchingElements && matchingElements.length > 0) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log('Checking broken links on page:', page);
    for (let i = 0; i < matchingElements.length; i += 1) {
      const el = matchingElements[i];
      if (el.tagName === 'A') {
        // eslint-disable-next-line no-await-in-loop
        await checkBrokenLink(el.href, page);
      }
    }
  }
}

async function searchForElement(url, selector) {
  const html = await fetchHtml(url);
  const element = document.createElement('div');
  element.innerHTML = html;

  // Modify the selector and condition based on your requirements
  const matchingElements = element.querySelectorAll(selector);
  checkBrokenLinks(matchingElements, url);
  return !!matchingElements && matchingElements.length > 0;
}

async function filterUrlsWithElement(urls, selector) {
  const filteredUrls = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const url of urls) {
    // eslint-disable-next-line no-await-in-loop
    const hasElement = await searchForElement(url, selector);
    if (hasElement) {
      filteredUrls.push(pathToUrl(url.replace('.plain.html', '')));
    }
  }

  return filteredUrls;
}

async function handleFormSubmit(event, urlList) {
  event.preventDefault();

  const form = event.target;
  const input = form.elements.desiredSelector;
  const desiredSelector = input.value;

  const container = document.getElementById('resultContainer');
  const brokenLinksContainer = document.createElement('div');
  brokenLinksContainer.classList.add('broken-links');
  const validLinksHeader = document.createElement('h5');
  validLinksHeader.textContent = 'Valid Links Count:';
  const validLinksCount = document.createElement('span');
  validLinksCount.id = 'valid-links-count';
  validLinksCount.textContent = 0;
  validLinksHeader.appendChild(validLinksCount);
  brokenLinksContainer.appendChild(validLinksHeader);

  const invalidLinksHeader = document.createElement('h5');
  invalidLinksHeader.textContent = 'Invalid Links Count:';
  const invalidLinksCount = document.createElement('span');
  invalidLinksCount.id = 'invalid-links-count';
  invalidLinksCount.textContent = 0;
  invalidLinksHeader.appendChild(invalidLinksCount);
  brokenLinksContainer.appendChild(invalidLinksHeader);

  const brokenLinksTable = document.createElement('table');
  brokenLinksTable.id = 'brokenLinksTable';
  const brokenLinksTableHeader = document.createElement('thead');
  const brokenLinksTableHeaderRow = document.createElement('tr');
  const brokenLinksTableHeaderCell1 = document.createElement('th');
  brokenLinksTableHeaderCell1.textContent = 'URL';
  const brokenLinksTableHeaderCell2 = document.createElement('th');
  brokenLinksTableHeaderCell2.textContent = 'Response Code';
  const brokenLinksTableHeaderCell3 = document.createElement('th');
  brokenLinksTableHeaderCell3.textContent = 'Page';
  brokenLinksTableHeaderRow.appendChild(brokenLinksTableHeaderCell1);
  brokenLinksTableHeaderRow.appendChild(brokenLinksTableHeaderCell2);
  brokenLinksTableHeaderRow.appendChild(brokenLinksTableHeaderCell3);
  brokenLinksTableHeader.appendChild(brokenLinksTableHeaderRow);
  brokenLinksTable.appendChild(brokenLinksTableHeader);
  brokenLinksContainer.appendChild(brokenLinksTable);

  container.appendChild(brokenLinksContainer);
  const spinner = document.getElementById('spinner');
  spinner.style.display = 'block';

  const filteredUrls = await filterUrlsWithElement(urlList, desiredSelector);

  const resultList = document.createElement('ul');
  resultList.textContent = 'Filtered URLs:';
  filteredUrls.forEach((url) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = url;
    a.textContent = url;
    li.appendChild(a);
    resultList.appendChild(li);
  });
  container.appendChild(resultList);
  spinner.style.display = 'none';
}

export default async function decorate(block) {
  const index = (await fetchIndex('query-index')).data;
  const urlList = index.map((item) => (item.path === '/' ? '/index.plain.html' : `${item.path}.plain.html`));
  block.innerHTML = template();
  block.querySelector('#filterForm').addEventListener('submit', (event) => {
    handleFormSubmit(event, urlList);
  });
}

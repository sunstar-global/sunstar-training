import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';

function decorateSocial(social) {
  social.classList.add('social');
  social.innerHTML = social.innerHTML.replace(/\[social\]/, '');
}

function decorateTopNav(nav) {
  nav.querySelectorAll(':scope>ul>li').forEach((li) => {
    if (li.textContent.trim() === '[social]') {
      decorateSocial(li);
    }
  });
}

function decorateMiddleNav() {
}

function decorateBottomNav() {

}

function getSearchWidget() {
  // TODO specify the correct language in the 'lang' input
  // TODO specify the correct language in the oninvalid property
  return `
    <form method="get" class="search" id="searchform" action="https://www.sunstar-engineering.com/">
    <div>
      <input type="hidden" name="lang" value="en">
      <input type="text" id="search" name="s" class="search-text" placeholder="Search" required="true" oninput="this.setCustomValidity('')" oninvalid="this.setCustomValidity('The Search field cannot be empty')">
      <button class="search-icon"></button>
    </div>
  </form>`;
}

function insertSearchWidget() {
  // Replace the <p>Search</p> text with the search box
  const searchP = Array.from(document.querySelectorAll('p'))
    .find(element => element.textContent === 'Search');
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = getSearchWidget();
  searchP.parentElement.replaceChild(tempDiv.firstElementChild, searchP);
}

const navDecorators = { 'nav-top': decorateTopNav, 'nav-middle': decorateMiddleNav, 'nav-bottom': decorateBottomNav };
/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  // TODO: remove this fallback once nav is in place
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    block.innerHTML = '';
    const html = await resp.text();
    const fetchedNav = document.createElement('div');
    fetchedNav.innerHTML = html;
    const navClasses = ['nav-top', 'nav-middle', 'nav-bottom'];
    navClasses.forEach((navClass, idx) => {
      const nav = document.createElement('nav');
      nav.classList.add(navClass);
      nav.innerHTML = fetchedNav.querySelectorAll(':scope>div')[idx].innerHTML;
      navDecorators[navClass](nav);
      block.appendChild(nav);
    });

    insertSearchWidget();

    decorateIcons(block);
  }
}

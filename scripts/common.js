function getSearchWidgetHTML(initialVal) {
  // TODO specify the correct language in the 'lang' input
  // TODO specify the correct language in the oninvalid property
  return `
    <form method="get" class="search" action="/search">
      <div>
        <input type="hidden" name="lang" value="en">
        <input type="text" name="s" value="${initialVal ?? ''}" class="search-text" placeholder="Search" required="true" oninput="this.setCustomValidity('')" oninvalid="this.setCustomValidity('The Search field cannot be empty')">
        <button class="search-icon"></button>
      </div>
    </form>`;
}

/**
 * Convert html in text form to document element
 * @param html the html to process
 * @returns A document element
 */
export function htmlToElement(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.firstElementChild;
}

export function getSearchWidget(initialVal) {
  return htmlToElement(getSearchWidgetHTML(initialVal));
}

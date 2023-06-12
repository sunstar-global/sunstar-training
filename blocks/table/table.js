export default async function decorate(block) {
  var tableDivHtml = '';
  [...block.children].forEach((child, i) => {
    [...child.children].forEach((childDiv) => {
      if (!i) childDiv.classList.add('table-head');
      tableDivHtml += childDiv.outerHTML;
    });
    if (block.getAttribute("style") === null) {
      block.setAttribute("style", "--col:" + [...child.children].length);
    }
  });
  block.innerHTML = '';
  block.innerHTML = tableDivHtml;
}
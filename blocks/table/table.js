export default async function decorate(block) {
  let tableDivHtml = '';
  [...block.children].forEach((child, i) => {
    [...child.children].forEach((childDiv) => {
      if (!i) childDiv.classList.add('table-head');
      tableDivHtml += childDiv.outerHTML;
    });
    if (block.getAttribute('style') === null) {
      const colLength = [...child.children].length.toString();
      block.setAttribute('style', `--col:${colLength}`);
    }
  });
  block.innerHTML = '';
  block.innerHTML = tableDivHtml;
}

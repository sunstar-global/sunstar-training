export default async function decorate(block) {
  let tableDivHtml = '';
  [...block.children].forEach((child, i) => {
    if (block.getAttribute('style') === null) {
      const rowLength = ([...block.children].length).toString();
      const rowLengthMinusOne = ([...block.children].length - 1).toString();
      block.setAttribute('style', `--row:${rowLength};--rowminus:${rowLengthMinusOne}`);
    }
    [...child.children].forEach((childDiv) => {
      if (!i) childDiv.classList.add('table-head');
      tableDivHtml += childDiv.outerHTML;
    });
    if (block.getAttribute('style') !== null && !block.getAttribute('style').includes('--col')) {
      const colLength = [...child.children].length.toString();
      const rowStyles = block.getAttribute('style');
      block.setAttribute('style', `${rowStyles};--col:${colLength}`);
    }
  });
  block.innerHTML = '';
  block.innerHTML = tableDivHtml;
}

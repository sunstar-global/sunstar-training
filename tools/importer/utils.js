/* global WebImporter */

export function addBreadCrumb(doc) {
  const breadcrumb = doc.querySelector('.section-breadcrumb');

  if (breadcrumb) {
    // Not removing breadcrumb section from here because we need to extract breadcrumb title.
    const cells = [['Breadcrumb']];
    const table = WebImporter.DOMUtils.createTable(cells, doc);
    breadcrumb.after(doc.createElement('hr'));
    breadcrumb.replaceWith(table);
  }
}

export function createSectionMetadata(cfg, doc) {
  const cells = [['Section Metadata']];
  Object.keys(cfg).forEach((key) => {
    cells.push([key, cfg[key]]);
  });
  return WebImporter.DOMUtils.createTable(cells, doc);
}

export function buildBlock(name, qualifiers, content, doc) {
  let cells;
  if (qualifiers) {
    cells = [[`${name}(${qualifiers.join(', ')})`]];
  } else {
    cells = [[name]];
  }

  content.querySelectorAll('.row').forEach((rowDiv) => {
    const row = [];
    rowDiv.querySelectorAll('.cell').forEach((cellDiv) => {
      if (cellDiv.textContent.trim() !== '') {
        row.push(cellDiv);
      }
    });
    if (row.length > 0) {
      cells.push(row);
    }
  });
  return WebImporter.DOMUtils.createTable(cells, doc);
}

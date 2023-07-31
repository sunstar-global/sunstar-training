/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

const createMetadata = (main, document) => {
  const meta = {};
  meta.robots = 'noindex';
  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  return meta;
};

function createSectionMetadata(cfg, doc) {
  const cells = [['Section Metadata']];
  Object.keys(cfg).forEach((key) => {
    cells.push([key, cfg[key]]);
  });
  return WebImporter.DOMUtils.createTable(cells, doc);
}

function addDetailPageNav(document) {
  const detailPageNav = document.querySelector('.mega-footer-container');
  detailPageNav.querySelectorAll('a').forEach((a) => {
    a.href = 'https://main--sunstar-engineering--hlxsites.hlx.live'.concat(a.href).replace(/\/$/, '');
  });
  detailPageNav.after(document.createElement('hr'));
  detailPageNav.after(createSectionMetadata({ Style: 'Primary' }, document));
}

function addCategoryNav(document) {
  const ul = document.createElement('ul');
  document.querySelectorAll('.footer-nav-links > a').forEach((a) => {
    a.href = 'https://main--sunstar-engineering--hlxsites.hlx.live'.concat(a.href).replace(/\/$/, '');
    const li = document.createElement('li');
    li.append(a);
    ul.append(li);
  });
  const navLinks = document.querySelector('.footer-nav-links');
  navLinks.after(document.createElement('hr'));
  navLinks.after(createSectionMetadata({ Style: 'Nav-Links' }, document));
  navLinks.replaceWith(ul);
  document.querySelector('.footer-mid.mobile-only').remove();
}

function addLogoAndSocial(document) {
  const logoContent = document.querySelector('.footer-mid.desktop-only');
  const sunstarGroupLink = logoContent.querySelector('a');
  sunstarGroupLink.textContent += ' :link-white:';
  logoContent.after(document.createElement('hr'));
  logoContent.after(createSectionMetadata({ Style: 'Groups' }, document));

  const socialContent = document.querySelector('.nav-container.social');
  const h6 = socialContent.querySelector('h6');
  const title = document.createElement('h1');
  title.textContent = h6.textContent;
  h6.replaceWith(title);
  socialContent.querySelectorAll('nav > a').forEach((a) => {
    const div = document.createElement('div');
    a.textContent = a.textContent === 'Linkedin' ? `:linkedin: ${a.textContent}` : `:youtube: ${a.textContent}`;
    div.append(a);
    socialContent.append(div);
  });
  socialContent.after(document.createElement('hr'));
  socialContent.after(createSectionMetadata({ Style: 'Social' }, document));
}

function addCopyright(document) {
  document.querySelectorAll('.footer-nav-bottom > nav > a').forEach((a) => {
    if (a.href === 'https://sunstar.integrityline.com/frontpage') {
      a.textContent += ' :link-white:';
      return;
    }
    a.href = 'https://main--sunstar-engineering--hlxsites.hlx.live'.concat(a.href).replace(/\/$/, '');
  });
  const copyRight = document.querySelector('.footer-nav-bottom');
  copyRight.after(document.createElement('hr'));
  copyRight.after(createSectionMetadata({ Style: 'Copyright' }, document));
}

function reorderContents(document) {
  const navLinks = document.querySelector('.footer-mega-menu-left-side > .footer-nav-links');
  const socialContent = document.querySelector('.nav-container.social');
  navLinks.after(socialContent);
}

function customImportLogic(document) {
  reorderContents(document);
  addDetailPageNav(document);
  addCategoryNav(document);
  addLogoAndSocial(document);
  addCopyright(document);
}

export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    // use helper method to remove header, footer, etc.
    WebImporter.DOMUtils.remove(main, [
      'noscript',
      'main > section',
      'main > div',
      'header',
    ]);

    customImportLogic(document);
    // create the metadata block and append it to the main element
    createMetadata(main, document);

    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
};

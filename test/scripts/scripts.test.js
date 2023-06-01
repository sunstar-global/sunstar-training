/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import { getDecodedString, htmlToElement } from '../../scripts/scripts.js';

describe('Scripts', () => {
  it('Decodes HTML strings', () => {
    expect(getDecodedString('hi there!')).to.equal('hi there!');
    expect(getDecodedString('a &amp; b')).to.equal('a & b');
  });

  it('Converts HTML to an element', () => {
    const el = htmlToElement('<div>hi</div>');
    expect(el.constructor.name).to.equal('HTMLDivElement');
  });
});

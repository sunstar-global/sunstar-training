import { sampleRUM, isInternalPage } from './lib-franklin.js';
// eslint-disable-next-line import/no-cycle
import { getEnvType, loadConsentManager, loadScript } from './scripts.js';
// Core Web Vitals RUM collection
sampleRUM('cwv');
async function loadAdobeLaunch() {
  const adobeotmSrc = {
    dev: 'https://assets.adobedtm.com/467469cdd595/f9651373cafd/launch-a46d93f0c752-development.min.js',
    preview: 'https://assets.adobedtm.com/467469cdd595/f9651373cafd/launch-8108dcbd2d02-staging.min.js',
    live: 'https://assets.adobedtm.com/467469cdd595/f9651373cafd/launch-9e812df82057.min.js',
  };
  await loadScript(adobeotmSrc[getEnvType()]);
}
window.addEventListener('consentmanager', () => {
  if (window.uc) {
    // unblock adobe launch
    window.uc?.deactivateBlocking(['f6nkjdUL']);
  }
});

/**
 * GA Tag
* */
function loadGAScript(url, callback) {
  const head = document.querySelector('head');
  let script = head.querySelector(`script[src="${url}"]`);
  if (!script) {
    script = document.createElement('script');
    script.src = url;
    script.async = true;
    head.append(script);
    script.onload = callback;
    return script;
  }
  return script;
}

async function loadGA() {
  const gaId = 'G-EBP844FZRJ';
  loadGAScript(`https://www.googletagmanager.com/gtag/js?id=${gaId}`, () => {
  // eslint-disable-next-line
    window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); } gtag('js', new Date()); gtag('config', gaId); ga('send', 'pageview'); ga('create', gaId, 'auto');
  });
}

/**
 * LinkedIn Pixel
* */
async function loadLinkedinPixel() {
  const scriptTag = document.createElement('script');
  scriptTag.innerHTML = `
    _linkedin_partner_id = "6858425";
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(_linkedin_partner_id);
    (function(l) {
    if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
    window.lintrk.q=[]}
    var s = document.getElementsByTagName("script")[0];
    var b = document.createElement("script");
    b.type = "text/javascript";b.async = true;
    b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
    s.parentNode.insertBefore(b, s);})(window.lintrk);
    `;
  document.head.prepend(scriptTag);
}

if (!isInternalPage()) {
  await loadConsentManager();
  await loadAdobeLaunch();
  if (getEnvType() === 'live') {
    await loadGA();
  }
  await loadLinkedinPixel();
}

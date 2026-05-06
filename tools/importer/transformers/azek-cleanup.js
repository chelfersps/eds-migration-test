/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AZEK Exteriors site-wide cleanup.
 * Removes non-authorable content from Sitefinity CMS pages.
 * All selectors verified against captured DOM in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove popup modals that overlay content and may interfere with block parsing
    // Found in DOM: <div class="trim-popup"> (line 201) and <div class="trim-popup-mobile"> (line 228)
    WebImporter.DOMUtils.remove(element, [
      '.trim-popup',
      '.trim-popup-mobile',
    ]);

    // Remove ASP.NET hidden form fields (line 189, 196)
    WebImporter.DOMUtils.remove(element, ['.aspNetHidden']);

    // Remove tracking pixels and iframes that appear before main content (lines 170-174)
    const trackingImgs = element.querySelectorAll('img[src*="insight.adsrvr.org"], img[src*="mdhv.io"]');
    trackingImgs.forEach((img) => img.remove());

    const trackingIframes = element.querySelectorAll('iframe[src*="insight.adsrvr.org"]');
    trackingIframes.forEach((iframe) => iframe.remove());
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove site header and navigation (line 312-714)
    // Found in DOM: <header> containing .inner-top-global, .azek-bp-global-nav, main nav
    WebImporter.DOMUtils.remove(element, ['header']);

    // Remove mobile navigation (line 258: <div id="mobile-nav">)
    WebImporter.DOMUtils.remove(element, ['#mobile-nav']);

    // Remove site footer (line 1199: <footer>)
    WebImporter.DOMUtils.remove(element, ['footer']);

    // Remove social share widget (line 1311: <div class="socials rrssb-buttons hidden" id="social-share-wrapper">)
    WebImporter.DOMUtils.remove(element, ['#social-share-wrapper']);

    // Remove lightbox overlays (lines 1329, 1349: <div class="lightbox ...">)
    WebImporter.DOMUtils.remove(element, ['.lightbox']);

    // Remove page loading overlay (line 1357: <div class="pageload-overlay">)
    WebImporter.DOMUtils.remove(element, ['.pageload-overlay']);

    // Remove Five9 chat widget elements (lines 1372-1377)
    WebImporter.DOMUtils.remove(element, [
      '#five9LiveChatWidget',
      '#five9OpenChatButton',
    ]);

    // Remove remaining tracking iframes (doubleclick, brandcdn) (lines 1379-1384)
    const trackingIframes = element.querySelectorAll(
      'iframe[src*="doubleclick.net"], iframe[src*="brandcdn.com"]'
    );
    trackingIframes.forEach((iframe) => iframe.remove());

    // Remove podscribe tracking pixel (line 1378)
    const podscribeImg = element.querySelector('#podscribe-request');
    if (podscribeImg) podscribeImg.remove();

    // Remove any remaining non-content iframes (not YouTube embeds which are authorable)
    const nonContentIframes = element.querySelectorAll('iframe:not([src*="youtube.com"]):not([src*="youtu.be"])');
    nonContentIframes.forEach((iframe) => iframe.remove());

    // Remove link elements (stylesheets) and noscript tags
    WebImporter.DOMUtils.remove(element, ['link', 'noscript']);
  }
}

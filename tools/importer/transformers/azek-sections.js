/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AZEK Exteriors section breaks and section metadata.
 * Inserts <hr> section dividers and Section Metadata blocks based on template sections.
 * Runs in afterTransform only.
 *
 * Uses programmatic section finding since CSS pseudo-selectors like :first-of-type
 * combined with :has() do not behave as filters in browser engines.
 *
 * Sections (from page-templates.json, selectors verified in cleaned.html):
 *   1. Hero Carousel: #hero-home (line 737)
 *   2. Value Proposition: first .sfContentBlock containing .mtls3.blueBG (line 864-865)
 *   3. Product Grid: .homeProducts (line 907)
 *   4. Video Section: .sfContentBlock containing .ccb_Headline (line 995-1000)
 *   5. Feature Cards: .sfContentBlock containing .mtls2 (line 1013-1014)
 *   6. Sustainability Stats: last .sfContentBlock containing .mtls3.blueBG (line 1055-1056)
 *   7. Additional Resources: .resources-home (line 1110)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) {
      return;
    }

    const doc = element.ownerDocument || document;
    const sections = template.sections;

    // Find section elements using robust programmatic matching
    // This handles selectors that use :first-of-type/:last-of-type with :has()
    // which do not work correctly as CSS selectors in browsers
    function findSectionElement(section) {
      const selectorStr = Array.isArray(section.selector) ? section.selector[0] : section.selector;

      // Section 1: #hero-home
      if (selectorStr === '#hero-home') {
        return element.querySelector('#hero-home');
      }

      // Section 3: .homeProducts
      if (selectorStr === '.homeProducts') {
        return element.querySelector('.homeProducts');
      }

      // Section 7: .resources-home
      if (selectorStr === '.resources-home') {
        return element.querySelector('.resources-home');
      }

      // Section 2: first .sfContentBlock containing .mtls3.blueBG
      if (selectorStr.includes('.mtls3.blueBG') && selectorStr.includes('first-of-type')) {
        const allBlueBG = element.querySelectorAll('.sfContentBlock .mtls3.blueBG');
        if (allBlueBG.length > 0) {
          return allBlueBG[0].closest('.sfContentBlock');
        }
        return null;
      }

      // Section 6: last .sfContentBlock containing .mtls3.blueBG
      if (selectorStr.includes('.mtls3.blueBG') && selectorStr.includes('last-of-type')) {
        const allBlueBG = element.querySelectorAll('.sfContentBlock .mtls3.blueBG');
        if (allBlueBG.length > 1) {
          return allBlueBG[allBlueBG.length - 1].closest('.sfContentBlock');
        }
        return null;
      }

      // Section 4: .sfContentBlock containing .ccb_Headline (or .videoWrapper which does not exist in DOM)
      if (selectorStr.includes('.ccb_Headline') || selectorStr.includes('.videoWrapper')) {
        const headline = element.querySelector('.ccb_Headline');
        if (headline) {
          return headline.closest('.sfContentBlock');
        }
        return null;
      }

      // Section 5: .sfContentBlock containing .mtls2
      if (selectorStr.includes('.mtls2')) {
        const mtls2 = element.querySelector('.mtls2');
        if (mtls2) {
          return mtls2.closest('.sfContentBlock');
        }
        return null;
      }

      // Fallback: try direct querySelector with each selector variant
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      for (const sel of selectors) {
        try {
          const el = element.querySelector(sel);
          if (el) return el;
        } catch (e) {
          // Invalid selector, skip
        }
      }
      return null;
    }

    // Process sections in reverse order to preserve DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = findSectionElement(section);

      if (!sectionEl) continue;

      // Add Section Metadata block after section content if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        if (sectionEl.nextSibling) {
          sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
        } else {
          sectionEl.parentNode.appendChild(sectionMetadata);
        }
      }

      // Insert <hr> before the section element (except the first section)
      if (i > 0) {
        const hr = doc.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}

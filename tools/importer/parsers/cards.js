/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards
 * Base block: cards
 * Source: https://www.azekexteriors.com/
 * Generated: 2026-05-06
 *
 * Handles two instance types:
 * 1. Product Grid (.azekHomeGrid) - a.ahg_Card elements with overlay content
 * 2. Resources (.resources-home .mtls4) - .mtls_Item elements with structured content
 *
 * Target structure per library example:
 * | Cards |  |
 * |---|---|
 * | image | heading + description + CTA link |
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which instance type we are parsing
  const isProductGrid = element.classList.contains('azekHomeGrid');
  const isResourceGrid = element.classList.contains('mtls4');

  if (isProductGrid) {
    // Instance 1: Product Grid (.azekHomeGrid)
    // Each card is an <a class="ahg_Card"> with an overlay and background image
    // Images may be <img> elements or CSS background-image on the card/child elements
    const cards = element.querySelectorAll('a.ahg_Card');

    cards.forEach((card) => {
      // First cell: image - try <img> first, then extract from inline background-image style
      let img = card.querySelector('img');

      if (!img) {
        // Try to find background-image in inline styles on the card or its children
        const bgEl = card.querySelector('[style*="background-image"]') || card;
        const style = bgEl.getAttribute('style') || '';
        const bgMatch = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
        if (bgMatch) {
          img = document.createElement('img');
          img.src = bgMatch[1];
          img.alt = '';
        }
      }

      // Second cell: heading + description + CTA link
      const heading = card.querySelector('h2, h3');
      const description = card.querySelector('p.body-copy, p.light, .ahg_Overlay p');
      const ctaText = card.querySelector('div.button, .btn-white');
      const href = card.getAttribute('href');

      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);

      // Create a proper link element for the CTA
      if (ctaText && href) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = ctaText.textContent.trim();
        const p = document.createElement('p');
        p.appendChild(link);
        contentCell.push(p);
      } else if (ctaText) {
        contentCell.push(ctaText);
      }

      // Build row: [image, content]
      if (img) {
        cells.push([img, contentCell]);
      } else {
        // No image available - use empty cell, content is still valuable
        const placeholder = document.createElement('span');
        cells.push([placeholder, contentCell]);
      }
    });
  } else if (isResourceGrid) {
    // Instance 2: Resources (.resources-home .mtls4)
    // Each card is a .mtls_Item with img, heading, body, and link
    const items = element.querySelectorAll('.mtls_Item');

    items.forEach((item) => {
      // First cell: image
      const img = item.querySelector('img.mtls_Img, img');

      // Second cell: heading + description + CTA link
      const heading = item.querySelector('h4.mtls_Subhead, h3, h4');
      const description = item.querySelector('p.mtls_Body, p');
      const link = item.querySelector('a.mtls_Link, a');

      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);
      if (link) contentCell.push(link);

      // Build row: [image, content]
      if (img) {
        cells.push([img, contentCell]);
      } else {
        const placeholder = document.createElement('span');
        cells.push([placeholder, contentCell]);
      }
    });
  } else {
    // Fallback: generic card detection
    // Try to find any repeating card-like elements
    const cardElements = element.querySelectorAll('[class*="card"], [class*="Card"], [class*="item"], [class*="Item"]');

    cardElements.forEach((card) => {
      const img = card.querySelector('img');
      const heading = card.querySelector('h2, h3, h4');
      const description = card.querySelector('p');
      const link = card.querySelector('a');

      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);
      if (link) contentCell.push(link);

      if (img || contentCell.length > 0) {
        cells.push([img || document.createElement('span'), contentCell]);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}

/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns variant.
 * Base block: columns
 * Source: https://www.azekexteriors.com/
 * Generated: 2026-05-06
 *
 * Handles two layout patterns:
 * 1. mtls3.blueBG - 3-column text layout with heading + description per column,
 *    optional intro section (h2 + paragraph), optional CTA row, optional disclaimer
 * 2. mtls2 - 2-column card layout with image + heading + description + link per column
 */
export default function parse(element, { document }) {
  // Determine the layout type based on class
  const isTwoColumn = element.classList.contains('mtls2');
  const isThreeColumn = element.classList.contains('mtls3');

  // Get all content items (each represents a column)
  const items = element.querySelectorAll('.mtls_Item');

  const cells = [];

  if (isTwoColumn) {
    // 2-column layout: each item has image + heading + description + link
    const row = [];
    items.forEach((item) => {
      const cellContent = [];

      // Image from .mtls_MediaWrapper
      const img = item.querySelector('.mtls_MediaWrapper .mtls_Img, .mtls_MediaWrapper img');
      if (img) cellContent.push(img);

      // Heading
      const heading = item.querySelector('.mtls_Subhead, h4, h3');
      if (heading) cellContent.push(heading);

      // Description
      const body = item.querySelector('.mtls_Body, .mtls_Copy p');
      if (body) cellContent.push(body);

      // Link from .mtls_Links
      const link = item.querySelector('.mtls_Links .mtls_Link, .mtls_Links a');
      if (link) cellContent.push(link);

      row.push(cellContent);
    });
    cells.push(row);
  } else if (isThreeColumn) {
    // 3-column layout: each item has heading + description
    const row = [];
    items.forEach((item) => {
      const cellContent = [];

      // Heading (h3 or h4)
      const heading = item.querySelector('.mtls_Subhead, h3, h4');
      if (heading) cellContent.push(heading);

      // Description
      const body = item.querySelector('.mtls_Body, .mtls_Copy p');
      if (body) cellContent.push(body);

      row.push(cellContent);
    });
    cells.push(row);

    // Optional CTA row - spans all columns
    const ctaRow = element.querySelector('.mtls_CTARow');
    if (ctaRow) {
      const ctaLink = ctaRow.querySelector('a.mtls_CTA, a');
      if (ctaLink) {
        cells.push([ctaLink]);
      }
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}

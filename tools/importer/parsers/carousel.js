/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel variant.
 * Base block: carousel
 * Source selector: #hero-home .slider.home-hero
 * Structure: Hero carousel with multiple slides. Each slide has a background image,
 * a heading, and an optional CTA link.
 *
 * Target table structure (from block library):
 * - Each row = one slide
 * - Cell 1: image
 * - Cell 2: heading + optional description + optional CTA link
 *
 * Generated: 2026-05-06
 */
export default function parse(element, { document }) {
  // Each slide is an .owl-item containing the slide content
  const slides = element.querySelectorAll('.owl-item');

  const cells = [];

  slides.forEach((slide) => {
    // Cell 1: Background image from .bg-img.style-bg
    // Use the first img (the visible one, not the lazy-load hidden duplicate)
    const bgImgContainer = slide.querySelector('.bg-img.style-bg');
    const img = bgImgContainer
      ? bgImgContainer.querySelector('img:not(.hidden-img)')
        || bgImgContainer.querySelector('img')
      : slide.querySelector('img');

    // Cell 2: Heading + CTA from .container > section.text
    const textSection = slide.querySelector('.container section.text, section.text');
    const heading = textSection
      ? textSection.querySelector('h2, h1, h3, [class*="home-head"]')
      : slide.querySelector('h2, h1, h3');
    const ctaLink = textSection
      ? textSection.querySelector('a.button, a.btn-secondary-grey, a[class*="btn"]')
      : slide.querySelector('a.button, a[class*="btn"]');

    // Build the content cell (heading + optional CTA)
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (ctaLink) contentCell.push(ctaLink);

    // Only add the row if we have at least an image or content
    if (img || contentCell.length > 0) {
      cells.push([img || '', contentCell.length > 0 ? contentCell : '']);
    }
  });

  // Fallback: if no .owl-item slides found, try .bg-img.style-bg as slide containers
  if (cells.length === 0) {
    const bgImgs = element.querySelectorAll('.bg-img.style-bg');
    bgImgs.forEach((bgImg) => {
      const img = bgImg.querySelector('img:not(.hidden-img)') || bgImg.querySelector('img');
      const textSection = bgImg.querySelector('.container section.text, section.text');
      const heading = textSection
        ? textSection.querySelector('h2, h1, h3')
        : null;
      const ctaLink = textSection
        ? textSection.querySelector('a.button, a[class*="btn"]')
        : null;

      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (ctaLink) contentCell.push(ctaLink);

      if (img || contentCell.length > 0) {
        cells.push([img || '', contentCell.length > 0 ? contentCell : '']);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
  element.replaceWith(block);
}

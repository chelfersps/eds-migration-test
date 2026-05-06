/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed variant.
 * Base block: embed
 * Source: https://www.azekexteriors.com/
 * Selector: .mts_Media.iframe iframe
 * Generated: 2026-05-06
 *
 * Extracts YouTube video URL from iframe src attribute and produces
 * an Embed block table with the video URL as a clickable link.
 */
export default function parse(element, { document }) {
  // The element may be the iframe itself (matched by ".mts_Media.iframe iframe")
  // or a container wrapping it — handle both cases
  let iframe = element;
  if (element.tagName !== 'IFRAME') {
    iframe = element.querySelector('iframe');
  }

  // Extract the video URL from the iframe's src attribute
  let videoSrc = '';
  if (iframe) {
    videoSrc = iframe.getAttribute('src') || '';
  }

  // Convert YouTube embed URL to standard watch URL
  // e.g. https://www.youtube.com/embed/IiLZufBs84Q?params -> https://www.youtube.com/watch?v=IiLZufBs84Q
  let videoUrl = videoSrc;
  const embedMatch = videoSrc.match(/youtube\.com\/embed\/([^?&#]+)/);
  if (embedMatch) {
    videoUrl = `https://www.youtube.com/watch?v=${embedMatch[1]}`;
  }

  // Fallback: if src uses youtu.be short format
  const shortMatch = videoSrc.match(/youtu\.be\/([^?&#]+)/);
  if (shortMatch) {
    videoUrl = `https://www.youtube.com/watch?v=${shortMatch[1]}`;
  }

  // Fallback: if src uses Vimeo format
  const vimeoMatch = videoSrc.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    videoUrl = `https://vimeo.com/${vimeoMatch[1]}`;
  }

  // Create anchor element with the video URL
  const link = document.createElement('a');
  link.href = videoUrl;
  link.textContent = videoUrl;

  // Build cells array: single row with the video link
  const cells = [
    [link],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed', cells });
  element.replaceWith(block);
}

import { getMetadata } from '../../scripts/aem.js';

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/content/footer';
  const resp = await fetch(`${footerPath}.plain.html`);

  if (!resp.ok) {
    return;
  }

  const html = await resp.text();
  const footer = document.createElement('div');
  footer.innerHTML = html;

  const sections = footer.querySelectorAll(':scope > div');
  const classes = ['brand', 'links', 'social', 'legal'];
  sections.forEach((section, i) => {
    if (classes[i]) section.classList.add(`footer-${classes[i]}`);
  });

  block.append(footer);
}

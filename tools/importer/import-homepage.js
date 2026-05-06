/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselParser from './parsers/carousel.js';
import columnsParser from './parsers/columns.js';
import cardsParser from './parsers/cards.js';
import embedParser from './parsers/embed.js';

// TRANSFORMER IMPORTS
import azekCleanupTransformer from './transformers/azek-cleanup.js';
import azekSectionsTransformer from './transformers/azek-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel': carouselParser,
  'columns': columnsParser,
  'cards': cardsParser,
  'embed': embedParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'AZEK Exteriors homepage with hero, product categories, inspiration gallery, and brand messaging',
  urls: [
    'https://www.azekexteriors.com/'
  ],
  blocks: [
    {
      name: 'carousel',
      instances: ['#hero-home .slider.home-hero']
    },
    {
      name: 'columns',
      instances: ['.mediaTextLinkStack.mtls3.blueBG', '.mediaTextLinkStack.mtls2']
    },
    {
      name: 'cards',
      instances: ['.azekHomeGrid', '.resources-home .mtls4']
    },
    {
      name: 'embed',
      instances: ['.mts_Media.iframe iframe']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: '#hero-home',
      style: null,
      blocks: ['carousel'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Value Proposition',
      selector: '.sfContentBlock:has(.mtls3.blueBG):first-of-type',
      style: 'navy-blue',
      blocks: ['columns'],
      defaultContent: ['.mtls_IntroHeadline', '.mtls_IntroCopy']
    },
    {
      id: 'section-3',
      name: 'Product Grid',
      selector: '.homeProducts',
      style: null,
      blocks: ['cards'],
      defaultContent: ['.hp_Headline']
    },
    {
      id: 'section-4',
      name: 'Video Section',
      selector: ['.sfContentBlock:has(.ccb_Headline)', '.sfContentBlock:has(.videoWrapper)'],
      style: 'navy-blue',
      blocks: ['embed'],
      defaultContent: ['.ccb_Headline', '.ccb_Body']
    },
    {
      id: 'section-5',
      name: 'Feature Cards',
      selector: '.sfContentBlock:has(.mtls2)',
      style: null,
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'section-6',
      name: 'Sustainability Stats',
      selector: '.sfContentBlock:has(.mtls3.blueBG):last-of-type',
      style: 'navy-blue',
      blocks: ['columns'],
      defaultContent: ['.mtls_IntroHeadline', '.mtls_IntroCopy']
    },
    {
      id: 'section-7',
      name: 'Additional Resources',
      selector: '.resources-home',
      style: null,
      blocks: ['cards'],
      defaultContent: ['.mtls_IntroHeadline']
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  azekCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [azekSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Remove data URI images, iframes, and fix malformed URLs
    main.querySelectorAll('img[src^="data:"]').forEach((img) => img.remove());
    main.querySelectorAll('iframe').forEach((el) => el.remove());
    main.querySelectorAll('[style*="url("]').forEach((el) => {
      el.removeAttribute('style');
    });
    main.querySelectorAll('img[src]').forEach((img) => {
      const src = img.getAttribute('src');
      if (!src || (!src.startsWith('http') && !src.startsWith('/') && !src.startsWith('./'))) {
        img.remove();
      }
    });
    main.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (href) {
        try { decodeURIComponent(href); } catch (e) { a.removeAttribute('href'); }
      }
    });
    main.querySelectorAll('img[src]').forEach((img) => {
      const src = img.getAttribute('src');
      if (src) {
        try { decodeURIComponent(src); } catch (e) { img.remove(); }
      }
    });

    // 6. Manually fix relative image URLs (avoid WebImporter.rules.adjustImageUrls which throws on malformed URIs)
    const baseUrl = new URL(params.originalURL);
    main.querySelectorAll('img[src]').forEach((img) => {
      const src = img.getAttribute('src');
      if (src && src.startsWith('/')) {
        img.setAttribute('src', `${baseUrl.origin}${src}`);
      } else if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('./')) {
        img.setAttribute('src', `${baseUrl.origin}/${src}`);
      }
    });

    // 7. Apply WebImporter built-in rules (skip adjustImageUrls)
    const hr = document.createElement('hr');
    main.appendChild(hr);
    try { WebImporter.rules.createMetadata(main, document); } catch (e) { console.warn('createMetadata:', e.message); }
    try { WebImporter.rules.transformBackgroundImages(main, document); } catch (e) { console.warn('transformBackgroundImages:', e.message); }

    // 8. Generate sanitized path
    let path = '/index';
    try {
      const pathname = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
      path = WebImporter.FileUtils.sanitizePath(pathname || '/index');
    } catch (e) {
      console.warn('Path generation failed:', e.message);
    }

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};

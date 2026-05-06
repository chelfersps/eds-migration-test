/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel.js
  function parse(element, { document: document2 }) {
    const slides = element.querySelectorAll(".owl-item");
    const cells = [];
    slides.forEach((slide) => {
      const bgImgContainer = slide.querySelector(".bg-img.style-bg");
      const img = bgImgContainer ? bgImgContainer.querySelector("img:not(.hidden-img)") || bgImgContainer.querySelector("img") : slide.querySelector("img");
      const textSection = slide.querySelector(".container section.text, section.text");
      const heading = textSection ? textSection.querySelector('h2, h1, h3, [class*="home-head"]') : slide.querySelector("h2, h1, h3");
      const ctaLink = textSection ? textSection.querySelector('a.button, a.btn-secondary-grey, a[class*="btn"]') : slide.querySelector('a.button, a[class*="btn"]');
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (ctaLink) contentCell.push(ctaLink);
      if (img || contentCell.length > 0) {
        cells.push([img || "", contentCell.length > 0 ? contentCell : ""]);
      }
    });
    if (cells.length === 0) {
      const bgImgs = element.querySelectorAll(".bg-img.style-bg");
      bgImgs.forEach((bgImg) => {
        const img = bgImg.querySelector("img:not(.hidden-img)") || bgImg.querySelector("img");
        const textSection = bgImg.querySelector(".container section.text, section.text");
        const heading = textSection ? textSection.querySelector("h2, h1, h3") : null;
        const ctaLink = textSection ? textSection.querySelector('a.button, a[class*="btn"]') : null;
        const contentCell = [];
        if (heading) contentCell.push(heading);
        if (ctaLink) contentCell.push(ctaLink);
        if (img || contentCell.length > 0) {
          cells.push([img || "", contentCell.length > 0 ? contentCell : ""]);
        }
      });
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document: document2 }) {
    const isTwoColumn = element.classList.contains("mtls2");
    const isThreeColumn = element.classList.contains("mtls3");
    const items = element.querySelectorAll(".mtls_Item");
    const cells = [];
    if (isTwoColumn) {
      const row = [];
      items.forEach((item) => {
        const cellContent = [];
        const img = item.querySelector(".mtls_MediaWrapper .mtls_Img, .mtls_MediaWrapper img");
        if (img) cellContent.push(img);
        const heading = item.querySelector(".mtls_Subhead, h4, h3");
        if (heading) cellContent.push(heading);
        const body = item.querySelector(".mtls_Body, .mtls_Copy p");
        if (body) cellContent.push(body);
        const link = item.querySelector(".mtls_Links .mtls_Link, .mtls_Links a");
        if (link) cellContent.push(link);
        row.push(cellContent);
      });
      cells.push(row);
    } else if (isThreeColumn) {
      const row = [];
      items.forEach((item) => {
        const cellContent = [];
        const heading = item.querySelector(".mtls_Subhead, h3, h4");
        if (heading) cellContent.push(heading);
        const body = item.querySelector(".mtls_Body, .mtls_Copy p");
        if (body) cellContent.push(body);
        row.push(cellContent);
      });
      cells.push(row);
      const ctaRow = element.querySelector(".mtls_CTARow");
      if (ctaRow) {
        const ctaLink = ctaRow.querySelector("a.mtls_CTA, a");
        if (ctaLink) {
          cells.push([ctaLink]);
        }
      }
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse3(element, { document: document2 }) {
    const cells = [];
    const isProductGrid = element.classList.contains("azekHomeGrid");
    const isResourceGrid = element.classList.contains("mtls4");
    if (isProductGrid) {
      const cards = element.querySelectorAll("a.ahg_Card");
      cards.forEach((card) => {
        let img = card.querySelector("img");
        if (!img) {
          const bgEl = card.querySelector('[style*="background-image"]') || card;
          const style = bgEl.getAttribute("style") || "";
          const bgMatch = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
          if (bgMatch) {
            img = document2.createElement("img");
            img.src = bgMatch[1];
            img.alt = "";
          }
        }
        const heading = card.querySelector("h2, h3");
        const description = card.querySelector("p.body-copy, p.light, .ahg_Overlay p");
        const ctaText = card.querySelector("div.button, .btn-white");
        const href = card.getAttribute("href");
        const contentCell = [];
        if (heading) contentCell.push(heading);
        if (description) contentCell.push(description);
        if (ctaText && href) {
          const link = document2.createElement("a");
          link.href = href;
          link.textContent = ctaText.textContent.trim();
          const p = document2.createElement("p");
          p.appendChild(link);
          contentCell.push(p);
        } else if (ctaText) {
          contentCell.push(ctaText);
        }
        if (img) {
          cells.push([img, contentCell]);
        } else {
          const placeholder = document2.createElement("span");
          cells.push([placeholder, contentCell]);
        }
      });
    } else if (isResourceGrid) {
      const items = element.querySelectorAll(".mtls_Item");
      items.forEach((item) => {
        const img = item.querySelector("img.mtls_Img, img");
        const heading = item.querySelector("h4.mtls_Subhead, h3, h4");
        const description = item.querySelector("p.mtls_Body, p");
        const link = item.querySelector("a.mtls_Link, a");
        const contentCell = [];
        if (heading) contentCell.push(heading);
        if (description) contentCell.push(description);
        if (link) contentCell.push(link);
        if (img) {
          cells.push([img, contentCell]);
        } else {
          const placeholder = document2.createElement("span");
          cells.push([placeholder, contentCell]);
        }
      });
    } else {
      const cardElements = element.querySelectorAll('[class*="card"], [class*="Card"], [class*="item"], [class*="Item"]');
      cardElements.forEach((card) => {
        const img = card.querySelector("img");
        const heading = card.querySelector("h2, h3, h4");
        const description = card.querySelector("p");
        const link = card.querySelector("a");
        const contentCell = [];
        if (heading) contentCell.push(heading);
        if (description) contentCell.push(description);
        if (link) contentCell.push(link);
        if (img || contentCell.length > 0) {
          cells.push([img || document2.createElement("span"), contentCell]);
        }
      });
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed.js
  function parse4(element, { document: document2 }) {
    let iframe = element;
    if (element.tagName !== "IFRAME") {
      iframe = element.querySelector("iframe");
    }
    let videoSrc = "";
    if (iframe) {
      videoSrc = iframe.getAttribute("src") || "";
    }
    let videoUrl = videoSrc;
    const embedMatch = videoSrc.match(/youtube\.com\/embed\/([^?&#]+)/);
    if (embedMatch) {
      videoUrl = `https://www.youtube.com/watch?v=${embedMatch[1]}`;
    }
    const shortMatch = videoSrc.match(/youtu\.be\/([^?&#]+)/);
    if (shortMatch) {
      videoUrl = `https://www.youtube.com/watch?v=${shortMatch[1]}`;
    }
    const vimeoMatch = videoSrc.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) {
      videoUrl = `https://vimeo.com/${vimeoMatch[1]}`;
    }
    const link = document2.createElement("a");
    link.href = videoUrl;
    link.textContent = videoUrl;
    const cells = [
      [link]
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: "embed", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/azek-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".trim-popup",
        ".trim-popup-mobile"
      ]);
      WebImporter.DOMUtils.remove(element, [".aspNetHidden"]);
      const trackingImgs = element.querySelectorAll('img[src*="insight.adsrvr.org"], img[src*="mdhv.io"]');
      trackingImgs.forEach((img) => img.remove());
      const trackingIframes = element.querySelectorAll('iframe[src*="insight.adsrvr.org"]');
      trackingIframes.forEach((iframe) => iframe.remove());
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["header"]);
      WebImporter.DOMUtils.remove(element, ["#mobile-nav"]);
      WebImporter.DOMUtils.remove(element, ["footer"]);
      WebImporter.DOMUtils.remove(element, ["#social-share-wrapper"]);
      WebImporter.DOMUtils.remove(element, [".lightbox"]);
      WebImporter.DOMUtils.remove(element, [".pageload-overlay"]);
      WebImporter.DOMUtils.remove(element, [
        "#five9LiveChatWidget",
        "#five9OpenChatButton"
      ]);
      const trackingIframes = element.querySelectorAll(
        'iframe[src*="doubleclick.net"], iframe[src*="brandcdn.com"]'
      );
      trackingIframes.forEach((iframe) => iframe.remove());
      const podscribeImg = element.querySelector("#podscribe-request");
      if (podscribeImg) podscribeImg.remove();
      const nonContentIframes = element.querySelectorAll('iframe:not([src*="youtube.com"]):not([src*="youtu.be"])');
      nonContentIframes.forEach((iframe) => iframe.remove());
      WebImporter.DOMUtils.remove(element, ["link", "noscript"]);
    }
  }

  // tools/importer/transformers/azek-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      let findSectionElement = function(section) {
        const selectorStr = Array.isArray(section.selector) ? section.selector[0] : section.selector;
        if (selectorStr === "#hero-home") {
          return element.querySelector("#hero-home");
        }
        if (selectorStr === ".homeProducts") {
          return element.querySelector(".homeProducts");
        }
        if (selectorStr === ".resources-home") {
          return element.querySelector(".resources-home");
        }
        if (selectorStr.includes(".mtls3.blueBG") && selectorStr.includes("first-of-type")) {
          const allBlueBG = element.querySelectorAll(".sfContentBlock .mtls3.blueBG");
          if (allBlueBG.length > 0) {
            return allBlueBG[0].closest(".sfContentBlock");
          }
          return null;
        }
        if (selectorStr.includes(".mtls3.blueBG") && selectorStr.includes("last-of-type")) {
          const allBlueBG = element.querySelectorAll(".sfContentBlock .mtls3.blueBG");
          if (allBlueBG.length > 1) {
            return allBlueBG[allBlueBG.length - 1].closest(".sfContentBlock");
          }
          return null;
        }
        if (selectorStr.includes(".ccb_Headline") || selectorStr.includes(".videoWrapper")) {
          const headline = element.querySelector(".ccb_Headline");
          if (headline) {
            return headline.closest(".sfContentBlock");
          }
          return null;
        }
        if (selectorStr.includes(".mtls2")) {
          const mtls2 = element.querySelector(".mtls2");
          if (mtls2) {
            return mtls2.closest(".sfContentBlock");
          }
          return null;
        }
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        for (const sel of selectors) {
          try {
            const el = element.querySelector(sel);
            if (el) return el;
          } catch (e) {
          }
        }
        return null;
      };
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) {
        return;
      }
      const doc = element.ownerDocument || document;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = findSectionElement(section);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(sectionMetadata);
          }
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel": parse,
    "columns": parse2,
    "cards": parse3,
    "embed": parse4
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "AZEK Exteriors homepage with hero, product categories, inspiration gallery, and brand messaging",
    urls: [
      "https://www.azekexteriors.com/"
    ],
    blocks: [
      {
        name: "carousel",
        instances: ["#hero-home .slider.home-hero"]
      },
      {
        name: "columns",
        instances: [".mediaTextLinkStack.mtls3.blueBG", ".mediaTextLinkStack.mtls2"]
      },
      {
        name: "cards",
        instances: [".azekHomeGrid", ".resources-home .mtls4"]
      },
      {
        name: "embed",
        instances: [".mts_Media.iframe iframe"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: "#hero-home",
        style: null,
        blocks: ["carousel"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Value Proposition",
        selector: ".sfContentBlock:has(.mtls3.blueBG):first-of-type",
        style: "navy-blue",
        blocks: ["columns"],
        defaultContent: [".mtls_IntroHeadline", ".mtls_IntroCopy"]
      },
      {
        id: "section-3",
        name: "Product Grid",
        selector: ".homeProducts",
        style: null,
        blocks: ["cards"],
        defaultContent: [".hp_Headline"]
      },
      {
        id: "section-4",
        name: "Video Section",
        selector: [".sfContentBlock:has(.ccb_Headline)", ".sfContentBlock:has(.videoWrapper)"],
        style: "navy-blue",
        blocks: ["embed"],
        defaultContent: [".ccb_Headline", ".ccb_Body"]
      },
      {
        id: "section-5",
        name: "Feature Cards",
        selector: ".sfContentBlock:has(.mtls2)",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Sustainability Stats",
        selector: ".sfContentBlock:has(.mtls3.blueBG):last-of-type",
        style: "navy-blue",
        blocks: ["columns"],
        defaultContent: [".mtls_IntroHeadline", ".mtls_IntroCopy"]
      },
      {
        id: "section-7",
        name: "Additional Resources",
        selector: ".resources-home",
        style: null,
        blocks: ["cards"],
        defaultContent: [".mtls_IntroHeadline"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.querySelectorAll('img[src^="data:"]').forEach((img) => img.remove());
      main.querySelectorAll("iframe").forEach((el) => el.remove());
      main.querySelectorAll('[style*="url("]').forEach((el) => {
        el.removeAttribute("style");
      });
      main.querySelectorAll("img[src]").forEach((img) => {
        const src = img.getAttribute("src");
        if (!src || !src.startsWith("http") && !src.startsWith("/") && !src.startsWith("./")) {
          img.remove();
        }
      });
      main.querySelectorAll("a[href]").forEach((a) => {
        const href = a.getAttribute("href");
        if (href) {
          try {
            decodeURIComponent(href);
          } catch (e) {
            a.removeAttribute("href");
          }
        }
      });
      main.querySelectorAll("img[src]").forEach((img) => {
        const src = img.getAttribute("src");
        if (src) {
          try {
            decodeURIComponent(src);
          } catch (e) {
            img.remove();
          }
        }
      });
      const baseUrl = new URL(params.originalURL);
      main.querySelectorAll("img[src]").forEach((img) => {
        const src = img.getAttribute("src");
        if (src && src.startsWith("/")) {
          img.setAttribute("src", `${baseUrl.origin}${src}`);
        } else if (src && !src.startsWith("http") && !src.startsWith("data:") && !src.startsWith("./")) {
          img.setAttribute("src", `${baseUrl.origin}/${src}`);
        }
      });
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      try {
        WebImporter.rules.createMetadata(main, document2);
      } catch (e) {
        console.warn("createMetadata:", e.message);
      }
      try {
        WebImporter.rules.transformBackgroundImages(main, document2);
      } catch (e) {
        console.warn("transformBackgroundImages:", e.message);
      }
      let path = "/index";
      try {
        const pathname = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
        path = WebImporter.FileUtils.sanitizePath(pathname || "/index");
      } catch (e) {
        console.warn("Path generation failed:", e.message);
      }
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();

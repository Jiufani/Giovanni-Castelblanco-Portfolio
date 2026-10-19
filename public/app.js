(function () {
  "use strict";
  const config = window.PORTFOLIO || {};
  const $ = function (selector, root) { return (root || document).querySelector(selector); };
  const $$ = function (selector, root) { return Array.from((root || document).querySelectorAll(selector)); };
  const escapeHtml = function (value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  };
  const safeUrl = function (value, allowRelative) {
    if (!value || typeof value !== "string") return "";
    try {
      const url = new URL(value, location.href);
      if (url.protocol === "https:" || url.protocol === "http:" ||
        (allowRelative && url.protocol === "file:" && !value.includes(":"))) {
        return url.href;
      }
    } catch (error) { /* Leave malformed links hidden. */ }
    return "";
  };
  const email = typeof config.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email.trim()) ? config.email.trim() : "";
  function arrowMarkup(direction) {
    const directions = { down: " ui-arrow--down", up: " ui-arrow--up", back: " ui-arrow--back" };
    return '<svg class="ui-arrow' + (directions[direction] || "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 19 19 5M7 5h12v12"/></svg>';
  }
  let toastTimer;
  function toast(message) {
    const element = $("#toast");
    element.textContent = message;
    element.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { element.hidden = true; }, 3800);
  }

  // Theme preference survives reloads. Storage is optional in private/file browsing.
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    $(".theme-toggle").setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " theme");
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#211031" : "#f3edfb";
  }
  let storedTheme = "";
  try { storedTheme = localStorage.getItem("gc-portfolio-theme") || ""; } catch (error) {}
  if (storedTheme === "dark" || storedTheme === "light") setTheme(storedTheme);
  $(".theme-toggle").addEventListener("click", function () {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(theme);
    try { localStorage.setItem("gc-portfolio-theme", theme); } catch (error) {}
  });

  // Mobile navigation has keyboard support and closes after selecting a section.
  const menuButton = $(".menu-toggle");
  const mobileNav = $("#mobile-nav");
  function closeMenu() {
    mobileNav.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  }
  menuButton.addEventListener("click", function () {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    mobileNav.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  $$("a", mobileNav).forEach(function (link) { link.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !mobileNav.hidden) { closeMenu(); menuButton.focus(); }
  });
  document.addEventListener("click", function (event) {
    if (!mobileNav.hidden && !event.target.closest(".site-header")) closeMenu();
  });
  window.addEventListener("resize", function () { if (window.innerWidth > 760) closeMenu(); }, { passive: true });

  // Accessible tabs: arrow keys, Home, and End follow the tablist pattern.
  const tabs = $$("[data-playground-tab]");
  const captions = {
    design: "Design the feeling. Sweat the details.",
    code: "Build the idea. Make it work.",
    product: "Find the why. Shape the what."
  };
  function selectTab(tab, focus) {
    tabs.forEach(function (item) {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      $("#" + item.getAttribute("aria-controls")).hidden = !selected;
    });
    $(".playground-caption").textContent = captions[tab.dataset.playgroundTab];
    $(".hero-playground").dataset.mode = tab.dataset.playgroundTab;
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () { selectTab(tab, false); });
    tab.addEventListener("keydown", function (event) {
      let next = null;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== null) { event.preventDefault(); selectTab(tabs[next], true); }
    });
  });

  const sculpture = window.PortfolioSculpture.create($("#sculpture-canvas"), $("#sculpture-fallback"));
  const formNames = window.PortfolioSculpture.names;
  const formModes = ["design", "code", "product", "code"];
  const modeNames = { design: "Design", code: "Development", product: "Product" };
  let sculptureForm = 0;
  $("#spin-sculpture").addEventListener("click", function () {
    sculptureForm = (sculptureForm + 1) % formNames.length;
    const form = formNames[sculptureForm];
    const mode = formModes[sculptureForm];
    selectTab(tabs.find(tab => tab.dataset.playgroundTab === mode), false);
    $(".hero-playground").setAttribute("data-form", form.toLowerCase());
    $("#sculpture-form").textContent = form.toUpperCase() + " / " + String(sculptureForm + 1).padStart(2, "0");
    $("#twist-status").textContent = form + (sculpture ? " form. " : " composition. ") + modeNames[mode] + " selected.";
    if (sculpture) sculpture.show(sculptureForm);
  });

  const workModel = window.PortfolioWork.build(config);
  const workGrid = $("#project-grid");
  const filters = $$("[data-filter]");
  const filterNames = { all: "All Work", design: "Design", development: "Development", product: "Product", projects: "Projects" };
  const tones = { rabbit: "rabbit-image", nebula: "nebula-image", starr: "starr-image", thought: "thought-image", bereal: "bereal-image", bobaloo: "bobaloo-image" };
  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.setAttribute("class", className);
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function makeImage(value, alt, className) {
    const url = safeUrl(value, true);
    if (!url) return null;
    const image = node("img", className || "");
    image.src = url;
    image.alt = alt || "";
    image.loading = "lazy";
    image.addEventListener("error", function () { image.hidden = true; });
    return image;
  }
  function imageMarkup(value, alt, className) {
    const url = safeUrl(value, true);
    return url ? '<img class="' + escapeHtml(className || "") + '" src="' + escapeHtml(url) + '" alt="' + escapeHtml(alt) + '">' : "";
  }
  function fileLabel(file) {
    if (file.type === "image") return "Image";
    if (file.type === "video") return "Video";
    const match = String(file.src || "").split(/[?#]/)[0].match(/\.([a-z0-9]+)$/i);
    return match ? match[1].toUpperCase() : "Document";
  }
  function coverFor(entry) {
    if (entry.file) return entry.file.thumbnail || (entry.file.type === "image" ? entry.file.src : "");
    if (entry.project.cover) return entry.project.cover;
    if (entry.kind === "collection") {
      const first = (entry.project.files || []).find(file => file.published !== false && file.type === "image" && safeUrl(file.src, true));
      if (first) return first.thumbnail || first.src;
    }
    return entry.project.image;
  }
  function coverAlt(entry) {
    if (entry.file) return entry.file.alt || entry.file.title;
    if (entry.project.cover) return entry.project.coverAlt || entry.project.imageAlt;
    if (entry.kind === "collection") {
      const first = (entry.project.files || []).find(file => file.published !== false && file.type === "image" && safeUrl(file.src, true));
      if (first) return first.alt || first.title;
    }
    return entry.project.imageAlt;
  }
  function createCard(entry, index) {
    const project = entry.project, file = entry.file;
    const title = file ? file.title : project.title;
    const article = node("article", "project-card");
    article.setAttribute("data-project", project.id);
    article.setAttribute("data-work-key", entry.key);
    article.setAttribute("data-category", entry.categories.join(" "));
    article.setAttribute("data-featured", String(entry.featured));
    article.setAttribute("data-wide", String(entry.wide));
    article.setAttribute("data-kind", entry.kind);
    const action = () => file ? openMedia(entry.key, true) : openProject(project.id, true);
    const button = node("button", "project-image " + (tones[project.tone] || "thought-image"));
    button.type = "button";
    button.setAttribute(file ? "data-open-media" : "data-open-project", file ? entry.key : project.id);
    button.setAttribute("aria-label", "View " + title);
    button.addEventListener("click", action);
    const indexLabel = node("span", "project-index", String(index + 1).padStart(2, "0") + " / " + (file ? fileLabel(file) : project.workLabel || "Selected work").toUpperCase());
    button.appendChild(indexLabel);
    const image = makeImage(coverFor(entry), coverAlt(entry), "work-artwork");
    if (image) button.appendChild(image);
    else {
      button.classList.add("document-image");
      const paper = node("div", "document-cover");
      paper.appendChild(node("span", "document-cover-label", project.title));
      paper.appendChild(node("strong", "document-cover-title", title));
      paper.appendChild(node("span", "document-cover-type", file ? fileLabel(file) + (file.type === "video" ? " / PLAY" : " / ORIGINAL FILE") : "COLLECTION"));
      button.appendChild(paper);
    }
    const coverLabel = file ? fileLabel(file).toUpperCase() : entry.kind === "collection" && coverFor(entry) !== project.image ? "COLLECTION" : project.coverLabel || "PROJECT";
    button.appendChild(node("span", "preview-label", coverLabel));
    const arrow = node("span", "project-open");
    arrow.innerHTML = arrowMarkup();
    arrow.setAttribute("aria-hidden", "true");
    button.appendChild(arrow);
    article.appendChild(button);
    const info = node("div", "project-info");
    const copy = node("div");
    const heading = node("h3");
    const titleButton = node("button", "", title);
    titleButton.type = "button";
    titleButton.setAttribute(file ? "data-open-media" : "data-open-project", file ? entry.key : project.id);
    titleButton.addEventListener("click", action);
    heading.appendChild(titleButton);
    copy.appendChild(heading);
    copy.appendChild(node("p", "", file ? file.description || project.title : project.cardSubtitle || project.subtitle));
    info.appendChild(copy);
    if (file || project.showTypeLabel !== false) {
      info.appendChild(node("span", "project-type", file ? fileLabel(file) : entry.kind === "experience" ? "Experience" : entry.kind === "collection" ? "Collection" : "Project"));
    }
    article.appendChild(info);
    const tags = node("div", "project-tags");
    (file && file.tags || project.tags || []).slice(0, 3).forEach(tag => tags.appendChild(node("span", "", tag)));
    article.appendChild(tags);
    return article;
  }
  function renderGallery(filter) {
    const selected = window.PortfolioWork.select(workModel, filter);
    const planned = window.PortfolioWork.layout(selected, filter);
    workGrid.replaceChildren();
    workGrid.setAttribute("data-filter", filter);
    workGrid.classList.toggle("is-filtered", filter !== "all");
    planned.forEach((entry, index) => workGrid.appendChild(createCard(entry, index)));
    if (!planned.length) workGrid.appendChild(node("p", "work-empty", "More work is taking shape. Check back soon."));
    filters.forEach(button => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    $("#project-count").textContent = String(selected.length).padStart(2, "0") + (selected.length === 1 ? " PIECE" : " PIECES");
    $("#work-status").textContent = "Showing " + selected.length + " " + (selected.length === 1 ? "piece" : "pieces") + " in " + filterNames[filter] + ".";
  }
  filters.forEach(button => {
    const count = window.PortfolioWork.select(workModel, button.dataset.filter).length;
    button.textContent = filterNames[button.dataset.filter];
    const label = node("span", "filter-count", String(count).padStart(2, "0"));
    label.setAttribute("aria-hidden", "true");
    button.appendChild(label);
    button.addEventListener("click", () => renderGallery(button.dataset.filter));
  });

  // Native dialogs supply a focus trap, Escape dismissal, and focus restoration.
  const projectDialog = $("#project-dialog");
  const contactDialog = $("#contact-dialog");
  let lastFocus = null;
  let previousHash = "";
  function openDialog(dialog) {
    lastFocus = document.activeElement;
    closeMenu();
    dialog.showModal();
    document.body.classList.add("modal-open");
  }
  function clearProjectHash() {
    if (/^#(?:project|piece)-/.test(location.hash)) {
      try { history.replaceState(null, "", location.pathname + location.search + (previousHash || "#work")); } catch (error) {}
    }
  }
  [projectDialog, contactDialog].forEach(function (dialog) {
    $(".dialog-close", dialog).addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (event) {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener("close", function () {
      $$("video", dialog).forEach(video => { if (typeof video.pause === "function") video.pause(); });
      document.body.classList.remove("modal-open");
      if (dialog === projectDialog) clearProjectHash();
      if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
    });
  });
  function updateWorkHash(hash, update) {
    if (!update) return;
    previousHash = /^#(?:project|piece)-/.test(location.hash) ? "#work" : location.hash;
    try { history.replaceState(null, "", hash); } catch (error) {}
  }
  function showWorkDialog() {
    if (!projectDialog.open) openDialog(projectDialog);
    else $(".dialog-close", projectDialog).focus();
    projectDialog.scrollTop = 0;
  }
  function mediaCardMarkup(item) {
    const file = item.file;
    const image = imageMarkup(file.thumbnail || (file.type === "image" ? file.src : ""), file.alt || file.title, "collection-thumbnail");
    return '<button class="collection-piece" type="button" data-open-media="' + escapeHtml(item.key) + '">' +
      '<span class="collection-piece-art">' + (image || '<span class="file-monogram">' + escapeHtml(fileLabel(file)) + '</span>') + '</span>' +
      '<span class="collection-piece-info"><strong>' + escapeHtml(file.title) + '</strong><span class="media-action">' + escapeHtml(fileLabel(file)) + ' ' + arrowMarkup() + '</span></span></button>';
  }
  function bindDetailActions(detail) {
    $$("[data-open-media]", detail).forEach(button => button.addEventListener("click", () => openMedia(button.dataset.openMedia, true)));
    $$("[data-open-project]", detail).forEach(button => button.addEventListener("click", () => openProject(button.dataset.openProject, true)));
  }
  function openProject(id, updateHash) {
    const project = workModel.projects.find(item => item.id === id);
    if (!project) return;
    $(".tiny-label", projectDialog).textContent = project.kind === "experience" ? "EXPERIENCE OVERVIEW" : "PROJECT OVERVIEW";
    const detail = $("#project-detail");
    $$("video", detail).forEach(video => { if (typeof video.pause === "function") video.pause(); });
    const tags = (project.tags || []).map(tag => "<span>" + escapeHtml(tag) + "</span>").join("");
    const sections = (project.sections || []).map(section => "<section><h3>" + escapeHtml(section.title) + "</h3>" + String(section.text || "").split(/\n\s*\n/).map(paragraph => "<p>" + escapeHtml(paragraph) + "</p>").join("") + "</section>").join("");
    const results = Array.isArray(project.results) && project.results.length ? '<section class="case-evidence" aria-label="' + escapeHtml(project.resultsTitle || "Study results") + '"><span class="eyebrow">' + escapeHtml(project.resultsTitle || "Study results") + '</span><dl class="case-results">' + project.results.map(result => '<div><dt>' + escapeHtml(result.label) + '</dt><dd>' + escapeHtml(result.value) + '</dd></div>').join("") + '</dl>' + (project.resultsNote ? '<p>' + escapeHtml(project.resultsNote) + '</p>' : "") + '</section>' : "";
    const live = safeUrl(project.liveUrl, false), source = safeUrl(project.sourceUrl, false);
    let links = "";
    if (live) links += '<a class="button button-dark has-arrow" target="_blank" rel="noopener noreferrer" href="' + escapeHtml(live) + '">' + escapeHtml(project.liveLabel || "Visit project") + ' ' + arrowMarkup() + '</a>';
    if (source) links += '<a class="button button-dark has-arrow" target="_blank" rel="noopener noreferrer" href="' + escapeHtml(source) + '">Project source ' + arrowMarkup() + '</a>';
    const files = Array.from(workModel.media.values()).filter(item => item.project.id === id);
    files.filter(item => item.file.type === "document" && item.file.showInOverview === true).forEach(item => {
      const href = safeUrl(item.file.src, true);
      if (href) links += '<a class="button button-outline has-arrow" target="_blank" rel="noopener noreferrer" href="' + escapeHtml(href) + '">' + escapeHtml(item.file.actionLabel || item.file.title) + ' ' + arrowMarkup() + '</a>';
    });
    const coverEntry = { project, kind: project.kind };
    const cover = coverFor(coverEntry);
    const coverNote = project.coverNote || (cover !== project.image && !project.cover ? "Original work from this collection." : project.previewNote);
    let gallery = "";
    if (project.kind === "collection" || files.length) {
      gallery = '<section class="collection-gallery"><div class="collection-heading"><span class="eyebrow">THE ORIGINAL WORK</span><h3>' + escapeHtml(project.galleryTitle || "Selected pieces") + '</h3></div>' +
        (files.length ? '<div class="collection-grid">' + files.map(mediaCardMarkup).join("") + '</div>' :
        '<div class="collection-empty"><span aria-hidden="true" class="empty-paper"></span><p>' + escapeHtml(project.galleryEmpty || "Original pieces are coming soon.") + '</p></div>') + '</section>';
    }
    detail.innerHTML = '<div class="case-hero"><span class="case-category">' + escapeHtml(project.category) + '</span><h2 id="case-title">' + escapeHtml(project.title) +
      '</h2><p class="case-subtitle">' + escapeHtml(project.subtitle) + '</p><div class="project-tags">' + tags + '</div>' +
      (links ? '<div class="case-links case-hero-links">' + links + '</div>' : "") +
      results +
      imageMarkup(cover, coverAlt(coverEntry), "case-image " + (tones[project.tone] || "thought-image")) +
      '<p class="case-preview-note">' + escapeHtml(coverNote) + '</p></div><div class="case-body' + (project.caseStudy ? ' case-study' : '') + '">' + sections + '</div>' + gallery;
    bindDetailActions(detail);
    updateWorkHash("#project-" + project.id, updateHash);
    showWorkDialog();
  }
  function openMedia(key, updateHash) {
    const item = workModel.media.get(key);
    if (!item) return;
    const file = item.file, project = item.project, url = safeUrl(file.src, true);
    if (!url) return;
    $(".tiny-label", projectDialog).textContent = "ORIGINAL WORK";
    let presentation;
    if (file.type === "image") presentation = imageMarkup(file.src, file.alt || file.title, "original-image");
    else if (file.type === "video") {
      const poster = safeUrl(file.thumbnail, true);
      presentation = '<video class="original-video" controls playsinline preload="metadata" src="' + escapeHtml(url) + '"' + (poster ? ' poster="' + escapeHtml(poster) + '"' : "") + '>Your browser does not support this video. Use the original file link below.</video>';
    } else {
      const preview = imageMarkup(file.thumbnail, file.alt || "Preview of " + file.title, "original-image document-preview");
      presentation = preview ? '<figure class="original-document-preview">' + preview + '<figcaption>' + escapeHtml(file.thumbnailNote || "Document preview. Open the original for the complete file.") + '</figcaption></figure>' : '<div class="original-document"><span class="eyebrow">' + escapeHtml(fileLabel(file)) + ' / ORIGINAL DELIVERABLE</span><strong>' + escapeHtml(file.title) + '</strong><span>' + escapeHtml(project.title) + '</span></div>';
    }
    const detail = $("#project-detail");
    $$("video", detail).forEach(video => { if (typeof video.pause === "function") video.pause(); });
    detail.innerHTML = '<div class="case-hero media-hero"><span class="case-category">' + escapeHtml(project.title + " / " + fileLabel(file)) + '</span><h2 id="case-title">' + escapeHtml(file.title) + '</h2>' +
      (file.description ? '<p class="case-subtitle">' + escapeHtml(file.description) + '</p>' : "") + '</div><div class="original-stage">' + presentation + '</div>' +
      (file.context ? '<div class="original-context"><h3>The thinking behind it</h3><p>' + escapeHtml(file.context) + '</p></div>' : "") +
      '<div class="case-links"><a class="button button-dark has-arrow" href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">Open original ' + escapeHtml(fileLabel(file).toLowerCase()) + ' ' + arrowMarkup() + '</a>' +
      '<button class="text-link has-arrow" type="button" data-open-project="' + escapeHtml(project.id) + '">Back to ' + escapeHtml(project.title) + ' ' + arrowMarkup("back") + '</button></div>';
    bindDetailActions(detail);
    updateWorkHash("#piece-" + encodeURIComponent(key), updateHash);
    showWorkDialog();
  }
  function openHashProject() {
    if (location.hash.startsWith("#project-")) openProject(location.hash.slice(9), false);
    else if (location.hash.startsWith("#piece-")) {
      try { openMedia(decodeURIComponent(location.hash.slice(7)), false); } catch (error) { /* Ignore malformed shared links. */ }
    }
  }
  window.addEventListener("hashchange", function () {
    if (/^#(?:project|piece)-/.test(location.hash)) openHashProject();
    else if (projectDialog.open) projectDialog.close();
  });
  renderGallery("all");

  // Only supplied, valid URLs become social or resume links.
  const linkedInButton = $("#contact-linkedin");
  const linkedInUrl = safeUrl(config.linkedin, false);
  if (linkedInButton) {
    linkedInButton.hidden = !linkedInUrl;
    if (linkedInUrl) linkedInButton.setAttribute("href", linkedInUrl);
  }
  const social = $("#social-links");
  [["GitHub", config.github, false], ["Résumé", config.resumeUrl, true]].forEach(function (item) {
    const url = safeUrl(item[1], item[2]);
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.textContent = item[0];
    link.classList.add("has-arrow");
    const icon = node("span", "link-arrow");
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = arrowMarkup();
    link.appendChild(icon);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    social.appendChild(link);
    social.hidden = false;
  });
  if (config.name) {
    $$(".brand-name").forEach(function (el) {
      el.textContent = config.name.toUpperCase();
      el.style.maxWidth = "125px";
    });
    $(".footer-name").firstChild.textContent = config.name;
    document.title = config.name + " — Design meets development";
  }
  if (config.firstName) $(".profile-first-name").textContent = config.firstName + ".";
  const siteUrl = safeUrl(config.siteUrl, false);
  if (siteUrl) {
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = siteUrl;
    document.head.appendChild(canonical);
    const ogUrl = document.createElement("meta");
    ogUrl.setAttribute("property", "og:url");
    ogUrl.content = siteUrl;
    document.head.appendChild(ogUrl);
    $('meta[property="og:image"]').content = new URL("assets/social-card.png", siteUrl.endsWith("/") ? siteUrl : siteUrl + "/").href;
  }
  $("#year").textContent = String(new Date().getFullYear());

  // The contact composer never pretends that an email was delivered.
  const form = $("#contact-form");
  const submit = $("#contact-submit");
  $("#contact-guidance").textContent = email
    ? "Write a quick introduction. Your email app will open so you can review and send it."
    : "Direct contact details are coming soon. You can prepare and copy an introduction here.";
  submit.firstChild.textContent = email ? "Prepare email " : "Prepare introduction ";
  const contactOpen = $("#contact-open");
  contactOpen.setAttribute("href", email ? "mailto:" + email : "#contact");
  const contactHand = $("#contact-hand");
  if (contactHand) {
    function waveHello() {
      contactHand.classList.remove("is-waving");
      void contactHand.offsetWidth;
      contactHand.classList.add("is-waving");
    }
    [contactOpen, linkedInButton].filter(Boolean).forEach(function (button) {
      button.addEventListener("click", waveHello);
    });
    contactHand.addEventListener("animationend", function () {
      contactHand.classList.remove("is-waving");
    });
  }
  if (!email) {
    contactOpen.addEventListener("click", function (event) {
      event.preventDefault();
      $("#contact-status").textContent = "";
      openDialog(contactDialog);
    });
  }
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const name = $("#contact-name").value.trim();
    const from = $("#contact-email").value.trim();
    const message = $("#contact-message").value.trim();
    if (!name || !message) {
      $("#contact-status").textContent = "Please add your name and a message.";
      return;
    }
    const prepared = "Hi " + (config.firstName || "Giovanni") + ",\n\n" + message + "\n\n" + name + "\n" + from;
    $("#prepared-message").value = prepared;
    $("#message-preview").hidden = false;
    if (email) {
      const href = "mailto:" + email + "?subject=" + encodeURIComponent("Portfolio inquiry from " + name) + "&body=" + encodeURIComponent(prepared);
      window.location.href = href;
      $("#contact-status").textContent = "Your email app should open. Review and send it there, or copy the message below.";
    } else {
      $("#contact-status").textContent = "Your introduction is ready to copy. Direct contact details are still being added.";
    }
  });
  $("#copy-message").addEventListener("click", async function () {
    const textarea = $("#prepared-message");
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(textarea.value);
      $("#contact-status").textContent = "Message copied.";
      toast("Introduction copied.");
    } catch (error) {
      textarea.focus();
      textarea.select();
      $("#contact-status").textContent = "Message selected. Press Ctrl+C or Command+C to copy.";
    }
  });

  // Animation enhances already-visible content and respects reduced motion.
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    $$(".reveal").forEach(function (element) { observer.observe(element); });
  }
  let scrollScheduled = false;
  function updateProgress() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    $("#scroll-progress").style.width = (total > 0 ? Math.min(100, Math.max(0, window.scrollY / total * 100)) : 0) + "%";
    scrollScheduled = false;
  }
  window.addEventListener("scroll", function () {
    if (!scrollScheduled) { requestAnimationFrame(updateProgress); scrollScheduled = true; }
  }, { passive: true });
  updateProgress();
  openHashProject();
})();

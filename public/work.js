(function () {
  "use strict";
  const allowed = ["design", "development", "product", "projects"];
  const safeId = value => typeof value === "string" && /^[a-z0-9][a-z0-9-]*$/.test(value);
  const resource = value => typeof value === "string" && value.trim() && !value.trim().startsWith("#") && (!/^[a-z][a-z0-9+.-]*:/i.test(value.trim()) || /^https?:\/\//i.test(value.trim()));
  function build(config) {
    const entries = [], media = new Map(), projects = [];
    const ids = new Set();
    (config.projects || []).forEach(project => {
      if (!safeId(project.id) || ids.has(project.id) || project.published === false) return;
      ids.add(project.id);
      projects.push(project);
      const kind = ["collection", "experience"].includes(project.kind) ? project.kind : "project";
      const categories = (project.filters || []).filter(value => allowed.includes(value) && value !== "projects");
      if (kind === "project" && project.showInProjects !== false) categories.push("projects");
      entries.push({ key: project.id, project, kind, categories: [...new Set(categories)] });
      const fileIds = new Set();
      (project.files || []).forEach(file => {
        if (!safeId(file.id) || fileIds.has(file.id) || file.published === false || !resource(file.src)) return;
        if (!["image", "video", "document"].includes(file.type)) return;
        fileIds.add(file.id);
        const key = project.id + ":" + file.id;
        const own = Array.isArray(file.filters) ? file.filters : categories;
        const fileCategories = own.filter(value => allowed.includes(value) && value !== "projects");
        const item = { key, project, file, kind: "file", categories: [...new Set(fileCategories)] };
        media.set(key, item);
        if (project.groupFiles !== true) entries.push(item);
      });
    });
    return { entries, media, projects };
  }
  function select(model, filter) {
    return model.entries.filter(entry => filter === "all" || entry.categories.includes(filter));
  }
  function layout(entries, filter) {
    const featured = filter === "all" && entries.length >= 3 && entries[0].kind === "project";
    const remaining = entries.length - Number(featured);
    const wideLast = remaining % 2 === 1;
    return entries.map((entry, index) => Object.assign({}, entry, {
      featured: featured && index === 0,
      wide: wideLast && index === entries.length - 1 && !(featured && index === 0)
    }));
  }
  window.PortfolioWork = { build, select, layout };
})();

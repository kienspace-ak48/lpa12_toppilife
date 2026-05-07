/**
 * Nút .chooseImg trong .image_action → mở modal chọn path từ GET /admin/media/images?folder=all
 */
(function () {
  const STYLE_ID = "admin-media-picker-styles";

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent =
      ".admin-mp-overlay{position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:99998;display:flex;align-items:center;justify-content:center;padding:16px}" +
      ".admin-mp-panel{background:#fff;border-radius:12px;max-width:760px;width:100%;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 25px 50px -12px rgba(0,0,0,.25)}" +
      ".admin-mp-head{padding:12px 16px;border-bottom:1px solid #e5e7eb;font-weight:600;display:flex;justify-content:space-between;align-items:center;gap:8px}" +
      ".admin-mp-list{overflow-y:auto;padding:8px;flex:1;min-height:120px}" +
      ".admin-mp-row{display:flex;gap:12px;align-items:center;padding:8px;border-radius:8px;cursor:pointer;border:1px solid transparent}" +
      ".admin-mp-row:hover{background:#f8fafc;border-color:#e2e8f0}" +
      ".admin-mp-thumb{width:56px;height:56px;object-fit:cover;border-radius:6px;background:#f1f5f9;flex-shrink:0}" +
      ".admin-mp-path{font-size:11px;color:#64748b;word-break:break-all;margin-top:2px}" +
      ".admin-mp-empty{padding:24px;text-align:center;color:#64748b;font-size:14px}" +
      ".admin-mp-btn{padding:6px 12px;border-radius:8px;border:1px solid #cbd5e1;background:#fff;cursor:pointer;font-size:13px}" +
      ".admin-mp-btn:hover{background:#f8fafc}";
    document.head.appendChild(s);
  }

  function normalizePath(p) {
    return String(p || "")
      .trim()
      .replace(/^\/+/, "");
  }

  function publicMediaUrl(rel) {
    const p = normalizePath(rel);
    if (!p) return "";
    return "/" + p.split("/").filter(Boolean).map(encodeURIComponent).join("/");
  }

  function isVideoPath(p) {
    return /\.(mp4|webm|ogg|mov|m4v)$/i.test(p);
  }

  function syncHeroMediaType(input) {
    if (!input || input.name !== "hero_media_url") return;
    const sel = document.querySelector('#configForm [name="hero_media_type"]');
    if (!sel) return;
    const p = input.value;
    if (/\.(mp4|webm|ogg|mov|m4v)$/i.test(p)) sel.value = "video";
    else if (/\.gif$/i.test(p)) sel.value = "gif";
    else sel.value = "image";
  }

  function renderPreview(container, pathRel) {
    const p = normalizePath(pathRel);
    if (!container) return;
    if (!p) {
      container.innerHTML = '<span class="text-sm text-gray-400">Preview</span>';
      return;
    }
    const url = publicMediaUrl(p);
    if (isVideoPath(p)) {
      container.innerHTML =
        '<video src="' +
        url +
        '" class="w-full h-full object-cover max-h-[200px]" controls muted playsinline></video>';
    } else {
      container.innerHTML =
        '<img src="' + url + '" alt="" class="w-full object-cover max-h-[200px]" />';
    }
  }

  function closeModal(overlay, onKey) {
    document.removeEventListener("keydown", onKey);
    overlay?.remove();
  }

  async function openPicker(onPick) {
    ensureStyles();
    const overlay = document.createElement("div");
    overlay.className = "admin-mp-overlay";
    overlay.innerHTML =
      '<div class="admin-mp-panel">' +
      '<div class="admin-mp-head"><span>Chọn từ Media Library</span><button type="button" class="admin-mp-btn" data-mp-close>Đóng</button></div>' +
      '<div class="admin-mp-list" data-mp-list><div style="padding:16px">Đang tải…</div></div>' +
      '<div style="padding:8px 16px 12px;border-top:1px solid #e5e7eb;font-size:12px;color:#64748b;">Upload thêm tại <a href="/admin/media" target="_blank" style="color:#2563eb">Media Library</a></div>' +
      "</div>";

    const onKey = (e) => {
      if (e.key === "Escape") closeModal(overlay, onKey);
    };
    document.addEventListener("keydown", onKey);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.closest("[data-mp-close]")) closeModal(overlay, onKey);
    });

    const listEl = overlay.querySelector("[data-mp-list]");
    document.body.appendChild(overlay);

    try {
      const res = await fetch("/admin/media/images?folder=all", { credentials: "same-origin" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Không tải được danh sách media");

      const images = data.images || [];
      listEl.innerHTML = "";
      if (!images.length) {
        listEl.innerHTML =
          '<div class="admin-mp-empty">Chưa có file.<br><a href="/admin/media" target="_blank" style="color:#2563eb;font-weight:600">Mở Media Library để upload</a></div>';
        return;
      }

      images.forEach((item) => {
        const path = normalizePath(item.path);
        const row = document.createElement("div");
        row.className = "admin-mp-row";
        row.setAttribute("role", "button");

        const thumbUrl = publicMediaUrl(path);

        let thumb;
        if (isVideoPath(path)) {
          thumb = document.createElement("video");
          thumb.className = "admin-mp-thumb";
          thumb.muted = true;
          thumb.playsInline = true;
          thumb.src = thumbUrl;
        } else {
          thumb = document.createElement("img");
          thumb.className = "admin-mp-thumb";
          thumb.src = thumbUrl;
          thumb.alt = "";
        }

        const meta = document.createElement("div");
        meta.style.flex = "1";
        meta.style.minWidth = "0";
        const title = document.createElement("div");
        title.style.fontSize = "13px";
        title.style.fontWeight = "600";
        title.textContent = item.name || path.split("/").pop() || path;
        const pathDiv = document.createElement("div");
        pathDiv.className = "admin-mp-path";
        pathDiv.textContent = path;
        meta.appendChild(title);
        meta.appendChild(pathDiv);

        row.appendChild(thumb);
        row.appendChild(meta);

        row.addEventListener("click", () => {
          onPick(path);
          closeModal(overlay, onKey);
        });

        listEl.appendChild(row);
      });
    } catch (e) {
      listEl.innerHTML =
        '<div class="admin-mp-empty">' + (e.message || "Lỗi tải danh sách") + "</div>";
    }
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".chooseImg");
    if (!btn) return;
    e.preventDefault();
    const wrap = btn.closest(".image_action");
    if (!wrap) return;
    const input = wrap.querySelector(".img_input");
    if (!input) return;

    openPicker((path) => {
      input.value = normalizePath(path);
      syncHeroMediaType(input);
      const preview = wrap.querySelector(".img_preview");
      renderPreview(preview, input.value);
    });
  });

  /** Gọi sau khi gán value vào `.img_input` bằng code (ví dụ mở form Edit). */
  window.refreshAdminMediaPreview = function (el) {
    const wrap = el && el.closest ? el.closest(".image_action") : el;
    if (!wrap || !wrap.classList.contains("image_action")) return;
    const inp = wrap.querySelector(".img_input");
    const preview = wrap.querySelector(".img_preview");
    renderPreview(preview, inp ? inp.value : "");
  };
})();

(function () {
  if (window.ImagePicker) return;

  function normalizeTree(tree) {
    return Array.isArray(tree) ? tree : [];
  }

  function createModal(mediaType) {
    const modalId = `shared_picker_modal_${mediaType}`;
    const el = document.createElement("div");
    el.id = modalId;
    el.className = "fixed inset-0 z-[70] hidden items-center justify-center bg-black/50";
    const fileAccept = mediaType === "video" ? "video/*" : "image/*";
    const uploadLabel = mediaType === "video" ? "Upload video" : "Upload";
    el.innerHTML = `
      <div class="bg-white rounded-lg w-[980px] max-w-[96vw] h-[82vh] p-3 flex gap-3">
        <aside class="w-64 border rounded p-2 overflow-auto">
          <div class="font-semibold mb-2">Folders</div>
          <div id="shared_picker_tree" class="space-y-2 text-sm"></div>
        </aside>
        <section class="flex-1 border rounded p-2 overflow-auto">
          <div class="flex items-center justify-between mb-2">
            <div id="shared_picker_selected" class="text-sm text-gray-600">Subfolder: none</div>
            <button id="shared_picker_close" class="px-3 py-1 border rounded">Close</button>
          </div>
          <div class="flex flex-wrap items-center gap-2 mb-3 p-2 border rounded bg-gray-50">
            <input id="shared_picker_upload_input" type="file" accept="${fileAccept}" class="text-sm border rounded px-2 py-1 bg-white" />
            <button id="shared_picker_upload_btn" type="button" class="px-3 py-1 border rounded text-sm disabled:opacity-50" disabled>${uploadLabel}</button>
            <span id="shared_picker_upload_hint" class="text-xs text-gray-500">Chọn subfolder để upload</span>
          </div>
          <div id="shared_picker_grid" class="grid grid-cols-2 md:grid-cols-4 gap-3"></div>
        </section>
      </div>
    `;
    document.body.appendChild(el);
    return el;
  }

  async function requestJson(url, options) {
    const res = await fetch(url, options);
    return res.json();
  }

  function getVideoDuration(file) {
    return new Promise((resolve, reject) => {
      const tempUrl = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        const duration = video.duration;
        URL.revokeObjectURL(tempUrl);
        resolve(duration);
      };
      video.onerror = () => {
        URL.revokeObjectURL(tempUrl);
        reject(new Error("Cannot read video metadata"));
      };
      video.src = tempUrl;
    });
  }

  function initImagePicker(options) {
    const triggerSelector = options?.triggerSelector || ".chooseImg";
    const onSelect = options?.onSelect;
    const rootFilter = options?.rootFilter || "";
    const mediaType = options?.mediaType === "video" ? "video" : "image";

    const modal = document.getElementById(`shared_picker_modal_${mediaType}`) || createModal(mediaType);
    const listEndpoint = mediaType === "video" ? "/admin/media/videos" : "/admin/media/images";
    const uploadEndpoint = mediaType === "video" ? "/admin/media/videos/upload" : "/admin/media/images/upload";
    const uploadField = mediaType === "video" ? "video" : "image";

    const treeEl = modal.querySelector("#shared_picker_tree");
    const gridEl = modal.querySelector("#shared_picker_grid");
    const selectedLabel = modal.querySelector("#shared_picker_selected");
    const closeBtn = modal.querySelector("#shared_picker_close");
    const uploadInput = modal.querySelector("#shared_picker_upload_input");
    const uploadBtn = modal.querySelector("#shared_picker_upload_btn");
    const uploadHint = modal.querySelector("#shared_picker_upload_hint");

    let treeData = [];
    let selectedFolderId = "";
    let selectedFolderName = "";
    let currentTrigger = null;

    function syncUploadState() {
      const canUpload = Boolean(selectedFolderId);
      uploadBtn.disabled = !canUpload;
      uploadHint.textContent = canUpload
        ? `Upload vào: ${selectedFolderName}`
        : "Chọn subfolder để upload";
    }

    async function loadTree() {
      const result = await requestJson("/admin/media/folders/tree");
      const raw = normalizeTree(result?.data);
      treeData = rootFilter
        ? raw.filter((r) => String(r.name || "").toLowerCase() === String(rootFilter).toLowerCase())
        : raw;
      renderTree();
    }

    async function loadImages() {
      const qs = selectedFolderId ? `?folder_id=${selectedFolderId}` : "";
      const result = await requestJson(`${listEndpoint}${qs}`);
      const items = result?.data || [];
      gridEl.innerHTML = "";
      if (!items.length) {
        gridEl.innerHTML = `<p class="col-span-full text-sm text-gray-500">No image</p>`;
        return;
      }
      items.forEach((img) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "border rounded overflow-hidden hover:ring-2 hover:ring-blue-500";
        card.innerHTML = `
          ${mediaType === "video"
            ? `<video src="/${img.path}" class="w-full h-28 object-cover" muted playsinline></video>`
            : `<img src="/${img.path}" class="w-full h-28 object-cover" />`}
          <div class="p-1 text-xs truncate">${img.name || "image"}</div>
        `;
        card.addEventListener("click", () => {
          if (typeof onSelect === "function") {
            onSelect(img.path, currentTrigger);
          } else if (currentTrigger) {
            const root = currentTrigger.closest(".image_action");
            if (root) {
              const input = root.querySelector(".img_input");
              const preview = root.querySelector(".img_preview img");
              if (input) input.value = img.path;
              if (preview) preview.src = `/${img.path}`;
            }
          }
          closeModal();
        });
        gridEl.appendChild(card);
      });
    }

    function renderTree() {
      treeEl.innerHTML = "";
      if (!treeData.length) {
        treeEl.innerHTML = `<p class="text-xs text-gray-500">No folder</p>`;
        return;
      }
      treeData.forEach((root) => {
        const wrap = document.createElement("div");
        wrap.className = "border rounded p-2";
        const childrenHtml = (root.children || [])
          .map((c) => `<button type="button" class="picker-folder-btn w-full text-left p-1 rounded hover:bg-gray-100 ${selectedFolderId === String(c._id) ? "bg-blue-50" : ""}" data-id="${c._id}" data-name="${c.name}">${c.name}</button>`)
          .join("");
        wrap.innerHTML = `<div class="font-medium">${root.name}</div><div class="mt-1 space-y-1">${childrenHtml}</div>`;
        treeEl.appendChild(wrap);
      });
    }

    function openModal(triggerEl) {
      currentTrigger = triggerEl || null;
      selectedFolderId = "";
      selectedFolderName = "";
      selectedLabel.textContent = "Subfolder: none";
      uploadInput.value = "";
      syncUploadState();
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      loadTree().then(loadImages);
    }
    function closeModal() {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    treeEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".picker-folder-btn");
      if (!btn) return;
      selectedFolderId = btn.dataset.id;
      selectedFolderName = btn.dataset.name || "";
      selectedLabel.textContent = `Subfolder: ${selectedFolderName}`;
      renderTree();
      syncUploadState();
      loadImages();
    });
    uploadBtn.addEventListener("click", async () => {
      if (!selectedFolderId) return alert("Vui lòng chọn subfolder trước");
      const file = uploadInput.files && uploadInput.files[0];
      if (!file) return alert("Vui lòng chọn ảnh để upload");
      if (mediaType === "video") {
        try {
          const duration = await getVideoDuration(file);
          if (!duration || duration > 10) {
            return alert("Video phải <= 10 giây");
          }
        } catch (error) {
          return alert("Không đọc được thông tin video");
        }
      }

      const fd = new FormData();
      fd.append(uploadField, file);
      fd.append("folder_id", selectedFolderId);

      uploadBtn.disabled = true;
      try {
        const result = await requestJson(uploadEndpoint, {
          method: "POST",
          body: fd,
        });
        if (!result?.success) {
          alert(result?.mess || "Upload failed");
          return;
        }
        uploadInput.value = "";
        await loadImages();
      } catch (error) {
        alert("Upload failed");
      } finally {
        syncUploadState();
      }
    });

    document.addEventListener("click", (e) => {
      const trigger = e.target.closest(triggerSelector);
      if (!trigger) return;
      e.preventDefault();
      openModal(trigger);
    });
  }

  window.ImagePicker = { initImagePicker };
})();

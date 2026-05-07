const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");
const myPathConfig = require("../config/myPath.config");
const folderEntity = require("../model/folder.model");
const mediaEntity = require("../model/image.model");

const CNAME = "media.controller.js ";
const VNAME = "media";

const PUBLIC_ROOT = myPathConfig.public;
const MEDIA_PREFIX = "uploads/media";

function physicalPath(rel) {
  if (!rel || typeof rel !== "string") return PUBLIC_ROOT;
  const safe = rel
    .replace(/^[/\\]+/, "")
    .split(/[/\\]/)
    .filter((p) => p && p !== "..");
  return path.join(PUBLIC_ROOT, ...safe);
}

function isUnderMediaRoot(rel) {
  return typeof rel === "string" && rel.replace(/^[/\\]+/, "").startsWith(`${MEDIA_PREFIX}/`);
}

async function ensureDir(absDir) {
  await fs.mkdir(absDir, { recursive: true });
}

async function safeUnlink(relPath) {
  if (!isUnderMediaRoot(relPath)) return;
  try {
    await fs.unlink(physicalPath(relPath));
  } catch (e) {
    if (e.code !== "ENOENT") console.warn(CNAME, "unlink", e.message);
  }
}

async function rmMediaDir(relDir) {
  if (!isUnderMediaRoot(relDir)) return;
  try {
    await fs.rm(physicalPath(relDir), { recursive: true, force: true });
  } catch (e) {
    if (e.code !== "ENOENT") console.warn(CNAME, "rm dir", e.message);
  }
}

function serializeMedia(doc) {
  const d = doc.toObject ? doc.toObject() : doc;
  return {
    _id: d._id,
    name: d.name,
    path: d.path,
    folder_id: d.folder_id,
  };
}

async function listImagesForFolder(folderParam) {
  let query = {};
  if (folderParam && folderParam !== "all") {
    if (!mongoose.Types.ObjectId.isValid(folderParam)) return [];
    query = { folder_id: folderParam };
  }
  const rows = await mediaEntity.find(query).sort({ createdAt: -1 }).lean();
  return rows.map(serializeMedia);
}

function sanitizeFilename(original) {
  const base = path.basename(original || "file").replace(/[^\w.\-]+/g, "_");
  return `${Date.now()}_${base}`;
}

const mediaController = () => ({
  Index: async (req, res) => {
    try {
      const folders = await folderEntity.find().sort({ name: 1 }).lean();
      const images = await listImagesForFolder("all");
      res.render(`${VNAME}/index`, { folders, images });
    } catch (error) {
      console.log(CNAME, error.message);
      res.render(`${VNAME}/index`, { folders: [], images: [] });
    }
  },

  /** POST /admin/media/folders — JSON { folder_name } */
  CreateFolder: async (req, res) => {
    try {
      const folder_name = String(req.body.folder_name || "").trim();
      if (!folder_name) {
        return res.status(400).json({ success: false, message: "Tên folder bắt buộc" });
      }

      const folder = await folderEntity.create({
        name: folder_name,
        path: "pending",
      });
      const relPath = path.posix.join(MEDIA_PREFIX, String(folder._id));
      folder.path = relPath;
      await folder.save();
      await ensureDir(physicalPath(relPath));

      return res.json({ success: true, folder: folder.toObject() });
    } catch (error) {
      console.log(CNAME, error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /** DELETE /admin/media/folders/:id */
  DeleteFolder: async (req, res) => {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "ID không hợp lệ" });
      }

      const folder = await folderEntity.findById(id);
      if (!folder) {
        return res.status(404).json({ success: false, message: "Không tìm thấy folder" });
      }

      const imgs = await mediaEntity.find({ folder_id: id }).lean();
      await Promise.all(imgs.map((img) => safeUnlink(img.path)));
      await mediaEntity.deleteMany({ folder_id: id });
      await rmMediaDir(folder.path);
      await folderEntity.deleteOne({ _id: id });

      return res.json({ success: true });
    } catch (error) {
      console.log(CNAME, error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /** GET /admin/media/images?folder=all|mongoId */
  ListImages: async (req, res) => {
    try {
      const folder = req.query.folder || "all";
      const images = await listImagesForFolder(folder);
      return res.json({ success: true, images });
    } catch (error) {
      console.log(CNAME, error.message);
      return res.status(500).json({ success: false, images: [] });
    }
  },

  /** DELETE /admin/media/images — JSON { img_path, folder_id } */
  DeleteImage: async (req, res) => {
    try {
      const img_path = String(req.body.img_path || "").trim();
      const folder_id = req.body.folder_id;

      if (!isUnderMediaRoot(img_path)) {
        return res.status(400).json({ success: false, message: "Đường dẫn không hợp lệ" });
      }

      const doc = await mediaEntity.findOne({ path: img_path });
      if (!doc) {
        return res.status(404).json({ success: false, message: "Không tìm thấy file" });
      }

      await safeUnlink(doc.path);
      await doc.deleteOne();

      const listKey = folder_id === undefined || folder_id === null ? "all" : folder_id;
      const images = await listImagesForFolder(listKey);

      return res.json({ success: true, images });
    } catch (error) {
      console.log(CNAME, error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /** POST /admin/media/images/upload | /admin/media/videos/upload — multipart field "image" hoặc "video", body folder_id */
  UploadMedia: async (req, res) => {
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ success: false, message: "Chưa có file" });
      }

      const rawFolder = req.body.folder_id;
      let folder_id = null;
      let destDirRel = path.posix.join(MEDIA_PREFIX, "general");

      if (rawFolder && rawFolder !== "all") {
        if (!mongoose.Types.ObjectId.isValid(rawFolder)) {
          return res.status(400).json({ success: false, message: "folder_id không hợp lệ" });
        }
        const folder = await folderEntity.findById(rawFolder);
        if (!folder) {
          return res.status(400).json({ success: false, message: "Folder không tồn tại" });
        }
        folder_id = folder._id;
        destDirRel = folder.path.replace(/\\/g, "/");
      }

      await ensureDir(physicalPath(destDirRel));
      const filename = sanitizeFilename(req.file.originalname);
      const relFile = path.posix.join(destDirRel, filename);

      await fs.writeFile(physicalPath(relFile), req.file.buffer);

      await mediaEntity.create({
        name: req.file.originalname,
        path: relFile,
        folder_id,
      });

      const images = await listImagesForFolder(rawFolder === "all" || !rawFolder ? "all" : String(folder_id));

      return res.json({ success: true, images });
    } catch (error) {
      console.log(CNAME, error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
});

module.exports = mediaController;

const path = require("path");
const fs = require("fs");
const MediaFolder = require("../model/mediaFolder.model");
const MediaImage = require("../model/mediaImage.model");
const MediaVideo = require("../model/mediaVideo.model");
const myPathConfig = require("../config/myPath.config");

const CNAME = "mediaLibrary.controller.js ";
const VNAME = "admin/";
const MEDIA_ROOT_DIR = "uploads/media";

const slugifyText = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_");

const safeMkdir = (absPath) => {
  if (!fs.existsSync(absPath)) {
    fs.mkdirSync(absPath, { recursive: true });
  }
};

const listTree = async () => {
  const roots = await MediaFolder.find({
    level: 1,
    isDeleted: false,
    parent_id: null,
  })
    .sort({ createdAt: -1 })
    .lean();
  const rootIds = roots.map((i) => i._id);
  const children = await MediaFolder.find({
    level: 2,
    isDeleted: false,
    parent_id: { $in: rootIds },
  })
    .sort({ createdAt: -1 })
    .lean();
  const childByParent = children.reduce((acc, item) => {
    const key = String(item.parent_id);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  return roots.map((root) => ({
    ...root,
    children: childByParent[String(root._id)] || [],
  }));
};

const mediaLibraryController = () => {
  return {
    LibraryPage: async (req, res) => {
      try {
        const tree = await listTree();
        return res.render(VNAME + "media-library", { tree });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.render(VNAME + "media-library", { tree: [] });
      }
    },
    FolderTree: async (req, res) => {
      try {
        const tree = await listTree();
        return res.json({ success: true, data: tree });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, data: [] });
      }
    },
    CreateFolder: async (req, res) => {
      try {
        const name = String(req.body.name || "").trim();
        const parentId = String(req.body.parent_id || "").trim();
        if (!name) return res.status(400).json({ success: false, mess: "Folder name required" });

        const slug = slugifyText(name);
        if (!slug) return res.status(400).json({ success: false, mess: "Folder name invalid" });

        let parent = null;
        let level = 1;
        let folderPath = `${MEDIA_ROOT_DIR}/${slug}`;
        if (parentId) {
          parent = await MediaFolder.findOne({
            _id: parentId,
            level: 1,
            isDeleted: false,
          });
          if (!parent) {
            return res.status(400).json({ success: false, mess: "Parent root folder not found" });
          }
          level = 2;
          folderPath = `${parent.path}/${slug}`;
        }

        const existed = await MediaFolder.findOne({
          level,
          parent_id: parent ? parent._id : null,
          slug,
          isDeleted: false,
        });
        if (existed) return res.status(400).json({ success: false, mess: "Folder existed" });

        const created = await MediaFolder.create({
          name,
          slug,
          parent_id: parent ? parent._id : null,
          level,
          path: folderPath,
        });
        safeMkdir(path.join(myPathConfig.public, folderPath));

        return res.json({ success: true, data: created });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
    UpdateFolder: async (req, res) => {
      try {
        const name = String(req.body.name || "").trim();
        if (!name) return res.status(400).json({ success: false, mess: "Folder name required" });
        const folder = await MediaFolder.findOne({ _id: req.params.id, isDeleted: false });
        if (!folder) return res.status(404).json({ success: false, mess: "Folder not found" });

        folder.name = name;
        await folder.save();
        return res.json({ success: true, data: folder });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
    DeleteFolder: async (req, res) => {
      try {
        const folder = await MediaFolder.findOne({ _id: req.params.id, isDeleted: false });
        if (!folder) return res.status(404).json({ success: false, mess: "Folder not found" });

        if (folder.level === 1) {
          const hasChildren = await MediaFolder.countDocuments({
            parent_id: folder._id,
            isDeleted: false,
          });
          if (hasChildren > 0) {
            return res.status(400).json({ success: false, mess: "Delete subfolders first" });
          }
        }

        const hasImages = await MediaImage.countDocuments({
          $or: [{ folder_id: folder._id }, { root_id: folder._id }],
          isDeleted: false,
        });
        const hasVideos = await MediaVideo.countDocuments({
          $or: [{ folder_id: folder._id }, { root_id: folder._id }],
          isDeleted: false,
        });
        if (hasImages > 0 || hasVideos > 0) {
          return res.status(400).json({ success: false, mess: "Folder still has media files" });
        }

        folder.isDeleted = true;
        await folder.save();
        return res.json({ success: true });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
    ListImages: async (req, res) => {
      try {
        const folderId = String(req.query.folder_id || "").trim();
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 30, 1), 100);
        const skip = (page - 1) * limit;
        const where = { isDeleted: false };
        if (folderId) where.folder_id = folderId;

        const [items, total] = await Promise.all([
          MediaImage.find(where).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
          MediaImage.countDocuments(where),
        ]);

        return res.json({
          success: true,
          data: items,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.max(Math.ceil(total / limit), 1),
          },
        });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, data: [] });
      }
    },
    UploadImage: async (req, res) => {
      try {
        const folderId = String(req.body.folder_id || "").trim();
        const file = req.file;
        if (!folderId) {
          return res.status(400).json({ success: false, mess: "Please choose subfolder" });
        }
        if (!file) return res.status(400).json({ success: false, mess: "No file" });

        const subfolder = await MediaFolder.findOne({
          _id: folderId,
          level: 2,
          isDeleted: false,
        });
        if (!subfolder) {
          return res.status(400).json({ success: false, mess: "Subfolder not found" });
        }
        const root = await MediaFolder.findOne({
          _id: subfolder.parent_id,
          level: 1,
          isDeleted: false,
        });
        if (!root) return res.status(400).json({ success: false, mess: "Root folder not found" });

        const parsed = path.parse(file.originalname);
        const ext = parsed.ext || ".png";
        const baseName = parsed.name || "image";
        const unique = `media-${baseName}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
        const relPath = `${subfolder.path}/${unique}`;
        const absPath = path.join(myPathConfig.public, relPath);
        safeMkdir(path.dirname(absPath));
        fs.writeFileSync(absPath, file.buffer);

        const created = await MediaImage.create({
          name: baseName,
          path: relPath,
          root_id: root._id,
          folder_id: subfolder._id,
        });
        return res.json({ success: true, data: created });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
    DeleteImage: async (req, res) => {
      try {
        const image = await MediaImage.findOne({ _id: req.params.id, isDeleted: false });
        if (!image) return res.status(404).json({ success: false, mess: "Image not found" });

        const absPath = path.join(myPathConfig.public, image.path);
        if (fs.existsSync(absPath)) {
          fs.unlinkSync(absPath);
        }
        image.isDeleted = true;
        await image.save();
        return res.json({ success: true });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
    ListVideos: async (req, res) => {
      try {
        const folderId = String(req.query.folder_id || "").trim();
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 30, 1), 100);
        const skip = (page - 1) * limit;
        const where = { isDeleted: false };
        if (folderId) where.folder_id = folderId;

        const [items, total] = await Promise.all([
          MediaVideo.find(where).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
          MediaVideo.countDocuments(where),
        ]);

        return res.json({
          success: true,
          data: items,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.max(Math.ceil(total / limit), 1),
          },
        });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, data: [] });
      }
    },
    UploadVideo: async (req, res) => {
      try {
        const folderId = String(req.body.folder_id || "").trim();
        const file = req.file;
        if (!folderId) {
          return res.status(400).json({ success: false, mess: "Please choose subfolder" });
        }
        if (!file) return res.status(400).json({ success: false, mess: "No video" });

        const subfolder = await MediaFolder.findOne({
          _id: folderId,
          level: 2,
          isDeleted: false,
        });
        if (!subfolder) {
          return res.status(400).json({ success: false, mess: "Subfolder not found" });
        }
        const root = await MediaFolder.findOne({
          _id: subfolder.parent_id,
          level: 1,
          isDeleted: false,
        });
        if (!root) return res.status(400).json({ success: false, mess: "Root folder not found" });

        const parsed = path.parse(file.originalname);
        const ext = parsed.ext || ".mp4";
        const baseName = parsed.name || "video";
        const unique = `media-video-${baseName}-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
        const relPath = `${subfolder.path}/${unique}`;
        const absPath = path.join(myPathConfig.public, relPath);
        safeMkdir(path.dirname(absPath));
        fs.writeFileSync(absPath, file.buffer);

        const created = await MediaVideo.create({
          name: baseName,
          path: relPath,
          root_id: root._id,
          folder_id: subfolder._id,
        });
        return res.json({ success: true, data: created });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
    DeleteVideo: async (req, res) => {
      try {
        const video = await MediaVideo.findOne({ _id: req.params.id, isDeleted: false });
        if (!video) return res.status(404).json({ success: false, mess: "Video not found" });

        const absPath = path.join(myPathConfig.public, video.path);
        if (fs.existsSync(absPath)) {
          fs.unlinkSync(absPath);
        }
        video.isDeleted = true;
        await video.save();
        return res.json({ success: true });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
  };
};

module.exports = mediaLibraryController;

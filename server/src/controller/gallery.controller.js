const CNAME = "gallery.controller.js ";
const VNAME = "admin/";
const myPathConfig = require("../config/myPath.config");
const path = require("path");
const fs = require("fs");
// const sharp = require("sharp");
const ImageEntity = require("../model/image.model");
const FolderEntity = require("../model/folder.model");
const galleryController = () => {
  //tao thu muc
  const pathDefault = "uploads/default";
  const pathPrefix = "uploads/imgs/";
  const pathPrefix2 = "uploads/dynamic/"; //folder: uploads/dynamic/
  const uploadDir = path.join(myPathConfig.public, pathPrefix);
  const uploadDir2 = path.join(myPathConfig.public, pathPrefix2);
  //fix
  const physicalPathDefault = path.join(myPathConfig.public, pathDefault);
  if (!fs.existsSync(physicalPathDefault)) {
    fs.mkdirSync(physicalPathDefault, { recursive: true });
  }

  function mySlugify(str) {
    return str
      .toLowerCase()
      .normalize("NFD") // tách dấu
      .replace(/[\u0300-\u036f]/g, "") // xoá dấu
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "") // xoá ký tự lạ
      .trim()
      .replace(/\s+/g, "_") // space -> _
      .replace(/_+/g, "_"); // tránh ___
  }
  async function GetAllFolder() {
    try {
      const folders = await FolderEntity.find({});
      return folders;
    } catch (error) {
      console.log(CNAME, error.message);
      return [];
    }
  }
  return {
    Index: async (req, res) => {
      try {
        const images = await ImageEntity.find().sort({ createdAt: -1 }).lean();
        let folders = await GetAllFolder();

        res.render(VNAME + "gallery", { images, folders });
      } catch (error) {
        console.log(CNAME, error.message);
        res.render(VNAME, +"gallery", { images: [], folders: [] });
      }
    },
    //upload cho .webp
    // UploadFile: async (req, res) => {
    //   try {
    //     const file = req.file;
    //     if (!file) {
    //       return res
    //         .status(400)
    //         .json({ success: false, mess: "ko co file upload" });
    //     }
    //     //
    //     if (!fs.existsSync(uploadDir)) {
    //       fs.mkdirSync(uploadDir, { recursive: true });
    //     }
    //     //tao ten file
    //     const fileOriginal = file.originalname;
    //     const fileName = path.parse(fileOriginal).name;
    //     const fUnique = `img-${fileName}-${Math.round(Math.random() * 1e9)}.webp`;

    //     const physicalDir = uploadDir + fUnique;
    //     //lu vao bo nho vat ly
    //     await sharp(req.file.buffer)
    //       // .resize(800)
    //       .webp({ quality: 85 })
    //       .toFile(physicalDir);
    //     // luu vao DB
    //     const image = new ImageEntity({
    //       name: fileName,
    //       path: pathPrefix + fUnique,
    //     });
    //     await image.save();
    //     // res.json({
    //     //   success: true,
    //     //   file: file
    //     // });
    //     res.redirect("/admin/gallery");
    //   } catch (error) {
    //     console.log(CNAME, error.message);
    //     // res.status(500).json({
    //     //     success: false, mess: error.message
    //     // })
    //     res.redirect("/admin/gallery");
    //   }
    // },
    //end
    //Ham nay hien ko dung nhưng vẫn giữ
    UploadFile: async (req, res) => {
      try {
        const file = req.file;
        if (!file) {
          return res
            .status(400)
            .json({ success: false, mess: "ko co file upload" });
        }

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Lấy tên + đuôi gốc
        const fileOriginal = file.originalname;
        const parsed = path.parse(fileOriginal);

        const fileName = parsed.name;
        const ext = parsed.ext; // .jpg, .png, .webp...

        // Tạo tên unique nhưng GIỮ NGUYÊN extension
        const fUnique = `img-${fileName}-${Math.round(Math.random() * 1e9)}${ext}`;

        const physicalDir = uploadDir + fUnique;

        // ✅ Lưu trực tiếp file gốc (không convert)
        fs.writeFileSync(physicalDir, file.buffer);

        // Lưu DB
        const image = new ImageEntity({
          name: fileName,
          path: pathPrefix + fUnique,
        });

        await image.save();

        res.redirect("/admin/gallery");
      } catch (error) {
        console.log(CNAME, error.message);
        res.redirect("/admin/gallery");
      }
    },
    DeleteImage: async (req, res) => {
      try {
        const _pathName = req.body.img_slug;
        if (!_pathName)
          return res.status(500).json({ success: false, mess: "no data" });

        // const file = await ImageEntity.findOne({path: _pathName});
        const result = await ImageEntity.findOneAndDelete({ path: _pathName });
        res.json({ success: true });
      } catch (error) {
        console.log(CNAME + error.message);
      }
    },
    DeleteImageAjax: async (req, res) => {
      try {
        const { img_path, folder_id } = req.body;

        if (!img_path) {
          return res.json({ success: false });
        }

        // xoá file vật lý
        const fullPath = path.join(process.cwd(), img_path);

        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }

        // xoá DB
        await ImageEntity.deleteOne({ path: img_path });

        // load lại ảnh folder
        let images;

        if (folder_id === "all") {
          images = await ImageEntity.find().sort({ _id: -1 });
        } else {
          images = await ImageEntity.find({ folder_id }).sort({ _id: -1 });
        }

        res.json({ success: true, images });
      } catch (err) {
        console.log(err);
        res.json({ success: false });
      }
    },
    // ajax
    GetAll: async (req, res) => {
      try {
        const imgs = await ImageEntity.find().sort({ updatedAt: -1 }).lean();
        return res.json({ success: true, data: imgs });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, data: [] });
      }
    },
    //=========Folder
    CreateFolder: async (req, res) => {
      try {
        const name = req.body.folder_name;
        if (!name)
          return res.status(400).json({ success: false, mess: "lose input" });
        const slug = mySlugify(name);
        //path vat ly
        const folderPath = `${pathPrefix2 + slug}`; //dynamic/+[folder_name]
        //path tuyet doi
        const absolutePath = path.join(myPathConfig.public, folderPath);
        //neu chua co thi tao
        if (!fs.existsSync(absolutePath)) {
          fs.mkdirSync(absolutePath, { recursive: true });
        }
        //check DB trung
        const exit = await FolderEntity.findOne({ path: folderPath });
        if (exit) {
          return res
            .status(400)
            .json({ success: false, mess: "folder is exit" });
        }
        await FolderEntity.create({
          name,
          path: folderPath,
        });
        res.json({ success: true, mess: "Tao folder success" });
      } catch (error) {
        console.log(CNAME, error.message);
        res.status(500).json({ success: false, mess: "Server error" });
      }
    },
    //ajax
    GetAllFolder: async (req, res) => {
      try {
        const folders = await FolderEntity.find({});
        return res.json({ success: true, folders: folders });
      } catch (error) {
        console.log(CNAME, error.message);
        res.status(500).json({ success: false, folders: [] });
      }
    },
    //get images by folder
    GetAllImageByFolder: async (req, res) => {
      try {
        const folderId = req.query.folder;

        let images;

        if (!folderId || folderId === "all") {
          images = await ImageEntity.find().sort({ createdAt: -1 });
        } else {
          images = await ImageEntity.find({ folder_id: folderId }).sort({
            createdAt: -1,
          });
        }

        res.json({ success: true, images });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
    },
    //upload .webp giam HD ~85%
    // UploadImage: async (req, res) => {
    //   try {
    //     const folderId = req.body.folder_id;
    //     const file = req.file;
    //     console.log("inra folderId: ", folderId);
    //     if (!file) {
    //       return res.json({ success: false, mess: "No file" });
    //     }

    //     // tìm folder
    //     let folder = null;
    //     if (folderId && folderId !== "all") {
    //       folder = await FolderEntity.findById(folderId);
    //       if (!folder)
    //         return res.json({ success: false, mess: "Folder not found" });
    //     }

    //     const slug = folder ? folder.path : pathDefault;
    //     console.log("path truyen len", slug);
    //     const folderPath = path.join(myPathConfig.public, slug);
    //     console.log("folder pre luu anh: ", folderPath);

    //     // ===== file name
    //     const original = file.originalname;
    //     const name = path.parse(original).name;

    //     const unique = `toppicare-${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`;

    //     const physicalPath = path.join(folderPath, unique);
    //     console.log("path co image ", physicalPath);
    //     // ===== sharp convert
    //     await sharp(file.buffer).webp({ quality: 85 }).toFile(physicalPath);

    //     // ===== save DB
    //     const img = await ImageEntity.create({
    //       name,
    //       path: `${slug}/${unique}`,
    //       folder_id: folder ? folder._id : null,
    //     });

    //     // ===== load lại ảnh
    //     let images;
    //     if (!folder) {
    //       images = await ImageEntity.find().sort({ _id: -1 });
    //     } else {
    //       images = await ImageEntity.find({ folder_id: folder._id }).sort({
    //         _id: -1,
    //       });
    //     }

    //     res.json({ success: true, images });
    //   } catch (err) {
    //     console.log(err);
    //     res.json({ success: false });
    //   }
    // },
    //end
    UploadImage: async (req, res) => {
      try {
        const folderId = req.body.folder_id;
        const file = req.file;

        if (!file) {
          return res.json({ success: false, mess: "No file" });
        }

        // ===== tìm folder
        let folder = null;
        if (folderId && folderId !== "all") {
          folder = await FolderEntity.findById(folderId);
          if (!folder)
            return res.json({ success: false, mess: "Folder not found" });
        }

        const slug = folder ? folder.path : pathDefault;
        const folderPath = path.join(myPathConfig.public, slug);

        // nếu folder chưa tồn tại thì tạo
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }

        // ===== file name
        const original = file.originalname;
        const parsed = path.parse(original);

        const name = parsed.name;
        const ext = parsed.ext; // .jpg .png .webp ...

        // giữ nguyên extension gốc
        const unique = `toppicare-${Date.now()}-${Math.round(
          Math.random() * 1e6,
        )}${ext}`;

        const physicalPath = path.join(folderPath, unique);

        // ✅ lưu file gốc (không dùng sharp)
        fs.writeFileSync(physicalPath, file.buffer);

        // ===== save DB
        const img = await ImageEntity.create({
          name,
          path: `${slug}/${unique}`,
          folder_id: folder ? folder._id : null,
        });

        // ===== load lại ảnh
        let images;
        if (!folder) {
          images = await ImageEntity.find().sort({ _id: -1 });
        } else {
          images = await ImageEntity.find({ folder_id: folder._id }).sort({
            _id: -1,
          });
        }

        res.json({ success: true, images });
      } catch (err) {
        console.log(err);
        res.json({ success: false });
      }
    },
    DeleteFolder: async (req, res) => {
      try {
        const { folder_id } = req.body;

        const folder = await FolderEntity.findById(folder_id);
        if (!folder) return res.json({ success: false });
        // 1. xoá file trong folder
        const folderPath = path.join(myPathConfig.public, folder.path);
        if (fs.existsSync(folderPath)) {
          console.log("co runday ?");
          fs.rmSync(folderPath, { recursive: true, force: true });
        } else {
          console.log("ko ton tai folder");
          return res.status(500).json({ success: false, mess: "xoa loi" });
        }

        //C:\Workspaces\my_projects\toppicare\server\public\uploads\dynamic\xin_chao
        // 2. xoá images DB
        await ImageEntity.deleteMany({ folder_id });

        // 3. xoá folder DB
        await FolderEntity.deleteOne({ _id: folder_id });

        res.json({ success: true });
      } catch (err) {
        console.log(err);
        res.json({ success: false });
      }
    },
  };
};

module.exports = galleryController;

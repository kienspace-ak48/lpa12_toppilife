const jwt= require("jsonwebtoken");
const userModel = require("../model/user.model");

const CNAME = 'auth.middleware.js ';
const ADMIN_ROLES = new Set(["admin", "super_admin"]);


async function auth(req, res, next){
    // const count = await contactService.countNewNotPartner();
    // res.locals.count = count;
    //res.locals.user = {email: "admin@gmail.com",username: "kien_vu", name:"KienVu"};
    // return next();
    const token = req.cookies?.token ||(req.headers?.authorization && req.headers?.authorization.split(' ')[1]);
    if(!token){
        return res.redirect('/auth/admin/login')
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const getInfoLogin =await userModel.findById(decoded.id).select("_id name username email role").lean();
        if(!getInfoLogin){
            res.clearCookie("token", { path: "/" });
            return res.redirect('/auth/admin/login');
        }
        if(!ADMIN_ROLES.has(String(getInfoLogin.role || "").trim())){
            res.clearCookie("token", { path: "/" });
            return res.render("pages/login", {
                layout: false,
                success: false,
                mess: "Tài khoản không có quyền truy cập trang quản trị.",
            });
        }
        req.user = getInfoLogin;
         // 👇 cho EJS dùng global
        res.locals.user = getInfoLogin;

        next();
    } catch (error) {
        console.log(CNAME, error.message);
        // return res.status(401).json({success: false, data: 'Token loi'});
        return res.redirect('/auth/admin/login')

    }
}

module.exports = auth;
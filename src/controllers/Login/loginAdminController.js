const TaiKhoan_Admin = require("../../models/TaiKhoan_Admin")
module.exports = {
    // Trang đăng nhập
    formLoginAdmin: async (req, res) => {
        res.render("ADMINQL/Login/loginAdmin.ejs")
    },

    // xử lý đăng nhập
    LoginAdmin: async (req, res) => {
            let tk = req.body.TaiKhoan
            let matkhau = req.body.MatKhau
            console.log("tk: ",tk);
            console.log("matkhau: ",matkhau);
            // Check if the user exists
            const user = await TaiKhoan_Admin.findOne({ TaiKhoan: tk, MatKhau: matkhau });
            if (!user) {
                return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
            }                               
            
            // Lưu trạng thái đăng nhập vào session
            req.session.loggedIn = true
			req.session.tk = user.HoTen
			req.session.user = user
            console.log("user: ", user); 
        
            return res.status(200).json({ success: true, message: 'Đăng nhập thành công' });
    },
    LogoutAdmin: (req, res) => {
        if (req.session.tk) {
            req.session.destroy();
        }
        // req.logout();
        res.redirect("/loginAdmin");
    },


}
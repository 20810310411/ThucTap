const TaiKhoan_KH = require("../../models/TaiKhoan_KH")
const Cart = require("../../models/Cart")

module.exports = {

    getFormLoginKH: async (req, res) => {
        let hoten = req.session.hoten
        let loggedIn = req.session.loggedIn
        res.render("HOME/Layouts/LoginKH/loginKH.ejs"), {
            hoten, loggedIn
        }
    },
    DangKyKH: async (req, res) => {
        let TenDangNhap = req.body.acc
        let MatKhau = req.body.pass
        let HoTen = req.body.name


        const kt = await TaiKhoan_KH.findOne({ TenDangNhap: TenDangNhap });
        if (kt) {
            return res.status(400).json({ success: false, message: 'Tài Khoản Đã Tồn Tại' });
        }
        if (!MatKhau) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        let newKH = await TaiKhoan_KH.create({
            TenDangNhap,
            MatKhau,
            HoTen
        });

        return res.status(201).json({ success: true, message: 'Đăng ký tài khoản thành công' });
    },

    DangNhapKH: async (req, res) => {
        let taikhoan = req.body.taikhoan
        let matkhau = req.body.matkhau
        var sessions

         // Mặc định đặt loggedIn là false
        req.session.loggedIn = false;

        // Check if the user exists
        const user = await TaiKhoan_KH.findOne({ TenDangNhap: taikhoan, MatKhau: matkhau });
        if (!user) {            
            return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
        }                      

        req.session.loggedIn = true
        req.session.taikhoan = taikhoan
        req.session.hoten = user.HoTen
        req.session.userId = user._id
        req.user = { _id: user._id };
        if (user) {
            // Nếu đã đăng nhập, kiểm tra xem có giỏ hàng trong database không
            let cart = await Cart.findOne({ 'MaTKKH': user._id });

            if (!cart) {
                cart = new Cart({
                    cart: {
                        items: [],
                        totalPrice: 0,
                        totalQuaty: 0,
                    },
                    MaTKKH: user._id,
                });
                await cart.save();
            }

            // Đặt thông tin giỏ hàng trong phiên
            req.session.cartId = cart._id;
        }
        sessions=req.session
        console.log("sessions:",sessions)
        return res.status(200).json({ success: true, message: 'Đăng nhập thành công' });
    },
    DangXuatKH: async (req, res) => {
        if (req.session.taikhoan) {
            // Kiểm tra xem có giỏ hàng trong session hay không
            if (req.session.cartId) {

                // khi login thì sẽ có giỏ hàng khi add, khi logout đi sẽ xóa luôn trong db đi
                // await Cart.findByIdAndDelete(req.session.cartId);
                // Nếu có giỏ hàng, xóa giỏ hàng
                req.session.cartId = null;
            }
            req.session.destroy();
        }
        res.redirect("/")
    },
}
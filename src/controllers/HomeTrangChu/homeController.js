const SanPham = require("../../models/SanPham");
const Cart = require("../../models/Cart");
const LoaiSP = require("../../models/LoaiSP");
require('rootpath')()
module.exports = {
    getTrangChu: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.taikhoan
        let hoten = req.session.hoten
        let loggedIn = req.session.loggedIn
        const sanphamGioHang = await Cart.findOne({ MaTKKH: req.session.userId }).populate('cart.items.productId').exec();
        // định dạng tiền
        function formatCurrency(amount) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        }

        // edit file img
        function getRelativeImagePath(absolutePath) {
            const rootPath = '<%= rootPath.replace(/\\/g, "\\\\") %>';
            const relativePath = absolutePath ? absolutePath.replace(rootPath, '').replace(/\\/g, '/').replace(/^\/?images\/upload\//, '') : '';
            return relativePath;
        }
        let noibat = await SanPham.find({ NB_BC: "Nổi bật" }).exec()
        let banchay = await SanPham.find({ NB_BC: "Bán chạy" }).exec()
        let loaisp = await LoaiSP.find().exec()
        res.render("home.ejs", {
            loaisp, sanphamGioHang, taikhoan, loggedIn, hoten, noibat, banchay, formatCurrency, getRelativeImagePath, rootPath: '/'
        })
    },

    ThongTinTK: async (req, res) => {
        let hoten = req.session.hoten
        let loggedIn = req.session.loggedIn
        let loaisp = await LoaiSP.find().exec()
        const sanphamGioHang = await Cart.findOne({ MaTKKH: req.session.userId }).populate('cart.items.productId').exec();
        // let TaiKhoan = req.session.taikhoan
        // let NgayTao = req.session.ngaytao
        // let idKhachHang = req.session.userId

        // // hiển thị kiểu phân loại
        // let loaiSP = await LoaiSP.find().exec();
        // const tongSL = [];
        // for (const loaiSp of loaiSP) {
        //     const soLuongSanPham = await SanPham.countDocuments({ IdLoaiSP: loaiSp._id });
        //     tongSL.push({ TenLoaiSP: loaiSp.TenLoaiSP, soLuongSanPham, IDLoaiSP: loaiSp._id });
        // }

        // let TimKiemSP = req.query.TimKiemSP
        // // Lưu trữ giá trị tìm kiếm trong session hoặc cookie
        // req.session.TimKiemSP = TimKiemSP;
        // const all = await SanPham.find({ TenSP: { $regex: new RegExp(TimKiemSP, 'i') } }).populate('IdLoaiSP').exec();
        // // Hàm để định dạng số tiền thành chuỗi có ký tự VND
        function formatCurrency(amount) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        }

        // // edit file img
        function getRelativeImagePath(absolutePath) {
            const rootPath = '<%= rootPath.replace(/\\/g, "\\\\") %>';
            const relativePath = absolutePath ? absolutePath.replace(rootPath, '').replace(/\\/g, '/').replace(/^\/?images\/upload\//, '') : '';
            return relativePath;
        }

        // // sản phẩm bán chạy (SoLuongBan > 100)
        // const spBanChay = await SanPham.find({ SoLuongBan: { $gt: 100 } });

        // //xulydonhangcuakhachhang
        // //const showHDChuaGiao = await HoaDon.find({ MaKH: idKhachHang, TinhTrangDonHang: "Chưa giao hàng" }).populate("cart.items.productId").exec()

        // const showHDChuaGiaoWithVietnamTime = showHDChuaGiao.map(item => ({
        //     ...item._doc,
        //     NgayLap: convertToVietnamTime(item.NgayLap)
        // }));

        // const showHDDangGiao = await HoaDon.find({ MaKH: idKhachHang, TinhTrangDonHang: "Đang giao hàng" }).populate("cart.items.productId").exec()


        // const showHDDangGiaoWithVietnamTime = showHDDangGiao.map(item => ({
        //     ...item._doc,
        //     NgayLap: convertToVietnamTime(item.NgayLap)
        // }));

        // const showHDDaGiao = await HoaDon.find({ MaKH: idKhachHang, TinhTrangDonHang: "Đã giao hàng" }).populate("cart.items.productId").exec()

        // const showHDDaGiaoWithVietnamTime = showHDDaGiao.map(item => ({
        //     ...item._doc,
        //     NgayLap: convertToVietnamTime(item.NgayLap)
        // }));
        // const showHDDaHuy = await HoaDon.find({ MaKH: idKhachHang, TinhTrangDonHang: "Hủy Đơn Hàng" }).populate("cart.items.productId").exec()

        // // let numPage_daHuy = parseInt((await HoaDon.find({ TinhTrangDonHang: "Đã Thanh Toán"}).populate("cart.items.productId")).length) / limit_daHuy
        // // numPage_daHuy = numPage_daHuy - parseInt(numPage_daHuy) === 0 ? numPage_daHuy : numPage_daHuy + 1

        // const showHDDaHuyWithVietnamTime = showHDDaHuy.map(item => ({
        //     ...item._doc,
        //     NgayLap: convertToVietnamTime(item.NgayLap)
        // }));

        res.render("HOME/Layouts/ThongTinTK/ThongTinTK.ejs", {
            formatCurrency, getRelativeImagePath, hoten, loggedIn, loaisp, sanphamGioHang
            // sanpham: all, 
            // TaiKhoan,
            // NgayTao: convertToVietnamTime(NgayTao),
            // rootPath: '/',

        })
    },


}
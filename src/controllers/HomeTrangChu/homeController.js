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

}
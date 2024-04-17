const SanPham = require("../../models/SanPham");
const LoaiSP = require("../../models/LoaiSP");
const Cart = require("../../models/Cart");

module.exports = {
    TrangChiTietSP: async (req, res) => {
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
        let id = req.query.id
        let allsp = await SanPham.find().exec()
        const ctsp = await SanPham.findById(id).populate("IdLoaiSP")
        let loaisp = await LoaiSP.find().exec()
        res.render("HOME/Layouts/ChiTietSP/ChiTietSP.ejs", {
            loaisp, sanphamGioHang, hoten, loggedIn, ctsp, allsp, formatCurrency, getRelativeImagePath, rootPath: '/'
        })
    },
}
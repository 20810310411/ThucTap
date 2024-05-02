const SanPham = require("../../models/SanPham");
const LoaiSP = require("../../models/LoaiSP");
const Cart = require("../../models/Cart");

require('rootpath')()
module.exports = {
    getHomePhanTrang_TimSP: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/searchSP?page=${req.query.page}&tenSPSearch=${req.session.tenSPSearch}`)
        }
        res.redirect(`/searchSP`)
    },
    TimSanPham: async (req, res) => {
        let hoten = req.session.hoten
        let loggedIn = req.session.loggedIn
        let tenSPSearch = req.query.tenSPSearch
        let idPL = req.query.idPL
        req.session.idPL = idPL;
        let page = 1
        const limit = 6
        req.session.tenSPSearch = tenSPSearch

        if (req.query.page) {
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }

        let skip = (page - 1) * limit
        const allsp = await SanPham.find(({ TenSP: { $regex: new RegExp(tenSPSearch, 'i') } })).skip(skip).limit(limit).exec()

        let numPage = parseInt((await SanPham.find({ TenSP: { $regex: new RegExp(tenSPSearch, 'i') } })).length) / limit

        numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1

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

        const sanphamGioHang = await Cart.findOne({ MaTKKH: req.session.userId }).populate('cart.items.productId').exec();
        // hiển thị kiểu phân loại
        let loaisp = await LoaiSP.find().exec();
        const tongSL = [];
        for (const loaiSp of loaisp) {
            const soLuongSanPham = await SanPham.countDocuments({ IdLoaiSP: loaiSp._id });
            tongSL.push({ TenLoaiSP: loaiSp.TenLoaiSP, soLuongSanPham, IDLoaiSP: loaiSp._id });
        }


        res.render("HOME/Layouts/SearchSP/SearchSP.ejs", {
             allsp, timSearch:req.session.tenSPSearch , soTrang: numPage, 
            curPage: page, sanphamGioHang, loaisp, hoten, loggedIn, tongSL, formatCurrency, getRelativeImagePath, rootPath: '/'
        })
    },
}

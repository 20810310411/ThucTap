const SanPham = require("../../models/SanPham");
const LoaiSP = require("../../models/LoaiSP");
const Cart = require("../../models/Cart");

require('rootpath')()
module.exports = {
    getHomePhanTrang_ALLSP: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/TrangSP?page=${req.query.page}`)
        }
        res.redirect(`/TrangSP`)
    },
    getHomePhanTrang_PLSP: (req, res) => { 
        if (req.query.page) {
            let idPL = req.query.idPL
            return res.redirect(`/TrangSP?page=${req.query.page}&idPL=${idPL}`)
        }
        res.redirect(`/TrangSP`)
    },
    TrangSanPham: async (req, res) => {
        let hoten = req.session.hoten
        let loggedIn = req.session.loggedIn
        let idPL = req.query.idPL
        req.session.idPL = idPL;

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

        let page = 1
        const limit = 6
        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }
        
        let skip = (page - 1) * limit
        if(idPL){
            const allsp = await SanPham.find({IdLoaiSP:idPL}).skip(skip).limit(limit).exec()

            let numPage = parseInt((await SanPham.find({IdLoaiSP:idPL})).length) / limit  

            numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1

            res.render("HOME/Layouts/TrangSP/TrangSP.ejs", {
                 loaisp, sanphamGioHang, hoten, loggedIn, allsp, tongSL, searchSPP:req.session.idPL,
                 soTrang: numPage, 
                 curPage: page, formatCurrency, getRelativeImagePath, rootPath: '/'
            })
        }
        else{
            const allsp = await SanPham.find().skip(skip).limit(limit).exec()

            let numPage = parseInt((await SanPham.find()).length) / limit  

            numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1

            res.render("HOME/Layouts/TrangSP/TrangSP.ejs", {
                 loaisp, sanphamGioHang, hoten, loggedIn, allsp, tongSL, searchSPP:req.session.idPL,
                 soTrang: numPage, 
                 curPage: page, formatCurrency, getRelativeImagePath, rootPath: '/'
            })
        }

        

    }
}
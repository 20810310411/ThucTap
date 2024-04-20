const SanPham = require("../../models/SanPham");
const LoaiSP = require("../../models/LoaiSP");
const Cart = require("../../models/Cart");

require('rootpath')()
module.exports = {
    TrangSanPham: async (req, res) => {
        let hoten = req.session.hoten
        let loggedIn = req.session.loggedIn
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
        let loaiSP = await LoaiSP.find().exec();
        const tongSL = [];
        for (const loaiSp of loaiSP) {
            const soLuongSanPham = await SanPham.countDocuments({ IdLoaiSP: loaiSp._id });
            tongSL.push({ TenLoaiSP: loaiSp.TenLoaiSP, soLuongSanPham, IDLoaiSP: loaiSp._id });
        }
        
        let tenSPSearch = req.query.tenSPSearch
        let idPL = req.query.idPL
        req.session.idPL = idPL;
        if(idPL){
            let allsp = await SanPham.find({IdLoaiSP: idPL}).exec() 
            let loaisp = await LoaiSP.find().exec()   
            res.render("HOME/Layouts/TrangSP/TrangSP.ejs", {
                loaisp, sanphamGioHang, hoten, loggedIn, allsp, tongSL, formatCurrency, getRelativeImagePath, rootPath: '/'
            })
        }
        else if(tenSPSearch){
            const allsp = await SanPham.find({TenSP: { $regex: new RegExp(tenSPSearch, 'i') }}).populate('IdLoaiSP').exec();
            let loaisp = await LoaiSP.find().exec()   
            res.render("HOME/Layouts/TrangSP/TrangSP.ejs", {
                loaisp, sanphamGioHang, hoten, loggedIn, allsp, tongSL, formatCurrency, getRelativeImagePath, rootPath: '/'
            })
        } else {
            let loaisp = await LoaiSP.find().exec()   
            let allsp = await SanPham.find({}).exec() 
            res.render("HOME/Layouts/TrangSP/TrangSP.ejs", {
                loaisp, sanphamGioHang, hoten, loggedIn, allsp, tongSL, formatCurrency, getRelativeImagePath, rootPath: '/'
            })
        }

    },

}
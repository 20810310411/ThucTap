const LoaiSP = require("../../../models/LoaiSP");
const SanPham = require("../../../models/SanPham");


require('rootpath')()
module.exports = {
    // phân trang ...
    getQLloaiSP: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn
        let page = 1
        const limit = 2

        if (req.query.page) {
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }

        let skip = (page - 1) * limit
        const LoaiSanPham = await LoaiSP.find().skip(skip).limit(limit).exec()

        let numPage = parseInt((await LoaiSP.find()).length) / limit

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
        res.render("ADMINQL/QuanLy/QL_LoaiSP/homeLoaiSP.ejs",
            {
                LoaiSanPham, loggedIn, taikhoan, soTrang: numPage,
                curPage: page, getRelativeImagePath, formatCurrency, rootPath: '/'
            })
    },
    getThemLoaiSanPham: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn

        const LoaiSanPham = await LoaiSP.find().exec()

        res.render("ADMINQL/QuanLy/QL_LoaiSP/createLoaiSP.ejs",
            {
                LoaiSanPham, loggedIn, taikhoan,
            })
    },

    ThemLoaiSanPham: async (req, res) => {
        let TenLoaiSP = req.body.TenLoaiSP

        console.log("ten loai sp: ", TenLoaiSP);

        let LSP = await LoaiSP.create({
            TenLoaiSP: TenLoaiSP,
        })

        if (LSP) {
            console.log(">>> check kq: ", LSP);
            return res.status(200).json({
                message: "Bạn đã thêm mới loại sản phẩm thành công!",
                success: true,
                errCode: 0,
                data: LSP
            })
        } else {
            return res.status(500).json({
                message: "Bạn thêm mới loại sản phẩm thất bại!",
                success: false,
                errCode: -1,
            })
        }
    },

    getSuaLoaiSanPham: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn

        let idSua = req.query.idSua
        let SuaLoaiSanPham = await LoaiSP.findById(idSua).exec()


        res.render("ADMINQL/QuanLy/QL_LoaiSP/editLoaiSP.ejs",
            {
                SuaLoaiSanPham, loggedIn, taikhoan,
            })
    },
    SuaLoaiSanPham: async (req, res) => {
        let id = req.params.idSua
        let TenLoaiSP = req.body.TenLoaiSP

        console.log("ten loai sp: ", TenLoaiSP);


        let updateLSP = await LoaiSP.findByIdAndUpdate({ _id: id }, {
            TenLoaiSP: TenLoaiSP,
        })

        if (updateLSP) {
            console.log(">>> check updateSP: ", updateLSP);
            return res.status(200).json({
                message: "Bạn đã chỉnh sửa loại sản phẩm thành công!",
                success: true,
                errCode: 0,
                data: updateLSP
            })
        } else {
            return res.status(500).json({
                message: "Bạn chỉnh sửa loại sản phẩm thất bại!",
                success: false,
                errCode: -1,
            })
        }
    },
    XoaLoaiSanPham: async (req, res) => {
        let idXoa = req.params.idXoa
        console.log('ssssss', idXoa);
        // dùng delete thì db vẫn còn, chỉ là nó có trường deleted: true
        // nếu dùng deleteOne thì db mất luôn
        let xoaSP = await LoaiSP.deleteOne({ _id: idXoa })

        return res.status(200).json({
            message: "Bạn đã xóa loại sản phẩm thành công!",
            success: true,
            KQ: 0,
            data: xoaSP
        })
    },

}
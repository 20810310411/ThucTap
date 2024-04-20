const SanPham = require("../../../models/SanPham");


require('rootpath')()
module.exports = {
    // phân trang ...
    getHomePhanTrang_QLSP: (req, res) => { 
        if (req.query.page) {
            return res.redirect(`/trangQLSP?page=${req.query.page}`)
        }
        res.redirect(`/trangQLSP`)
    },

    getQLSP: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn
        let page = 1
        const limit = 6
        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }
        
        let skip = (page - 1) * limit
        const all = await SanPham.find().populate('IdLoaiSP').skip(skip).limit(limit).exec()

        let numPage = parseInt((await SanPham.find()).length) / limit
        
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
        res.render("ADMINQL/QuanLy/QL_SanPham/homeSanPham.ejs",
            {
                all, loggedIn, taikhoan, soTrang: numPage, 
                curPage: page, getRelativeImagePath, formatCurrency, rootPath: '/'
            })
    },

}
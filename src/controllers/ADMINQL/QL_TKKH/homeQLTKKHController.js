const TaiKhoan_KH = require("../../../models/TaiKhoan_KH");
const moment = require('moment-timezone');

require('rootpath')();
// Hàm chuyển đổi ngày giờ sang múi giờ Việt Nam
function convertToVietnamTime(dateTime) {
    // 'Asia/Ho_Chi_Minh' là mã của múi giờ Việt Nam
    return moment(dateTime).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY ');
}

module.exports = {

    getQLTKKH: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn

        let page = 1
        const limit = 5
        
        if(req.query.page){
            page = req.query.page
            page = page < 1 ? page + 1 : page
        }
        
        let skip = (page - 1) * limit
        const allTKKH = await TaiKhoan_KH.find().skip(skip).limit(limit).exec()

        let numPage = parseInt((await TaiKhoan_KH.find()).length) / limit
        
        numPage = numPage - parseInt(numPage) === 0 ? numPage : numPage + 1

        const allTKKhachHangnWithVietnamTime = allTKKH.map(item => ({
            ...item._doc,
            NgayTao: convertToVietnamTime(item.NgayTao)
        }));
       
        res.render("ADMINQL/QuanLy/QL_KHACHHANG/homeKhachHang.ejs",
            {
                allTKKH, loggedIn, taikhoan, soTrang: numPage, 
                curPage: page, QLtaikhoan_kh: allTKKhachHangnWithVietnamTime, rootPath: '/'
            })
    },
    XoaTKKH: async (req, res) => {
        let idXoa = req.params.idXoa
        console.log("idXoa: ", idXoa)

        // dùng delete thì db vẫn còn, chỉ là nó có trường deleted: true
        // nếu dùng deleteOne thì db mất luôn
        let xoaKH = await TaiKhoan_KH.deleteOne({ _id: idXoa })

        return res.status(200).json({
            message: "Bạn đã xóa tài khoản khách hàng thành công!",
            success: true,
            KQ: 0,
            data: xoaKH
        })
    },

}
const LoaiSP = require("../../../models/LoaiSP");
const SanPham = require("../../../models/SanPham");
const { uploadSingleFile } = require("../../../services/services")




module.exports = {
    formInsertSP: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn
        let loaiSP = await LoaiSP.find({}).exec()
        console.log("loaiSP: ", loaiSP);
        res.render("ADMINQL/QuanLy/QL_SanPham/createSanPham.ejs",
            {
                loaiSP, loggedIn, taikhoan
            })
    },

    nutThemSP: async (req, res) => {
        let TenSP = req.body.TenSP;
        let GiaBan = req.body.GiaBan;
        let GiaCu = req.body.GiaCu;
        let SoLuongTon = req.body.SoLuongTon;
        let ThuocTinh = req.body.ThuocTinh;
        let IdLoaiSP = req.body.IdLoaiSP;
        let NB_BC = req.body.NB_BC;
        let imageUrl = ""
        let imageUrl1 = ""
        let imageUrl2 = ""
        let MoTa = req.body.MoTa;
        if (!req.files || Object.keys(req.files).length === 0) {
            // khong lam gi
        }
        else {
            let kq = await uploadSingleFile(req.files.Image)
            let kq1 = await uploadSingleFile(req.files.Image1)
            let kq2 = await uploadSingleFile(req.files.Image2)
            imageUrl = kq.path
            imageUrl1 = kq1.path
            imageUrl2 = kq2.path
            console.log(">>> check kq: ", kq.path);
        }
        let SP = await SanPham.create({
            TenSP: TenSP,
            IdLoaiSP: IdLoaiSP,
            GiaBan: GiaBan,
            GiaCu: GiaCu,
            SoLuongTon: SoLuongTon,
            MoTa: MoTa,
            ThuocTinh: ThuocTinh,
            Image: imageUrl,
            Image1: imageUrl1,
            Image2: imageUrl2,
            NB_BC: NB_BC,
        })

        if (SP) {
            console.log(">>> check kq: ", SP);
            return res.status(200).json({
                message: "Bạn đã thêm mới sản phẩm thành công!",
                success: true,
                errCode: 0,
                data: SP
            })
        } else {
            return res.status(500).json({
                message: "Bạn thêm mới sản phẩm thất bại!",
                success: false,
                errCode: -1,
            })
        }
    },



}

const LoaiSP = require("../../../models/LoaiSP");
const SanPham = require("../../../models/SanPham");
const { uploadSingleFile } = require("../../../services/services")




module.exports = {
    formUpdateSP: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.tk
        let loggedIn = sessions.loggedIn
        let idSuaSP = req.query.idSuaSP
        let loaiSP = await LoaiSP.find({}).exec()
        let nutSuaSP = await SanPham.findById(idSuaSP).populate('IdLoaiSP').exec()
        console.log("loaiSP: ", loaiSP);
        res.render("ADMINQL/QuanLy/QL_SanPham/editSanPham.ejs",
            {
                loaiSP, nutSuaSP, loggedIn, taikhoan
            })
    },

    nutSuaSP: async (req, res) => {
        let id = req.params.idSuaSP
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
            imageUrl = req.body.noFileSelected1
            imageUrl1 = req.body.noFileSelected2
            imageUrl2 = req.body.noFileSelected3
        }
        else {
            if (req.files.Image) {
                let kq = await uploadSingleFile(req.files.Image);
                imageUrl = kq.path;
            }
            if (req.files.Image1) {
                let kq = await uploadSingleFile(req.files.Image1);
                imageUrl1 = kq.path;
            }
            if (req.files.Image2) {
                let kq = await uploadSingleFile(req.files.Image2);
                imageUrl2 = kq.path;
            }
        }
        let updateSP = await SanPham.findByIdAndUpdate({ _id: id }, {
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

        if (updateSP) {
            console.log(">>> check kq: ", updateSP);
            return res.status(200).json({
                message: "Bạn đã sửa sản phẩm thành công!",
                success: true,
                errCode: 0,
                data: updateSP
            })
        } else {
            return res.status(500).json({
                message: "Bạn sửa sản phẩm thất bại!",
                success: false,
                errCode: -1,
            })
        }
    },



}

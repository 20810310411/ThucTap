const express = require('express');
const fs = require('fs').promises;

// ADMINQL
// HomeAdminController
const { getTrangChuAdmin } = require("../controllers/ADMINQL/HomeAdmin/homeAdminController");
// LoginAdminController
const { formLoginAdmin, LoginAdmin, LogoutAdmin } = require("../controllers/Login/loginAdminController");
// QL_TaiKhoanKhachHang
const { getQLTKKH, XoaTKKH } = require("../controllers/ADMINQL/QL_TKKH/homeQLTKKHController");
// QL_SanPhamController
const { getQLSP, getHomePhanTrang_QLSP } = require("../controllers/ADMINQL/QL_SanPham/homeQLSPController");
const { formInsertSP, nutThemSP, } = require("../controllers/ADMINQL/QL_SanPham/createSPController");
const { formUpdateSP, nutSuaSP, } = require("../controllers/ADMINQL/QL_SanPham/editSPController");
// QL_LoaiSanPhamController
const { getQLloaiSP, getThemLoaiSanPham, ThemLoaiSanPham, getSuaLoaiSanPham, SuaLoaiSanPham, XoaLoaiSanPham  } = require("../controllers/ADMINQL/QL_LoaiSP/homeLoaiSPController");
// QL_HoaDonController
const { getQLHD } = require("../controllers/ADMINQL/QL_HoaDon/homeQLHDController");

//  -------------------------------------------
// HOME
// HomeTrangChuController
const { getTrangChu, ThongTinTK } = require("../controllers/HomeTrangChu/homeController");
// TrangSPController 
const { TrangSanPham, getHomePhanTrang_ALLSP, getHomePhanTrang_PLSP  } = require("../controllers/TrangSP/TrangSPController");
// TimKiemSPController 
const { TimSanPham, getHomePhanTrang_TimSP } = require("../controllers/SearchSP/searchSPController");
// Trang Chi tiết sản phẩm controller
const { TrangChiTietSP, } = require("../controllers/ChiTietSP/chitietSPController");
// Trang Giỏ hàng controller
const { getGioHang, ThemGioHang, thongtinGioHang, getSuaGioHang, SuaSoLuongSanPham, XoaGioHang } = require("../controllers/GioHang/GioHangController"); 
// Trang Checkout controller
const { getCheckout, datHang } = require("../controllers/Checkout/CheckoutController"); 


// Login khách hàng
const { getFormLoginKH, DangKyKH, DangNhapKH, DangXuatKH } = require('../controllers/Login/loginKHController'); 

const router = express.Router();
//  -------------------------------------------

// ADMIN 
router.get("/logoutAdmin", LogoutAdmin)
router.get("/loginAdmin", formLoginAdmin)
router.post("/login-Admin", LoginAdmin)
router.get("/TrangChuAdmin", getTrangChuAdmin)

// KHACH HÀNG
router.get("/TrangQLTKKH", getQLTKKH)
router.delete("/xoataikhoankh/:idXoa", XoaTKKH)

// Quản lý sản phẩm
router.get("/trangQLSP", getQLSP)
router.get("/trangQLSP", getHomePhanTrang_QLSP)
router.get("/formThemSP", formInsertSP)
router.post("/ThemSP", nutThemSP)
router.get("/formSuaSP", formUpdateSP)
router.put("/SuaSP/:idSuaSP", nutSuaSP)

// Quản lý loại sản phẩm
router.get("/trangQLloaiSP", getQLloaiSP)
router.get("/trangThemloaiSP", getThemLoaiSanPham)
router.post("/themloaisanpham", ThemLoaiSanPham)
router.get("/trangSualoaiSP", getSuaLoaiSanPham)
router.put("/sualoaisanpham/:idSua", SuaLoaiSanPham)
router.delete("/xoaloaisanpham/:idXoa", XoaLoaiSanPham)

// Quản lý hóa đon
router.get("/trangQLHD", getQLHD)

//  -------------------------------------------
// TRANG CHU
router.get("/", getTrangChu)

// SAN PHAM
router.get("/TrangSP", TrangSanPham)
router.get("/TrangSP", async (req,res)=> {
    if (req.query.idPL){
        return getHomePhanTrang_PLSP (req,res)
    }
    else if (!req.query.idPL){
        return getHomePhanTrang_ALLSP ( req,res)
    }
    else {
        res.redirect("/TrangSP")
    }
})
router.get("/ChiTietSP", TrangChiTietSP)
router.get("/searchSP", TimSanPham)
router.get("/searchSP", getHomePhanTrang_TimSP) 



//GioHang 
router.get("/thongtingiohang", thongtinGioHang)
router.get("/TrangGioHang", getGioHang)
router.post("/ThemGioHang", ThemGioHang)
router.get("/TrangSuaGioHang", getSuaGioHang)
router.post("/SuaGioHang", SuaSoLuongSanPham)
router.post("/XoaGioHang", XoaGioHang)

//Checkout 
router.get("/TrangCheckout", getCheckout)
router.post("/dat-hang", datHang)

// thông tin tài khoản
router.get("/ThongTinTk", ThongTinTK)



// LOGIN Tai Khoan Khach Hang
router.get("/loginKH", getFormLoginKH)
router.post("/DangKyKH", DangKyKH)
router.post("/DangNhapKH", DangNhapKH)
router.get("/DangXuatKH", DangXuatKH)

// upload hình ảnh trong phần thêm/chỉnh sửa sản phẩm phía admin textarea
const path = require('path');


async function uploadSingleFile(file) {
    // Implement the logic to upload the file here
    // Example logic for uploading the file to a specific directory:
    const uploadPath = path.resolve(__dirname, "../public/images/upload/");
    const fileName = file.name;
    const filePath = `${uploadPath}/${fileName}`;
    await fs.writeFile(filePath, file.data);
    
    // Return the result of the upload operation
    return {
        status: "thanh cong",
        path: filePath,
        error: null
    };
}
router.post('/upload', async (req, res) => {
    try {
        const file = req.files.upload;
        const result = await uploadSingleFile(file);

        if (result.status === "thanh cong") {
            const fileName = path.basename(result.path);
            const url = `/images/upload/${fileName}`;
            const msg = 'Upload thành công!';
            const funcNum = req.query.CKEditorFuncNum;
            console.log({ url, msg, funcNum });
            res.status(201).send(`<script>window.parent.CKEDITOR.tools.callFunction('${funcNum}','${url}','${msg}');</script>`);
        } else {
            console.error("File upload failed:", result.error);
            res.status(500).send('Internal server error');
        }
    } catch (error) {
        console.error("Error uploading file:", error.message);
        res.status(500).send('Internal server error');
    }
});


module.exports = router;
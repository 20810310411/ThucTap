const express = require('express');

// ADMINQL
// HomeAdminController
const { getTrangChuAdmin } = require("../controllers/ADMINQL/HomeAdmin/homeAdminController");
// LoginAdminController
const { formLoginAdmin, LoginAdmin } = require("../controllers/Login/loginAdminController");
// QL_SanPhamController
const { getQLSP, } = require("../controllers/ADMINQL/QL_SanPham/homeQLSPController");
const { formInsertSP, nutThemSP, } = require("../controllers/ADMINQL/QL_SanPham/createSPController");
const { formUpdateSP, nutSuaSP, } = require("../controllers/ADMINQL/QL_SanPham/editSPController");

//  -------------------------------------------
// HOME
// HomeTrangChuController
const { getTrangChu, } = require("../controllers/HomeTrangChu/homeController");
// TrangSPController
const { TrangSanPham, } = require("../controllers/TrangSP/TrangSPController");
// Trang Chi tiết sản phẩm controller
const { TrangChiTietSP, } = require("../controllers/ChiTietSP/chitietSPController");
// Trang Giỏ hàng controller
const { getGioHang, ThemGioHang, thongtinGioHang, getSuaGioHang, SuaSoLuongSanPham } = require("../controllers/GioHang/GioHangController"); 
// Trang Checkout controller
// const { getCheckout } = require("../controllers/Checkout/CheckoutController"); 


// Login khách hàng
const { getFormLoginKH, DangKyKH, DangNhapKH, DangXuatKH } = require('../controllers/Login/loginKHController'); 

const router = express.Router();
//  -------------------------------------------

// ADMIN 
router.get("/loginAdmin", formLoginAdmin)
router.post("/login-Admin", LoginAdmin)
router.get("/TrangChuAdmin", getTrangChuAdmin)

// Quản lý sản phẩm
router.get("/trangQLSP", getQLSP)
router.get("/formThemSP", formInsertSP)
router.post("/ThemSP", nutThemSP)
router.get("/formSuaSP", formUpdateSP)
router.put("/SuaSP/:idSuaSP", nutSuaSP)



//  -------------------------------------------
// TRANG CHU
router.get("/", getTrangChu)

// SAN PHAM
router.get("/TrangSP", TrangSanPham)
router.get("/ChiTietSP", TrangChiTietSP)

//GioHang 
router.get("/thongtingiohang", thongtinGioHang)
router.get("/TrangGioHang", getGioHang)
router.post("/ThemGioHang", ThemGioHang)
router.get("/TrangSuaGioHang", getSuaGioHang)
router.post("/SuaGioHang", SuaSoLuongSanPham)

//Checkout 
// router.get("/TrangCheckout", getCheckout)



// LOGIN Tai Khoan Khach Hang
router.get("/loginKH", getFormLoginKH)
router.post("/DangKyKH", DangKyKH)
router.post("/DangNhapKH", DangNhapKH)
router.get("/DangXuatKH", DangXuatKH)


module.exports = router;
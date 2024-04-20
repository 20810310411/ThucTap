const SanPham = require("../../models/SanPham");
const Cart = require("../../models/Cart");
const LoaiSP = require("../../models/LoaiSP");
const HoaDon = require("../../models/HoaDon");
require('rootpath')()

const giamSoLuongTonKho = async (productId, quantity) => {
    try {
        // Tìm sản phẩm trong cơ sở dữ liệu
        let product = await SanPham.findById(productId);

        // Kiểm tra nếu sản phẩm tồn tại và có số lượng tồn kho đủ để giảm
        if (product && product.SoLuongTon >= quantity) {
            // Giảm số lượng tồn kho của sản phẩm
            product.SoLuongTon -= quantity;
            // Lưu sản phẩm sau khi giảm số lượng tồn kho
            await product.save();
            return true; // Trả về true nếu thành công
        } else {
            return false; // Trả về false nếu không đủ số lượng tồn kho
        }
    } catch (error) {
        console.error("Lỗi khi giảm số lượng tồn kho:", error);
        return false; // Trả về false nếu có lỗi xảy ra
    }
};

// Tăng số lượng bán của sản phẩm
const tangSoLuongBan = async (productId, quantity) => {
    try {
        // Tìm sản phẩm trong cơ sở dữ liệu
        let product = await SanPham.findById(productId);

        // Kiểm tra nếu sản phẩm tồn tại
        if (product) {
            // Tăng số lượng bán của sản phẩm
            product.SoLuongBan += quantity;
            // Lưu sản phẩm sau khi tăng số lượng bán
            await product.save();
            return true; // Trả về true nếu thành công
        } else {
            return false; // Trả về false nếu sản phẩm không tồn tại
        }
    } catch (error) {
        console.error("Lỗi khi tăng số lượng bán:", error);
        return false; // Trả về false nếu có lỗi xảy ra
    }
};


module.exports = {
    getCheckout: async (req, res) => {
        var sessions = req.session;
        let taikhoan = sessions.taikhoan
        let hoten = req.session.hoten
        let loggedIn = req.session.loggedIn
        const sanphamGioHang = await Cart.findOne({ MaTKKH: req.session.userId }).populate('cart.items.productId').exec();
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
        let loaisp = await LoaiSP.find().exec()
        res.render("HOME/Layouts/Checkout/Checkout.ejs", {
            loaisp, sanphamGioHang, taikhoan, loggedIn, hoten, formatCurrency, getRelativeImagePath, rootPath: '/'
        })
    },

    datHang: async (req, res) => {
        let HoTen = req.body.HoTen
        let DiaChi = req.body.DiaChiChiTiet
        let SoDienThoai = req.body.SoDienThoai
        let Email = req.body.Email
        let Note = req.body.Note
        // let TongSLDat = req.body.TongSLDat
        // let TongTien = req.body.TongTien
        //console.log("tongtỉn:", TongTien);
        //const giaTriSo_TongTien = parseInt(TongTien.replace(/[^0-9]/g, ''));
        const customerAccountId = req.session.userId;
        console.log(">>> check id customerAccountId checkout: ", customerAccountId);
        // tìm cái giỏ hàng từ thằng customerAccountId trước
        let idcanxoa = await Cart.findOne({MaTKKH: customerAccountId})    
        let cartId = idcanxoa._id
        // rồi tiếp theo tìm theo _id của cái giỏ hàng đó để thêm vào hóa đơn
        let giohang = await Cart.findById(cartId).populate('cart.items.productId')
        console.log(">>> check giohang:",giohang);
        // chọc tới items để lấy ra tất cả sp trong giỏ hàng để chút nữa map ra thêm vào hóa đđn
        const cartItems = giohang.cart.items
        const cartTongTien = giohang.cart.totalPrice
        const cartTongSL = giohang.cart.totalQuaty

        // Kiểm tra số lượng tồn kho trước khi đặt hàng
        for (const item of cartItems) {
            // try {
            const product = await SanPham.findById(item.productId);
            if (!product || !product.TenSP || !product.SoLuongTon) {
                console.error("Sản phẩm không hợp lệ:", product);
                //throw new Error("Sản phẩm không hợp lệ");
                return res.status(400).json({ success: false, message: 'Sản phẩm không hợp lệ, có thể do sản phẩm nào đó đã hết hàng. Vui lòng liên hệ lại với admin hoặc đặt sản phẩm khác!' });
            }

            if (product.SoLuongTon < item.qty) {
                let sl = `Sản phẩm "${product.TenSP}" chỉ còn ${product.SoLuongTon} sản phẩm, không đủ để đặt hàng.`;
                console.error("Số lượng tồn kho không đủ: ", sl);
                // Xử lý lỗi và trả về thông báo cho người dùng
                return res.status(400).json({ success: false, message: sl });
            }
            // } catch (error) {
            //     console.error("Lỗi khi kiểm tra sản phẩm:", error);
            //     // Xử lý lỗi và trả về thông báo cho người dùng
            //     return res.status(400).json({ success: false, message: 'Có lỗi xảy ra khi kiểm tra sản phẩm' });
            // }
        }

        // khi đặt hàng thì số lượng tồn kho sẽ giảm đi và số lượng bán sẽ tăng lên
        for (const item of cartItems) {
            await giamSoLuongTonKho(item.productId, item.qty);
            await tangSoLuongBan(item.productId, item.qty);
        }


        let datHang = await HoaDon.create({
            HoTen: HoTen,
            DiaChi: DiaChi,
            SoDienThoai: SoDienThoai,
            Email: Email,
            Note: Note,
            TongTien: cartTongTien,
            TongSLDat: cartTongSL,
            MaKH: customerAccountId,
            cart: {
                items: cartItems.map(item => ({
                    productId: item.productId._id,
                    qty: item.qty
                })),
                totalPrice: cartTongTien,
                totalQuaty: cartTongSL,
            }
        })

        if(datHang){               

            // khi login thì sẽ có giỏ hàng khi add, khi dat hang thanh cong đi sẽ xóa luôn trong db đi
            await Cart.deleteOne({_id: idcanxoa._id});
            
            // Nếu có giỏ hàng, xóa giỏ hàng
            req.session.cartId = null;

            let cart = new Cart({
                cart: {
                    items: [],
                    totalPrice: 0,
                    totalQuaty: 0,
                },
                MaTKKH: customerAccountId,
            });
            await cart.save()


            res.status(201).json({ success: true, message: 'Bạn Đã Đặt Hàng Thành Công' });
        }else {
            console.log("dat hang that bai");
            res.status(500).json({ success: false, message: 'Đặt Hàng thất bại' });
        }

    }

}
const Cart = require("../../models/Cart");
const LoaiSP = require("../../models/LoaiSP");
const SanPham = require("../../models/SanPham");

require('rootpath')()
module.exports = {
    getGioHang: async (req, res) => {
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
        res.render("HOME/Layouts/GioHang/GioHang.ejs", {
            loaisp, sanphamGioHang, hoten, loggedIn, formatCurrency, getRelativeImagePath, rootPath: '/'
        })
    },

    ThemGioHang: async (req, res) => {
        let hoten = req.session.hoten
        let loggedIn = req.session.loggedIn
        const productId = req.query.productId;
        const qtyy = parseInt(req.body.quantity);
        const qty = !isNaN(qtyy) && qtyy > 0 ? qtyy : 1;
        const SoLuongTon = req.body.SoLuongTon;
        // Lấy thông tin đăng nhập của khách hàng từ request
        const customerAccountId = req.session.userId;
        console.log(">>> check id customerAccountId: ", customerAccountId);
        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await SanPham.findById(productId);
        console.log("product", product)
        if (!product) {
            return res.status(404).json({ success: false, message: 'Sản phẩm đã hết', loggedIn, hoten });
        }
        if(qty > SoLuongTon){
            return res.status(404).json({success: false, message: 'sản phẩm không đủ', loggedIn, hoten });
        }

        // Kiểm tra xem giỏ hàng đã tồn tại chưa, nếu chưa thì tạo mới
        let cart;
        // Nếu đăng nhập, sử dụng MaTKKH để liên kết với người dùng
        if (customerAccountId) {
            cart = await Cart.findOne({ MaTKKH: customerAccountId });
            if (!cart) {
                cart = new Cart({
                    cart: {
                        items: [],
                        totalPrice: 0,
                        totalQuaty: 0,
                    },
                    MaTKKH: customerAccountId,
                });
            }
        } else {
            // Nếu không đăng nhập, kiểm tra xem có giỏ hàng trong session hay không
            if (req.session.GioHangId) {
                // Nếu có giỏ hàng, lấy giỏ hàng từ cơ sở dữ liệu
                cart = await Cart.findById(req.session.GioHangId);
            }

            // Nếu không có giỏ hàng trong session hoặc database, tạo giỏ hàng mới
            if (!cart) {
                cart = new Cart({
                    cart: {
                        items: [],
                        totalPrice: 0,
                        totalQuaty: 0,
                    },
                    MaTKKH: null,
                });
            }
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingItem = cart.cart.items.find((item) => item.productId.equals(productId));

        if (existingItem) {
            // Nếu đã có sản phẩm trong giỏ hàng, cập nhật số lượng
            existingItem.qty += qty;
        } else {
            // Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
            cart.cart.items.push({
                productId: product._id,
                qty: qty,
            });
        }
        // // Cập nhật tổng số lượng và tổng tiền
        cart.cart.totalQuaty += qty;
        cart.cart.totalPrice += product.GiaBan * qty;
        // Cập nhật tổng số lượng và tổng tiền
        // cart.cart.totalQuaty = cart.cart.items.reduce((total, item) => total + item.qty, 0);
        // cart.cart.totalPrice = cart.cart.items.reduce((total, item) => total + (item.qty * product.GiaBan), 0);
        // Lưu cart vào session nếu user không đăng nhập
        if (!customerAccountId) {
            req.session.cart = cart;
        }

        // Lưu giỏ hàng vào cơ sở dữ liệu hoặc session
        if (customerAccountId) {
            await cart.save();
        }
        // await cart.save();
        return res.status(200).json({success: true ,message: 'Đã thêm sản phẩm vào giỏ hàng', loggedIn, hoten });
    },

    thongtinGioHang: async (req, res) => {

        const customerAccountId = req.session.userId;
        console.log("check userId get cart: ", customerAccountId);
        //Tim gio hang qua ma khach hang
        const cart = await Cart.findOne({ MaTKKH: customerAccountId }).populate('cart.items.productId');
        console.log("cart : ", cart);
        if (!cart) {
            return res.status(200).json({ totalQuaty: 0, totalPrice: 0 });
        }

        return res.status(200).json({
            totalQuaty: cart.cart.totalQuaty,
            totalPrice: cart.cart.totalPrice,
        });
    },

    getSuaGioHang: async (req, res) => {

        let hoten = req.session.hoten
        let loggedIn = req.session.loggedIn
        const sanphamGioHang = await Cart.findOne({ MaTKKH: req.session.userId }).populate('cart.items.productId').exec();
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
        const customerAccountId = req.session.userId;
        let idSuaQty = req.query.idSuaQty
        // tim cai gio hang dua vao MaKH trc tien

        let timCart = await Cart.findOne({ MaTKKH: customerAccountId }).populate('cart.items.productId')
        const updatedCartItem = timCart.cart.items.find(item => item._id.toString() === idSuaQty);

        //const sanphamGioHang = await GioHang.findOne({ MaTKKH: req.session.userId }).populate('cart.items.productId').exec();

        res.render("HOME/Layouts/GioHang/editGioHang.ejs", {
            hoten, loggedIn, formatCurrency, getRelativeImagePath,
            updatedCartItem, sanphamGioHang, loaisp
        })
    },
    SuaSoLuongSanPham: async (req, res) => {
        const quantityy = req.body.quantity;
        let idupdateCart = req.body.idupdateCart

        const customerAccountId = req.session.userId;
        // Tìm cai gio hang dua vao MaKH trc tien
        let timCart = await Cart.findOne({ MaTKKH: customerAccountId }).populate('cart.items.productId');

        // Tìm sản phẩm cần cập nhật trong mảng items dựa trên _id
        const updatedCartItem = timCart.cart.items.find(item => item._id.toString() === idupdateCart);
        if (updatedCartItem) {
            // Cập nhật qty
            updatedCartItem.qty = quantityy;

            // Lưu lại dữ liệu đã chỉnh sửa
            await timCart.save();

            console.log('Số lượng sản phẩm đã được cập nhật thành công.');
            return res.redirect('TrangGioHang')
        } else {
            console.log('Không tìm thấy sản phẩm cần cập nhật trong giỏ hàng.');
        }
    },
    XoaGioHang: async (req, res) => {
        try {
            let idRemove = req.body.idARemove;
            console.log("idRemove: ", idRemove);

            const removedProduct = await Cart.findOneAndUpdate(
                { "cart.items._id": idRemove },
                { $pull: { "cart.items": { _id: idRemove } } },
                { new: true } // Trả lại tài liệu đã cập nhật
            );

            // Kiểm tra xem sản phẩm đã được tìm thấy và xóa chưa
            if (removedProduct && removedProduct.cart && removedProduct.cart.items) {
                let totalPrice = 0;
                let totalQuaty = 0;
                // Tính tổng giá và tổng số lượng cập nhật dựa trên các mặt hàng còn lại
                for (const item of removedProduct.cart.items) {
                    try {
                        let productDetails = await SanPham.findById(item.productId).exec();
                        if (productDetails) {
                            const giaBan = Number(productDetails.GiaBan);
                            // console.log("giaBan --->>>>", giaBan);
                            const itemTotal = item.qty * (isNaN(giaBan) ? 0 : giaBan);
                            // console.log("itemTotal --->>>>", itemTotal);

                            totalPrice += itemTotal;
                            totalQuaty += item.qty;
                        }
                    } catch (error) {
                        console.error("Lỗi tính toán itemTotal:", error);
                    }
                }

                // Cập nhật tổng giá và tổng số lượng trong Giỏ hàng
                await Cart.findByIdAndUpdate(
                    { _id: removedProduct._id },
                    { $set: { 'cart.totalPrice': totalPrice, 'cart.totalQuaty': totalQuaty } }
                );

                res.redirect("/TrangGioHang");
            } else {
                res.status(404).send("Không tìm thấy sản phẩm để xóa.");
            }
        } catch (error) {
            console.error("Lỗi xóa sản phẩm:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

}
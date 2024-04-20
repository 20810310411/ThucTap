const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');

const HoaDon_Schema = new mongoose.Schema({
    MaKH: { type: mongoose.SchemaTypes.ObjectId, ref: "KhachHang" },
    HoTen: { type: String },
    QuocGia: { type: String },
    ThanhPho: { type: String },
    DiaChi: { type: String },
    SoDienThoai: { type: String },
    Email: { type: String },
    PhiSanPham: { type: Number, default: 0 },
    PhiShip: { type: Number, default: 30000 },
    TongTien: { type: Number, default: 0 },
    GiamGia: { type: Number, default: 0 },
    Note: { type: String },
    TongSLDat: { type: Number, default: 0 },
    TinhTrangDonHang: { 
      type: String, 
      enum: ["Chưa giao hàng", "Đã giao hàng", "Đang giao hàng"], 
      default: "Chưa giao hàng" 
    },
    TinhTrangThanhToan: { 
      type: String, 
      enum: ["Đã Thanh Toán", "Chưa Thanh Toán"], 
      default: "Chưa Thanh Toán" 
    },
    NgayLap: { type: Date, default: Date.now(), immutable: true },  
    cart: {
      items: [{
          productId: {
            type: mongoose.Types.ObjectId,
            ref: 'SanPham',
            required: true
          },
          qty: {
            type: Number,
            required: true
          }
      }],
      totalPrice: {
        type: Number,
        default: 0  // Set a default value
      },
      totalQuaty: {
          type: Number,
          default: 0  // Set a default value
      },
    },
});

HoaDon_Schema.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.model("HoaDon", HoaDon_Schema);

document.addEventListener('DOMContentLoaded', function () {
    updateCartInfo(); // Gọi hàm cập nhật thông tin giỏ hàng khi trang được tải

    // Hàm cập nhật thông tin giỏ hàng
    async function updateCartInfo() {
        try {
            const response = await fetch('/thongtingiohang');
            const data = await response.json();
            console.log("data => ", data);

            // Cập nhật tổng số lượng và tổng tiền trên giao diện
            document.getElementById('totalQuantity').innerText = data.totalQuaty;

            if (data.totalQuaty == 0) {
                document.getElementById('totalPrice').innerText = '0đ';
            } else {
                document.getElementById('totalPrice').innerText = formatCurrency(data.totalPrice);
            }

        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin giỏ hàng:', error);
        }
    }

    // Hàm định dạng tiền tệ (có thể thay đổi theo định dạng tiền của bạn)
    function formatCurrency(amount) {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

});
// product-detail.js
let currentProduct = null;

// 获取URL参数
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// 添加到购物车
function addToCart() {
    const productId = parseInt(getUrlParameter('id'));
    const quantity = parseInt(document.getElementById('productQuantity').value);
    
    // 这里可以添加将商品添加到购物车的逻辑
    // 例如发送AJAX请求到后端API
    
    alert(`已将商品添加到购物车，数量：${quantity}`);
}

// 添加到收藏
function addToWishlist() {
    const productId = parseInt(getUrlParameter('id'));
    
    // 这里可以添加将商品添加到收藏的逻辑
    // 例如发送AJAX请求到后端API
    
    alert('已将商品添加到收藏');
}

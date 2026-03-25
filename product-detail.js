// 获取URL参数
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// 商品数据
const products = [
    {
        id: 1,
        name: '商品一',
        price: '¥99.00',
        image: '轮播图库/1.jpg',
        description: '这是一款高品质的商品，采用优质材料制作，工艺精湛，设计时尚。无论是日常使用还是送礼都是不错的选择。我们注重每一个细节，确保产品质量达到最高标准。'
    },
    {
        id: 2,
        name: '商品二',
        price: '¥199.00',
        image: '轮播图库/2.jpg',
        description: '这款商品融合了现代科技与传统工艺，为用户提供卓越的使用体验。经过严格的质量检测，确保每一件产品都符合最高标准。'
    },
    {
        id: 3,
        name: '商品三',
        price: '¥299.00',
        image: '轮播图库/3.jpg',
        description: '采用最新技术设计，功能强大，操作简便。无论是专业人士还是普通用户，都能轻松上手，享受优质的使用体验。'
    },
    {
        id: 4,
        name: '商品四',
        price: '¥399.00',
        image: '轮播图库/4.jpg',
        description: '高端品质，极致体验。这款产品代表了我们对品质的极致追求，每一个细节都经过精心打磨，只为给用户最好的体验。'
    }
];

// 页面加载时显示商品信息
window.onload = function() {
    const productId = parseInt(getUrlParameter('id')) || 1;
    const product = products.find(p => p.id === productId) || products[0];
    
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = product.price;
    document.getElementById('productImage').src = product.image;
    document.getElementById('productDescription').textContent = product.description;
};

// 添加到购物车
function addToCart() {
    const quantity = document.getElementById('productQuantity').value;
    const productName = document.getElementById('productName').textContent;
    alert(`已将 ${quantity} 件 "${productName}" 添加到购物车！`);
}

// 添加到收藏
function addToWishlist() {
    const productName = document.getElementById('productName').textContent;
    alert(`已将 "${productName}" 添加到收藏！`);
}
// 商品数据
let products = [
    {
        id: 1,
        name: "大果红花茶油",
        price: "¥299.00",
        folder: "大果红花",
        image: "1.jpg",
        description: "高品质商品，满足您的需求。"
    },
    {
        id: 2,
        name: "山茶油",
        price: "¥199.00",
        folder: "山茶油",
        image: "微信图片_20260327111307_26_24.jpg",
        description: "高品质商品，满足您的需求。"
    },
    {
        id: 3,
        name: "一级纯菜籽油",
        price: "¥99.00",
        folder: "一级菜籽油",
        image: "微信图片_20260327111315_32_24.jpg",
        description: "高品质商品，满足您的需求。"
    },
    {
        id: 4,
        name: "二级纯菜籽油",
        price: "¥79.00",
        folder: "二级菜籽油",
        image: "微信图片_20260327111301_21_24.jpg",
        description: "高品质商品，满足您的需求。"
    }
];

// 加载商品展示
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        // 自动获取对应商品文件夹中的第一张图片
        let imagePath = `./img/商品图库/${product.folder}/${product.image}`;
        
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <img src="${imagePath}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">${product.price}</div>
            <a href="./html/product-detail.html?id=${product.id}" class="btn">查看详情</a>
        `;
        
        productsGrid.appendChild(productItem);
    });
}
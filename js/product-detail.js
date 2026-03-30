// 商品数据
let products = [
    {
        id: 1,
        name: "大果红花茶油",
        price: "¥299.00",
        folder: "大果红花",
        description: "这是一款高品质的大果红花茶油，采用优质材料制作，工艺精湛，设计时尚。无论是日常使用还是送礼都是不错的选择。我们注重每一个细节，确保产品质量达到最高标准。",
        features: [
            "优质材料，耐用性强",
            "精湛工艺，品质保证",
            "时尚设计，美观大方",
            "多种规格，满足不同需求",
            "售后服务完善，购买无忧"
        ]
    },
    {
        id: 2,
        name: "山茶油",
        price: "¥199.00",
        folder: "山茶油",
        description: "这是一款高品质的山茶油，采用优质材料制作，工艺精湛，设计时尚。无论是日常使用还是送礼都是不错的选择。我们注重每一个细节，确保产品质量达到最高标准。",
        features: [
            "天然有机，健康无害",
            "营养丰富，口感纯正",
            "冷榨工艺，保留营养",
            "多种包装，方便选择",
            "专业配送，保证新鲜"
        ]
    },
    {
        id: 3,
        name: "一级纯菜籽油",
        price: "¥99.00",
        folder: "一级菜籽油",
        description: "这是一款高品质的一级纯菜籽油，采用优质材料制作，工艺精湛，设计时尚。无论是日常使用还是送礼都是不错的选择。我们注重每一个细节，确保产品质量达到最高标准。",
        features: [
            "非转基因，安全健康",
            "物理压榨，保留原香",
            "烟点高，适合多种烹饪方式",
            "富含维生素E，营养丰富",
            "严格质检，品质保证"
        ]
    },
    {
        id: 4,
        name: "二级纯菜籽油",
        price: "¥79.00",
        folder: "二级菜籽油",
        description: "这是一款高品质的二级纯菜籽油，采用优质材料制作，工艺精湛，设计时尚。无论是日常使用还是送礼都是不错的选择。我们注重每一个细节，确保产品质量达到最高标准。",
        features: [
            "经济实惠，性价比高",
            "日常烹饪的理想选择",
            "口感纯正，不油腻",
            "营养丰富，有益健康",
            "大容量包装，适合家庭使用"
        ]
    }
];

// 获取URL参数
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// 获取商品文件夹中的图片
function getProductImages(folder) {
    // 根据文件夹名称获取对应的图片
    const imageMap = {
        '大果红花': [
            '../img/11.jpg',
            '../img/15.jpg',
            '../img/16.jpg',
            '../img/17.jpg',
            '../img/18.jpg',
            '../img/19.jpg'
        ],
        '山茶油': [
            '../img/12.jpg',
            '../img/20.jpg',
            '../img/21.jpg',
            '../img/22.jpg',
            '../img/15.jpg',
            '../img/16.jpg'
        ],
        '一级菜籽油': [
            '../img/13.jpg',
            '../img/17.jpg',
            '../img/18.jpg',
            '../img/19.jpg',
            '../img/20.jpg'
        ],
        '二级菜籽油': [
            '../img/14.jpg',
            '../img/21.jpg',
            '../img/22.jpg',
            '../img/15.jpg',
            '../img/16.jpg'
        ]
    };
    
    return imageMap[folder] || [];
}

// 渲染商品详情
function renderProductDetail() {
    // 从URL获取商品ID
    const productId = parseInt(getUrlParameter('id'));
    
    // 查找对应的商品
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // 设置商品信息
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productPrice').textContent = product.price;
        document.getElementById('productDescription').textContent = product.description;
        
        // 渲染商品特点
        const featuresList = document.getElementById('featuresList');
        featuresList.innerHTML = '';
        
        product.features.forEach(feature => {
            const listItem = document.createElement('li');
            listItem.textContent = feature;
            featuresList.appendChild(listItem);
        });
        
        // 获取商品图片
        const productImages = getProductImages(product.folder);
        
        // 初始化商品轮播图
        initProductCarousel(productImages);
    } else {
        // 如果未找到商品，显示提示信息
        document.getElementById('productName').textContent = '商品不存在';
        document.getElementById('productPrice').textContent = '';
        document.getElementById('productDescription').textContent = '抱歉，未找到该商品的详细信息。';
        
        // 显示默认图片
        const track = document.getElementById('productTrack');
        const indicators = document.getElementById('productIndicators');
        track.innerHTML = '<div class="carousel-slide"><img src="../img/11.jpg" alt="默认图片"></div>';
        indicators.innerHTML = '<div class="indicator active"></div>';
    }
}

// 初始化商品轮播图
function initProductCarousel(images) {
    const track = document.getElementById('productTrack');
    const indicators = document.getElementById('productIndicators');
    let currentIndex = 0;
    
    // 清空轮播图容器
    track.innerHTML = '';
    indicators.innerHTML = '';
    
    // 添加轮播图和指示器
    images.forEach((image, index) => {
        // 创建轮播图幻灯片
        const slide = document.createElement('div');
        slide.classList.add('carousel-slide');
        slide.innerHTML = `<img src="${image}" alt="商品图片${index + 1}">`;
        track.appendChild(slide);
        
        // 创建指示器
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === 0) {
            indicator.classList.add('active');
        }
        indicator.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(indicator);
    });
    
    // 自动播放
    let autoPlayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        goToSlide(currentIndex);
    }, 3000);
    
    // 鼠标悬停时暂停自动播放
    const carousel = document.getElementById('productCarousel');
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    // 鼠标离开时恢复自动播放
    carousel.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            goToSlide(currentIndex);
        }, 3000);
    });
    
    // 前往指定幻灯片
    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // 更新指示器
        const indicatorElements = indicators.querySelectorAll('.indicator');
        indicatorElements.forEach((indicator, i) => {
            if (i === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
}

// 模拟添加到购物车
function addToCart() {
    alert('商品已添加到购物车！');
}

// 模拟加入收藏
function addToWishlist() {
    alert('商品已加入收藏！');
}

// 页面加载时渲染商品详情
document.addEventListener('DOMContentLoaded', renderProductDetail);

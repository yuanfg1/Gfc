// 路径管理文件
const paths = {
    // 图片路径
    images: {
        // 轮播图
        carousel: {
            1: './img/1.jpg',
            2: './img/2.jpg',
            3: './img/3.jpg',
            4: './img/4.jpg',
            5: './img/5.jpg',
            6: './img/6.jpg'
        },
        // 关于我们
        about: {
            1: './img/8.jpg',
            2: './img/9.jpg',
            3: './img/10.jpg'
        },
        // 商品图片
        products: {
            '大果红花': './img/11.jpg',
            '山茶油': './img/12.jpg',
            '一级菜籽油': './img/13.jpg',
            '二级菜籽油': './img/14.jpg'
        },
        // 商品详情页图片
        productDetails: {
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
        }
    },
    // PDF路径
    pdfs: {
        '大果红花': './img/jiancebaogao/大果红花茶油-筠连县高峰商贸有限公司.pdf',
        '山茶油': './img/jiancebaogao/山茶油-筠连县高峰商贸有限公司.pdf',
        '一级菜籽油': './img/jiancebaogao/一级菜籽油最新  高峰村 商贸有限公司 专业检测报告.pdf',
        '二级菜籽油': './img/jiancebaogao/二级菜籽油最新  高峰村 商贸有限公司 专业检测报告.pdf'
    },
    // 页面路径
    pages: {
        productDetail: './html/product-detail.html',
        announcementDetail: './html/announcement-detail.html'
    }
};

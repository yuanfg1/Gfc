document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('track');
    const slides = Array.from(track.children);
    const indicatorsContainer = document.getElementById('indicators');
    
    let currentIndex = 1; // 从1开始，因为我们会在开始和结束添加额外的幻灯片
    let slideCount = slides.length;
    let autoPlayInterval;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let autoPlayDelay;

    // 为了实现平滑的循环播放，我们需要在轨道的开始和结束添加额外的幻灯片
    // 在开始添加最后一张幻灯片的副本
    const lastSlide = slides[slides.length - 1].cloneNode(true);
    track.insertBefore(lastSlide, slides[0]);
    
    // 在结束添加第一张幻灯片的副本
    const firstSlide = slides[0].cloneNode(true);
    track.appendChild(firstSlide);
    
    // 更新幻灯片数组和计数
    const allSlides = Array.from(track.children);
    slideCount = allSlides.length;
    
    // 初始化指示器
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => {
            goToSlide(index + 1); // 加1因为我们在开始添加了一张幻灯片
            resetAutoPlay();
        });
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = Array.from(indicatorsContainer.children);
    
    // 初始位置设置为第一张真实幻灯片
    track.style.transform = `translateX(-100%)`;

    // 更新轮播图位置
    function updateCarousel() {
        const amountToMove = -currentIndex * 100;
        track.style.transform = `translateX(${amountToMove}%)`;
        
        // 更新指示器状态
        indicators.forEach((indicator, index) => {
            if (index === currentIndex - 1) { // 减1因为我们在开始添加了一张幻灯片
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // 切换到指定幻灯片
    function goToSlide(index) {
        currentIndex = index;
        track.style.transition = 'transform 0.5s ease-in-out';
        updateCarousel();
        
        // 当切换到克隆的幻灯片时，立即跳转到对应的真实幻灯片位置
        if (currentIndex === 0) {
            setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = slideCount - 2;
                updateCarousel();
            }, 500);
        } else if (currentIndex === slideCount - 1) {
            setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = 1;
                updateCarousel();
            }, 500);
        }
    }

    // 下一张
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    // 上一张
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // 触摸/鼠标事件处理
    const carouselContainer = document.getElementById('carousel');

    // 开始拖动
    function startDrag(e) {
        isDragging = true;
        startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        track.style.transition = 'none';
        stopAutoPlay();
    }

    // 拖动中
    function drag(e) {
        if (!isDragging) return;
        currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const diff = currentX - startX;
        const slideWidth = allSlides[0].offsetWidth;
        const percentageDiff = (diff / slideWidth) * 100;
        const moveAmount = -currentIndex * 100 + percentageDiff;
        track.style.transform = `translateX(${moveAmount}%)`;
    }

    // 结束拖动
    function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = 'transform 0.5s ease-in-out';
        
        const diff = currentX - startX;
        const slideWidth = allSlides[0].offsetWidth;
        
        // 如果拖动距离超过1/3幻灯片宽度，则切换到下一张/上一张
        if (Math.abs(diff) > slideWidth / 5) {
            if (diff > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            // 否则回到原位置
            updateCarousel();
        }
        // 延迟重启自动播放，确保过渡完成
        clearTimeout(autoPlayDelay);
        autoPlayDelay = setTimeout(() => {
            startAutoPlay();
        }, 1000);
    }

    // 事件监听
    carouselContainer.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('mouseleave', endDrag);

    // 触摸事件
    carouselContainer.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', endDrag);

    // 自动播放功能
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 3000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
        clearTimeout(autoPlayDelay);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // 鼠标悬停时暂停自动播放
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', () => {
        clearTimeout(autoPlayDelay);
        autoPlayDelay = setTimeout(() => {
            startAutoPlay();
        }, 500);
    });

    // 启动自动播放
    startAutoPlay();
});

// 渲染公告列表
function renderAnnouncements(category) {
    const listContainer = document.getElementById('announcementList');
    listContainer.innerHTML = '';
    
    if (announcements && announcements[category]) {
        // 按照日期从新到旧排序公告
        const categoryAnnouncements = [...announcements[category]].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        const maxVisible = 5;
        const visibleAnnouncements = categoryAnnouncements.slice(0, maxVisible);
        const hiddenAnnouncements = categoryAnnouncements.slice(maxVisible);
        
        // 渲染可见的公告
        visibleAnnouncements.forEach(announcement => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="dot">•</span>
                <a href="#" data-title="${announcement.title}" data-date="${announcement.date}">${announcement.title}</a>
                <span class="date">${announcement.date}</span>
            `;
            listContainer.appendChild(li);
        });
        
        // 如果有隐藏的公告，添加"更多"按钮
        if (hiddenAnnouncements.length > 0) {
            const moreLi = document.createElement('li');
            moreLi.classList.add('more-item');
            moreLi.innerHTML = `
                <a href="#" class="more-link">更多公告 <span class="arrow">▼</span></a>
            `;
            listContainer.appendChild(moreLi);
            
            // 创建隐藏的公告列表
            const hiddenList = document.createElement('ul');
            hiddenList.classList.add('hidden-announcements');
            hiddenList.style.display = 'none';
            
            hiddenAnnouncements.forEach(announcement => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="dot">•</span>
                    <a href="#" data-title="${announcement.title}" data-date="${announcement.date}">${announcement.title}</a>
                    <span class="date">${announcement.date}</span>
                `;
                hiddenList.appendChild(li);
            });
            
            listContainer.appendChild(hiddenList);
            
            // 添加点击事件
            const moreLink = moreLi.querySelector('.more-link');
            moreLink.addEventListener('click', function(e) {
                e.preventDefault();
                const arrow = this.querySelector('.arrow');
                if (hiddenList.style.display === 'none') {
                    hiddenList.style.display = 'block';
                    arrow.textContent = '▲';
                    this.textContent = '收起公告 ';
                    this.appendChild(arrow);
                } else {
                    hiddenList.style.display = 'none';
                    arrow.textContent = '▼';
                    this.textContent = '更多公告 ';
                    this.appendChild(arrow);
                }
            });
        }
        
        // 为所有公告链接添加点击事件
        const announcementLinks = listContainer.querySelectorAll('a[data-title]');
        announcementLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const title = this.getAttribute('data-title');
                const date = this.getAttribute('data-date');
                const encodedTitle = encodeURIComponent(title);
                window.location.href = './html/announcement-detail.html?title=' + encodedTitle + '&date=' + date;
            });
        });
    }
}

// 商品数据
const products = [
    {
        id: 1,
        name: "大果红花茶油",
        price: "¥299.00",
        folder: "大果红花",
        description: "高品质商品，满足您的需求。"
    },
    {
        id: 2,
        name: "山茶油",
        price: "¥199.00",
        folder: "山茶油",
        description: "高品质商品，满足您的需求。"
    },
    {
        id: 3,
        name: "一级纯菜籽油",
        price: "¥99.00",
        folder: "一级菜籽油",
        description: "高品质商品，满足您的需求。"
    },
    {
        id: 4,
        name: "二级纯菜籽油",
        price: "¥79.00",
        folder: "二级菜籽油",
        description: "高品质商品，满足您的需求。"
    }
];

// 加载商品展示
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        // 获取对应文件夹中的第一张图片
        let imagePath;
        switch (product.folder) {
            case '大果红花':
                imagePath = `./img/商品图库/${product.folder}/1.jpg`;
                break;
            case '山茶油':
                imagePath = `./img/商品图库/${product.folder}/微信图片_20260327111307_26_24.jpg`;
                break;
            case '一级菜籽油':
                imagePath = `./img/商品图库/${product.folder}/微信图片_20260327111315_32_24.jpg`;
                break;
            case '二级菜籽油':
                imagePath = `./img/商品图库/${product.folder}/微信图片_20260327111301_21_24.jpg`;
                break;
            default:
                imagePath = `./img/商品图库/${product.folder}/1.jpg`;
        }
        
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

// 直接打开检测报告PDF
function openCertificatePDF(category) {
    // 获取对应类别的检测报告PDF
    const certificatePDFs = getCertificatePDFs(category);
    
    if (certificatePDFs.length > 0) {
        // 直接打开第一个PDF文件
        const pdf = certificatePDFs[0];
        window.open(`./img/检测报告/${category}/${pdf.file}`, '_blank');
    } else {
        alert('暂无检测报告PDF');
    }
}

// 获取检测报告PDF
function getCertificatePDFs(category) {
    // 检测报告PDF数据
    const certificateData = {
        '大果红花': [
            { name: '大果红花茶油检测报告', file: '大果红花茶油-筠连县高峰商贸有限公司.pdf' }
        ],
        '山茶油': [
            { name: '山茶油检测报告', file: '山茶油-筠连县高峰商贸有限公司.pdf' }
        ],
        '一级菜籽油': [
            { name: '一级菜籽油检测报告', file: '最新  高峰村 商贸有限公司 专业检测报告.pdf' }
        ],
        '二级菜籽油': [
            { name: '二级菜籽油检测报告', file: '最新  高峰村 商贸有限公司 专业检测报告.pdf' }
        ]
    };
    
    return certificateData[category] || [];
}

// 初始化关于我们轮播图
function initAboutCarousel() {
    const container = document.querySelector('.about-carousel-container');
    const track = document.querySelector('.about-carousel-track');
    const slides = document.querySelectorAll('.about-carousel-slide');
    const indicatorsContainer = document.querySelector('.about-carousel-indicators');
    
    if (!container || !track || !slides.length) return;
    
    // 创建指示器
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('about-carousel-indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    
    const indicators = document.querySelectorAll('.about-carousel-indicator');
    let currentSlide = 0;
    const slideCount = slides.length;
    let isDragging = false;
    let startX = 0;
    let dragDistance = 0;
    let autoPlayInterval = null;
    
    // 自动播放
    function startAutoPlay() {
        // 确保只有一个计时器在运行
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
        autoPlayInterval = setInterval(() => {
            goToSlide((currentSlide + 1) % slideCount);
        }, 5000);
    }
    
    // 停止自动播放
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // 切换到指定幻灯片
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }
    
    // 更新轮播图状态
    function updateCarousel() {
        const slideWidth = container.clientWidth;
        track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        
        // 更新指示器状态
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // 鼠标拖动开始
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        stopAutoPlay();
    });
    
    // 鼠标拖动移动
    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        dragDistance = e.clientX - startX;
    });
    
    // 鼠标拖动结束
    container.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const slideWidth = container.clientWidth;
        if (Math.abs(dragDistance) > slideWidth / 3) {
            if (dragDistance > 0) {
                // 向右拖动，上一张
                goToSlide((currentSlide - 1 + slideCount) % slideCount);
            } else {
                // 向左拖动，下一张
                goToSlide((currentSlide + 1) % slideCount);
            }
        }
        
        dragDistance = 0;
        startAutoPlay();
    });
    
    // 鼠标离开容器
    container.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            dragDistance = 0;
        }
        // 只在没有正在进行的拖动操作时启动自动播放
        startAutoPlay();
    });
    
    // 触摸事件支持
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        stopAutoPlay();
    });
    
    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        dragDistance = e.touches[0].clientX - startX;
    });
    
    container.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const slideWidth = container.clientWidth;
        if (Math.abs(dragDistance) > slideWidth / 3) {
            if (dragDistance > 0) {
                goToSlide((currentSlide - 1 + slideCount) % slideCount);
            } else {
                goToSlide((currentSlide + 1) % slideCount);
            }
        }
        
        dragDistance = 0;
        startAutoPlay();
    });
    
    // 窗口大小改变时更新
    window.addEventListener('resize', updateCarousel);
    
    // 开始自动播放
    startAutoPlay();
}

// 初始化公告
document.addEventListener('DOMContentLoaded', function() {
    renderAnnouncements('press');
    
    // 初始化关于我们轮播图
    initAboutCarousel();
    
    // 加载商品展示
    loadProducts();
    
    // 标签页点击事件
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            renderAnnouncements(category);
        });
    });
});

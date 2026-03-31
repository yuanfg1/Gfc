// 商品详情页逻辑

// 获取URL参数
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// 获取商品文件夹中的图片
function getProductImages(folder) {
    // 从路径管理文件获取对应的图片
    return paths.images.productDetails[folder] || [];
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
        track.innerHTML = `<div class="carousel-slide"><img src="${paths.images.products['大果红花'].replace('./', '../')}" alt="默认图片"></div>`;
        indicators.innerHTML = '<div class="indicator active"></div>';
    }
}

// 初始化商品轮播图
function initProductCarousel(images) {
    const container = document.getElementById('productCarousel');
    const track = document.getElementById('productTrack');
    const indicators = document.getElementById('productIndicators');
    
    if (!container || !track || !indicators) {
        console.error('商品轮播图DOM元素不存在');
        return;
    }
    
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
    });
    
    const slides = document.querySelectorAll('.carousel-slide');
    
    // 为了实现平滑的循环播放，在轨道的开始和结束添加额外的幻灯片
    // 在开始添加最后一张幻灯片的副本
    if (slides.length > 0) {
        const lastSlide = slides[slides.length - 1].cloneNode(true);
        track.insertBefore(lastSlide, slides[0]);
        
        // 在结束添加第一张幻灯片的副本
        const firstSlide = slides[0].cloneNode(true);
        track.appendChild(firstSlide);
    }
    
    // 更新幻灯片数组和计数
    const allSlides = Array.from(track.children);
    let slideCount = allSlides.length;
    let currentSlide = 1; // 从1开始，因为我们在开始添加了一张幻灯片
    
    // 创建指示器
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index + 1)); // 加1因为我们在开始添加了一张幻灯片
        indicators.appendChild(indicator);
    });
    
    const indicatorElements = document.querySelectorAll('.indicator');
    let isDragging = false;
    let startX = 0;
    let dragDistance = 0;
    let autoPlayInterval = null;
    
    // 初始位置设置为第一张真实幻灯片
    const slideWidth = 100; // 百分比宽度
    track.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    
    // 自动播放
    function startAutoPlay() {
        // 确保只有一个计时器在运行
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            // 确保轮播图元素仍然存在
            if (container && track) {
                nextSlide();
            } else {
                stopAutoPlay(); // 如果元素不存在，停止自动播放
            }
        }, 3000);
    }
    
    // 停止自动播放
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // 下一张
    function nextSlide() {
        // 计算下一张幻灯片的索引
        let nextIndex = currentSlide + 1;
        // 检查是否到达最后一张克隆的幻灯片
        if (nextIndex === slideCount - 1) {
            // 先移动到克隆的第一张幻灯片
            currentSlide = slideCount - 1;
            track.style.transition = 'transform 0.5s ease-in-out';
            updateCarousel();
            
            // 动画完成后，立即跳转到真实的第一张幻灯片
            setTimeout(() => {
                track.style.transition = 'none';
                currentSlide = 1;
                updateCarousel();
            }, 600);
        } else {
            goToSlide(nextIndex);
        }
    }
    
    // 上一张
    function prevSlide() {
        // 计算上一张幻灯片的索引
        let prevIndex = currentSlide - 1;
        // 检查是否到达第一张克隆的幻灯片
        if (prevIndex === 0) {
            // 先移动到克隆的最后一张幻灯片
            currentSlide = 0;
            track.style.transition = 'transform 0.5s ease-in-out';
            updateCarousel();
            
            // 动画完成后，立即跳转到真实的最后一张幻灯片
            setTimeout(() => {
                track.style.transition = 'none';
                currentSlide = slideCount - 2;
                updateCarousel();
            }, 600);
        } else {
            goToSlide(prevIndex);
        }
    }
    
    // 前往指定幻灯片
    function goToSlide(index) {
        // 处理边界情况
        if (index < 0) index = 0;
        if (index >= slideCount) index = slideCount - 1;
        
        // 处理从最后一张到第一张的特殊情况（从右侧进入）
        if (currentSlide === slideCount - 2 && index === 1) {
            // 先移动到克隆的第一张幻灯片
            currentSlide = slideCount - 1;
            track.style.transition = 'transform 0.5s ease-in-out';
            updateCarousel();
            
            // 动画完成后，立即跳转到真实的第一张幻灯片
            setTimeout(() => {
                track.style.transition = 'none';
                currentSlide = 1;
                updateCarousel();
            }, 600);
        }
        // 处理从第一张到最后一张的特殊情况（从左侧进入）
        else if (currentSlide === 1 && index === slideCount - 2) {
            // 先移动到克隆的最后一张幻灯片
            currentSlide = 0;
            track.style.transition = 'transform 0.5s ease-in-out';
            updateCarousel();
            
            // 动画完成后，立即跳转到真实的最后一张幻灯片
            setTimeout(() => {
                track.style.transition = 'none';
                currentSlide = slideCount - 2;
                updateCarousel();
            }, 600);
        }
        // 正常切换
        else {
            currentSlide = index;
            track.style.transition = 'transform 0.5s ease-in-out';
            updateCarousel();
        }
    }
    
    // 更新轮播图状态
    function updateCarousel() {
        // 确保DOM元素存在
        if (!container || !track || !indicatorElements) return;
        
        const slideWidth = 100; // 百分比宽度
        track.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
        
        // 计算当前应该激活的指示器索引
        let activeIndex = currentSlide - 1; // 减1因为我们在开始添加了一张幻灯片
        
        // 处理特殊情况：当currentSlide是0（克隆的最后一张）时，应该激活最后一个指示器
        if (currentSlide === 0) {
            activeIndex = indicatorElements.length - 1;
        }
        // 当currentSlide是slideCount-1（克隆的第一张）时，应该激活第一个指示器
        else if (currentSlide === slideCount - 1) {
            activeIndex = 0;
        }
        
        // 更新指示器状态
        indicatorElements.forEach((indicator, index) => {
            if (index === activeIndex) {
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
        track.style.transition = 'none';
        stopAutoPlay();
    });
    
    // 鼠标拖动移动
    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        dragDistance = e.clientX - startX;
        const slideWidth = container.clientWidth;
        const movePercentage = (dragDistance / slideWidth) * 100;
        const currentPosition = -currentSlide * 100;
        const newPosition = currentPosition + movePercentage;
        track.style.transform = `translateX(${newPosition}%)`;
    });
    
    // 鼠标拖动结束
    container.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = 'transform 0.5s ease-in-out';
        
        const slideWidth = container.clientWidth;
        if (Math.abs(dragDistance) > slideWidth / 3) {
            if (dragDistance > 0) {
                // 向右拖动，上一张
                prevSlide();
            } else {
                // 向左拖动，下一张
                nextSlide();
            }
        } else {
            // 否则回到原位置
            updateCarousel();
        }
        
        dragDistance = 0;
        startAutoPlay();
    });
    
    // 鼠标离开容器
    container.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            dragDistance = 0;
            track.style.transition = 'transform 0.5s ease-in-out';
            updateCarousel();
        }
        // 只在没有正在进行的拖动操作时启动自动播放
        startAutoPlay();
    });
    
    // 触摸事件支持
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        track.style.transition = 'none';
        stopAutoPlay();
    });
    
    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        dragDistance = e.touches[0].clientX - startX;
        const slideWidth = container.clientWidth;
        const movePercentage = (dragDistance / slideWidth) * 100;
        const currentPosition = -currentSlide * 100;
        const newPosition = currentPosition + movePercentage;
        track.style.transform = `translateX(${newPosition}%)`;
    });
    
    container.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = 'transform 0.5s ease-in-out';
        
        const slideWidth = container.clientWidth;
        if (Math.abs(dragDistance) > slideWidth / 3) {
            if (dragDistance > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            // 否则回到原位置
            updateCarousel();
        }
        
        dragDistance = 0;
        startAutoPlay();
    });
    
    // 窗口大小改变时更新
    window.addEventListener('resize', () => {
        // 确保轮播图位置正确
        track.style.transition = 'none';
        updateCarousel();
    });
    
    // 页面卸载时清理定时器
    window.addEventListener('beforeunload', () => {
        stopAutoPlay();
    });
    
    // 开始自动播放
    startAutoPlay();
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

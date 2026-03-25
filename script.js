document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('track');
    const slides = Array.from(track.children);
    const indicatorsContainer = document.getElementById('indicators');
    
    let currentIndex = 1; // 从1开始，因为0位置是克隆的最后一张
    const slideCount = slides.length;
    let autoPlayInterval;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let autoPlayDelay;
    let isTransitioning = false;

    // 克隆首尾幻灯片
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slideCount - 1].cloneNode(true);
    
    // 添加克隆的幻灯片
    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);
    
    // 更新幻灯片数组
    const allSlides = Array.from(track.children);
    const totalSlides = allSlides.length;

    // 初始化指示器
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => {
            if (isTransitioning) return;
            goToSlide(index + 1, true); // 添加第二个参数，表示是通过指示器点击
            resetAutoPlay();
        });
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = Array.from(indicatorsContainer.children);

    // 更新轮播图位置
    function updateCarousel(transition = true) {
        if (transition) {
            track.style.transition = 'transform 0.5s ease-in-out';
        } else {
            track.style.transition = 'none';
        }
        
        const amountToMove = -currentIndex * 100;
        track.style.transform = `translateX(${amountToMove}%)`;
        
        // 更新指示器状态
        indicators.forEach((indicator, index) => {
            if (index === currentIndex - 1) { // -1 因为有克隆的第一张在前面
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // 切换到指定幻灯片
    function goToSlide(index, isIndicatorClick = false) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        currentIndex = index;
        updateCarousel();
        
        // 检查是否到达克隆的幻灯片
        setTimeout(() => {
            if (currentIndex === 0) {
                // 到达克隆的最后一张，跳转到真正的最后一张
                currentIndex = slideCount;
                updateCarousel(false);
            } else if (currentIndex === totalSlides - 1) {
                // 到达克隆的第一张，跳转到真正的第一张
                currentIndex = 1;
                updateCarousel(false);
            }
            isTransitioning = false;
        }, 500); // 等待过渡完成
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
        if (isTransitioning) return;
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
        
        // 如果拖动距离超过1/5幻灯片宽度，则切换到下一张/上一张
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

    // 初始化轮播图位置
    updateCarousel(false);
    
    // 启动自动播放
    startAutoPlay();
});

// 渲染公告列表
function renderAnnouncements(category) {
    const listContainer = document.getElementById('announcementList');
    listContainer.innerHTML = '';
    
    if (announcements && announcements[category]) {
        const categoryAnnouncements = announcements[category];
        categoryAnnouncements.forEach(announcement => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="dot">•</span>
                <a href="#" data-title="${announcement.title}" data-date="${announcement.date}">${announcement.title}</a>
                <span class="date">${announcement.date}</span>
            `;
            listContainer.appendChild(li);
        });
    }
}

// 初始化公告
document.addEventListener('DOMContentLoaded', function() {
    renderAnnouncements('press');
    
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
    
    // 公告点击事件
    const announcementLinks = document.querySelectorAll('.announcement-list a');
    announcementLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const title = this.getAttribute('data-title');
            const date = this.getAttribute('data-date');
            const encodedTitle = encodeURIComponent(title);
            window.location.href = 'announcement-detail.html?title=' + encodedTitle + '&date=' + date;
        });
    });
});

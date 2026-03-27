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
});
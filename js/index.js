document.addEventListener('DOMContentLoaded', function() {
    // 确保DOM元素存在
    const track = document.getElementById('track');
    const indicatorsContainer = document.getElementById('indicators');
    const carouselContainer = document.getElementById('carousel');
    
    if (!track || !indicatorsContainer || !carouselContainer) {
        console.error('轮播图DOM元素不存在');
        return;
    }
    
    const slides = Array.from(track.children);
    let currentIndex = 1; // 从1开始，因为我们会在开始和结束添加额外的幻灯片
    let slideCount = slides.length;
    let autoPlayInterval = null;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let autoPlayDelay = null;

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
        // 确保track元素存在
        if (!track) return;
        
        const amountToMove = -currentIndex * 100;
        track.style.transform = `translateX(${amountToMove}%)`;
        
        // 更新指示器状态
        if (indicators && indicators.length > 0) {
            // 计算当前应该激活的指示器索引
            let activeIndex = currentIndex - 1; // 减1因为我们在开始添加了一张幻灯片
            
            // 处理特殊情况：当currentIndex是0（克隆的最后一张）时，应该激活最后一个指示器
            if (currentIndex === 0) {
                activeIndex = indicators.length - 1;
            }
            // 当currentIndex是slideCount-1（克隆的第一张）时，应该激活第一个指示器
            else if (currentIndex === slideCount - 1) {
                activeIndex = 0;
            }
            
            // 更新指示器状态
            indicators.forEach((indicator, index) => {
                if (index === activeIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
    }

    // 切换到指定幻灯片
    function goToSlide(index) {
        // 处理边界情况
        if (index < 0) index = 0;
        if (index >= slideCount) index = slideCount - 1;
        
        // 处理从最后一张到第一张的特殊情况（从右侧进入）
        if (currentIndex === slideCount - 2 && index === 1) {
            // 先移动到克隆的第一张幻灯片
            currentIndex = slideCount - 1;
            track.style.transition = 'transform 0.5s ease-in-out';
            updateCarousel();
            
            // 动画完成后，立即跳转到真实的第一张幻灯片
            if (autoPlayDelay) clearTimeout(autoPlayDelay);
            autoPlayDelay = setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = 1;
                updateCarousel();
            }, 600); // 增加延迟时间，确保动画完成
        }
        // 处理从第一张到最后一张的特殊情况（从左侧进入）
        else if (currentIndex === 1 && index === slideCount - 2) {
            // 先移动到克隆的最后一张幻灯片
            currentIndex = 0;
            track.style.transition = 'transform 0.5s ease-in-out';
            updateCarousel();
            
            // 动画完成后，立即跳转到真实的最后一张幻灯片
            if (autoPlayDelay) clearTimeout(autoPlayDelay);
            autoPlayDelay = setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = slideCount - 2;
                updateCarousel();
            }, 600); // 增加延迟时间，确保动画完成
        }
        // 正常切换
        else {
            currentIndex = index;
            track.style.transition = 'transform 0.5s ease-in-out';
            updateCarousel();
        }
    }

    // 下一张
    function nextSlide() {
        // 计算下一张幻灯片的索引
        let nextIndex = currentIndex + 1;
        // 检查是否到达最后一张克隆的幻灯片
        if (nextIndex === slideCount - 1) {
            // 先移动到克隆的第一张幻灯片
            currentIndex = slideCount - 1;
            track.style.transition = 'transform 0.5s ease-in-out';
            updateCarousel();
            
            // 动画完成后，立即跳转到真实的第一张幻灯片
            if (autoPlayDelay) clearTimeout(autoPlayDelay);
            autoPlayDelay = setTimeout(() => {
                track.style.transition = 'none';
                currentIndex = 1;
                updateCarousel();
            }, 600);
        } else {
            goToSlide(nextIndex);
        }
    }

    // 上一张
    function prevSlide() {
        // 计算上一张幻灯片的索引
        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = slideCount - 2; // 回到最后一张真实幻灯片
        }
        goToSlide(prevIndex);
    }

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
        if (autoPlayDelay) clearTimeout(autoPlayDelay);
        autoPlayDelay = setTimeout(() => {
            startAutoPlay();
        }, 1000);
    }

    // 自动播放功能
    function startAutoPlay() {
        stopAutoPlay(); // 确保先停止之前的定时器
        autoPlayInterval = setInterval(() => {
            // 确保轮播图元素仍然存在
            if (track && carouselContainer) {
                nextSlide();
            } else {
                stopAutoPlay(); // 如果元素不存在，停止自动播放
            }
        }, 3000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        if (autoPlayDelay) {
            clearTimeout(autoPlayDelay);
            autoPlayDelay = null;
        }
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // 鼠标悬停时暂停自动播放
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', () => {
        if (autoPlayDelay) clearTimeout(autoPlayDelay);
        autoPlayDelay = setTimeout(() => {
            startAutoPlay();
        }, 500);
    });

    // 事件监听
    carouselContainer.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('mouseleave', endDrag);

    // 触摸事件
    carouselContainer.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', endDrag);

    // 窗口大小改变时更新轮播图位置
    window.addEventListener('resize', () => {
        // 确保轮播图位置正确
        track.style.transition = 'none';
        updateCarousel();
    });

    // 页面卸载时清理定时器和事件监听器
    window.addEventListener('beforeunload', () => {
        stopAutoPlay();
        // 移除事件监听器
        carouselContainer.removeEventListener('mousedown', startDrag);
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('mouseleave', endDrag);
        carouselContainer.removeEventListener('touchstart', startDrag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', endDrag);
        carouselContainer.removeEventListener('mouseenter', stopAutoPlay);
        window.removeEventListener('resize', updateCarousel);
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
    const pdfPath = paths.pdfs[category];
    
    if (pdfPath) {
        window.open(pdfPath, '_blank');
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
            { name: '一级菜籽油检测报告', file: '一级菜籽油最新  高峰村 商贸有限公司 专业检测报告.pdf' }
        ],
        '二级菜籽油': [
            { name: '二级菜籽油检测报告', file: '二级菜籽油最新  高峰村 商贸有限公司 专业检测报告.pdf' }
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
    
    if (!container || !track || !slides.length || !indicatorsContainer) {
        console.error('关于我们轮播图DOM元素不存在');
        return;
    }
    
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
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            // 确保轮播图元素仍然存在
            if (container && track) {
                goToSlide((currentSlide + 1) % slideCount);
            } else {
                stopAutoPlay(); // 如果元素不存在，停止自动播放
            }
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
        // 处理边界情况
        if (index < 0) index = 0;
        if (index >= slideCount) index = slideCount - 1;
        
        currentSlide = index;
        updateCarousel();
    }
    
    // 更新轮播图状态
    function updateCarousel() {
        // 确保DOM元素存在
        if (!container || !track || !indicators) return;
        
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
    
    // 页面卸载时清理定时器
    window.addEventListener('beforeunload', () => {
        stopAutoPlay();
    });
    
    // 开始自动播放
    startAutoPlay();
}

// 加载证书展示
function loadCertificates() {
    const certificatesGrid = document.getElementById('certificatesGrid');
    if (!certificatesGrid) return;
    
    certificatesGrid.innerHTML = '';
    
    // 使用products数据来生成证书展示
    if (typeof products !== 'undefined') {
        products.forEach(product => {
            // 自动获取对应商品文件夹中的第一张图片
            let imagePath = paths.images.products[product.folder] || paths.images.products['大果红花'];
            
            const certificateItem = document.createElement('div');
            certificateItem.classList.add('certificate-item');
            certificateItem.onclick = function() {
                openCertificatePDF(product.folder);
            };
            certificateItem.innerHTML = `
                <img src="${imagePath}" alt="${product.name}检测报告">
                <h3>${product.name}检测报告</h3>
                <p>点击直接查看</p>
            `;
            
            certificatesGrid.appendChild(certificateItem);
        });
    }
}

// 初始化公告
document.addEventListener('DOMContentLoaded', function() {
    renderAnnouncements('press');
    
    // 初始化关于我们轮播图
    initAboutCarousel();
    
    // 加载商品展示
    loadProducts();
    
    // 加载证书展示
    loadCertificates();
    
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
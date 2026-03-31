// 创建头部导航组件
function createHeader() {
    const headerElement = document.querySelector('.header');
    if (!headerElement) return;
    
    headerElement.innerHTML = `
        <div class="container">
            <div class="logo"><img src="../${paths.base.logo}" alt="${siteData.header.logo}" height="50"></div>
            <nav class="nav">
                <ul>
                    ${siteData.header.navLinks.map(link => `
                        <li><a href="../index.html${link.href}">${link.text}</a></li>
                    `).join('')}
                </ul>
            </nav>
        </div>
    `;
}

// 创建页脚组件
function createFooter() {
    const footerElement = document.querySelector('.footer');
    if (!footerElement) return;
    
    footerElement.innerHTML = `
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">${siteData.footer.logo}</div>
                <div class="footer-links">
                    <ul>
                        ${siteData.footer.navLinks.map(link => `
                            <li><a href="../index.html${link.href}">${link.text}</a></li>
                        `).join('')}
                    </ul>
                </div>
                <div class="footer-copyright">
                    <p>${siteData.footer.copyright}</p>
                </div>
            </div>
        </div>
    `;
}

// 获取URL参数
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// 页面加载时显示公告信息
window.onload = function() {
    // 动态加载网站基本信息
    if (siteData.site) {
        // 网站图标
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon && siteData.site.favicon) {
            favicon.href = `../${siteData.site.favicon}`;
        }
    }
    
    // 创建头部导航组件
    createHeader();
    // 创建页脚组件
    createFooter();
    
    // 直接使用第一条公告数据进行测试
    const foundAnnouncement = announcements.press[0];
    const foundCategory = 'press';
    const announcementIndex = 0;
    
    console.log('直接使用第一条公告:', foundAnnouncement);
    
    // 显示公告详情
    if (foundAnnouncement) {
        console.log('显示公告详情');
        document.getElementById('detailTitle').textContent = foundAnnouncement.title;
        document.getElementById('detailDate').textContent = '发布日期：' + foundAnnouncement.date;
        document.getElementById('detailContent').innerHTML = foundAnnouncement.content;
        
        // 显示公告来源
        console.log('foundAnnouncement.source:', foundAnnouncement.source);
        const sourceElement = document.getElementById('detailSource');
        console.log('sourceElement:', sourceElement);
        if (sourceElement && foundAnnouncement.source) {
            sourceElement.textContent = '来源：' + foundAnnouncement.source;
            console.log('设置了来源内容:', sourceElement.textContent);
            // 添加样式，确保来源信息显示
            sourceElement.style.display = 'inline-block';
            sourceElement.style.marginLeft = '20px';
        } else {
            console.log('sourceElement或foundAnnouncement.source不存在');
        }
        
        // 显示上一条和下一条公告
        displayNavigationLinks(foundCategory, announcementIndex);
    } else {
        // 如果未找到公告，显示提示信息
        console.log('未找到公告');
        document.getElementById('detailTitle').textContent = '公告标题';
        document.getElementById('detailDate').textContent = '发布日期：2026-03-29';
        document.getElementById('detailContent').innerHTML = '<p>抱歉，未找到该公告的详细内容。</p>';
        
        // 隐藏导航链接
        document.getElementById('prevAnnouncement').style.display = 'none';
        document.getElementById('nextAnnouncement').style.display = 'none';
    }
};

// 显示上一条和下一条公告链接
function displayNavigationLinks(category, currentIndex) {
    const announcementsList = announcements[category];
    const prevLink = document.getElementById('prevLink');
    const nextLink = document.getElementById('nextLink');
    const prevAnnouncement = document.getElementById('prevAnnouncement');
    const nextAnnouncement = document.getElementById('nextAnnouncement');
    
    // 计算上一条和下一条公告的索引
    const prevIndex = currentIndex - 1;
    const nextIndex = currentIndex + 1;
    
    // 显示上一条公告链接
    if (prevIndex >= 0) {
        const prevAnnouncementData = announcementsList[prevIndex];
        const encodedTitle = encodeURIComponent(prevAnnouncementData.title);
        prevLink.href = `announcement-detail.html?title=${encodedTitle}&date=${prevAnnouncementData.date}&category=${category}`;
        prevLink.textContent = prevAnnouncementData.title;
        prevAnnouncement.style.display = 'block';
    } else {
        prevAnnouncement.style.display = 'none';
    }
    
    // 显示下一条公告链接
    if (nextIndex < announcementsList.length) {
        const nextAnnouncementData = announcementsList[nextIndex];
        const encodedTitle = encodeURIComponent(nextAnnouncementData.title);
        nextLink.href = `announcement-detail.html?title=${encodedTitle}&date=${nextAnnouncementData.date}&category=${category}`;
        nextLink.textContent = nextAnnouncementData.title;
        nextAnnouncement.style.display = 'block';
    } else {
        nextAnnouncement.style.display = 'none';
    }
};
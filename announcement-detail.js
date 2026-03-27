// 获取URL参数
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// 页面加载时显示公告信息
window.onload = function() {
    // 从URL获取公告标题和日期
    const title = getUrlParameter('title');
    const date = getUrlParameter('date');
    const category = getUrlParameter('category') || 'press'; // 默认为press类别
    
    if (title && date && announcements) {
        let foundAnnouncement = null;
        let foundCategory = category;
        let announcementIndex = -1;
        
        // 如果指定了类别，则在指定类别中查找
        if (announcements[category]) {
            announcementIndex = announcements[category].findIndex(a => a.title === title && a.date === date);
            if (announcementIndex !== -1) {
                foundAnnouncement = announcements[category][announcementIndex];
            }
        }
        
        // 如果在指定类别中未找到，则遍历所有类别查找
        if (!foundAnnouncement) {
            for (const cat in announcements) {
                const index = announcements[cat].findIndex(a => a.title === title && a.date === date);
                if (index !== -1) {
                    foundAnnouncement = announcements[cat][index];
                    foundCategory = cat;
                    announcementIndex = index;
                    break;
                }
            }
        }
        
        // 显示公告详情
        if (foundAnnouncement) {
            document.getElementById('detailTitle').textContent = foundAnnouncement.title;
            document.getElementById('detailDate').textContent = '发布日期：' + foundAnnouncement.date;
            document.getElementById('detailContent').innerHTML = foundAnnouncement.content;
            
            // 显示上一条和下一条公告
            displayNavigationLinks(foundCategory, announcementIndex);
        } else {
            // 如果未找到公告，显示提示信息
            document.getElementById('detailTitle').textContent = title;
            document.getElementById('detailDate').textContent = '发布日期：' + date;
            document.getElementById('detailContent').innerHTML = '<p>抱歉，未找到该公告的详细内容。</p>';
            
            // 隐藏导航链接
            document.getElementById('prevAnnouncement').style.display = 'none';
            document.getElementById('nextAnnouncement').style.display = 'none';
        }
    } else {
        // 如果没有提供URL参数，显示提示信息
        document.getElementById('detailTitle').textContent = '参数错误';
        document.getElementById('detailDate').textContent = '';
        document.getElementById('detailContent').innerHTML = '<p>请从公告列表页点击查看详情。</p>';
        
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
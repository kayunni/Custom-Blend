// 각 카페 클릭 이벤트 추가
const gridItems = document.querySelectorAll('.grid-item');

gridItems.forEach(item => {
    item.addEventListener('click', () => {
        const cafe = item.dataset.cafe; // "starbucks", "gongcha" 등
        window.location.href = `cafe.html?cafe=${cafe}`; // URL에 카페 정보 추가
    });
});

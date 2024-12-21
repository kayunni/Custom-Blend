// URL에서 선택된 카페 이름 가져오기
const urlParams = new URLSearchParams(window.location.search);
const selectedCafe = urlParams.get("cafe"); // 예: "starbucks"
// 햄버거 메뉴 열기/닫기
const hamburgerBtn = document.querySelector("#header #hamburger"); // 햄버거 버튼
const sideMenu = document.querySelector("#side-menu");
const menuClose = document.querySelector("#menu-close");

hamburgerBtn.addEventListener("click", () => {
    sideMenu.classList.remove("hidden");
    sideMenu.classList.add("visible");
});

menuClose.addEventListener("click", () => {
    sideMenu.classList.remove("visible");
    sideMenu.classList.add("hidden");
});

// JSON 데이터 로드 및 렌더링
fetch("data/drinks.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        const cafeData = data[selectedCafe];

        if (cafeData) {
            renderHeader(cafeData); // 로고와 텍스트 렌더링
            renderGallery(cafeData); // 갤러리 렌더링
            setupFilterButtons(cafeData); // 필터 버튼 이벤트 연결
        } else {
            renderError(); // 카페 데이터가 없는 경우
        }
    })
    .catch((error) => {
        console.error("Error loading JSON data:", error);
    });

// 로고 및 텍스트 렌더링 함수
function renderHeader(cafeData) {
    document.getElementById("cafe-title").textContent =
        cafeData.title + "의 커스텀 음료를 둘러보세요!";
    const logoImg = document.getElementById("logo-img");
    logoImg.src = cafeData.logo;
    logoImg.alt = `${cafeData.title} Logo`;

    if (selectedCafe === "compose") {
        logoImg.style.width = "60%";
        logoImg.style.height = "auto";
    } else if (selectedCafe === "mega") {
        logoImg.style.width = "80%";
        logoImg.style.height = "auto";
    } else {
        logoImg.style.width = "100%";
        logoImg.style.height = "auto";
    }
}

// 선택된 필터 상태
const selectedFilters = {
    base: [], // 선택된 음료 베이스 필터
    feature: [], // 선택된 음료 특징 필터
};

function setupFilterButtons(cafeData) {
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach((button) => {
        button.dataset.active = "false"; // 초기 상태 설정

        // 버튼 hover 이벤트 추가
        button.addEventListener("mouseenter", () => {
            if (button.dataset.active !== "true") {
                button.style.backgroundColor = getBackgroundColor(selectedCafe); // 호버 색상
            }
        });

        button.addEventListener("mouseleave", () => {
            if (button.dataset.active !== "true") {
                button.style.backgroundColor = ""; // 원래 상태로 복원
            }
        });

        // 버튼 클릭 이벤트 처리
        button.addEventListener("click", () => {
            const type = button.dataset.type; // base 또는 feature
            const filter = button.dataset.filter; // coffee, milk, diet 등

            if (button.dataset.active === "true") {
                // 이미 활성화된 버튼 클릭 -> 비활성화
                button.dataset.active = "false";
                button.classList.remove("button-active");
                button.style.backgroundColor = ""; // 배경색 초기화
                // 필터 상태에서 제거
                const index = selectedFilters[type].indexOf(filter);
                if (index > -1) {
                    selectedFilters[type].splice(index, 1);
                }
            } else {
                // 비활성화된 버튼 클릭 -> 활성화
                button.dataset.active = "true";
                button.classList.add("button-active");
                button.style.backgroundColor = getBackgroundColor(selectedCafe); // 클릭 시 배경색 유지
                // 필터 상태에 추가
                selectedFilters[type].push(filter);
            }

            // 필터링된 음료 목록 렌더링
            applyFilters(cafeData);
        });
    });
}



// 필터링된 음료 렌더링
function filterDrinks(cafeData, type, filter) {
    const filteredDrinks = cafeData.drinks.filter((drink) => {
        if (type === "base") {
            return drink.base === filter;
        } else if (type === "feature") {
            return drink.features && drink.features.includes(filter);
        }
        return false;
    });

    renderFilteredGallery(filteredDrinks);
}

// 필터링 적용
function applyFilters(cafeData) {
    const { base, feature } = selectedFilters;

    const filteredDrinks = cafeData.drinks.filter((drink) => {
        const baseMatch = base.length === 0 || base.includes(drink.base);
        const featureMatch =
            feature.length === 0 ||
            (drink.features && feature.some((f) => drink.features.includes(f)));

        return baseMatch && featureMatch; // 모든 조건이 일치해야 함
    });

    renderFilteredGallery(filteredDrinks);
}

// 필터링된 갤러리 렌더링
function renderFilteredGallery(filteredDrinks) {
    const gallery = document.getElementById("gallery");

    // 필터링된 음료 렌더링
    gallery.innerHTML = filteredDrinks
        .map((drink, index) => {
            const isReverse = index % 2 === 1 ? "reverse" : "";

            // 이미지 유무에 따라 배경색 설정
            const backgroundColor = getBackgroundColor(selectedCafe, 0.1); // 이미지 없는 경우 투명도 10%
            const bgColorForImage = getBackgroundColor(selectedCafe);

            return `
                <div class="gallery-item ${isReverse}" data-index="${index}" style="background-color: ${backgroundColor};">
                    ${
                        isReverse
                            ? `
                            <div class="text-right">
                                <h2>${drink.name}</h2>
                            </div>
                            <div class="img-container" style="background-color: ${bgColorForImage};">
                                ${
                                    drink.image
                                        ? `<img src="${drink.image}" alt="${drink.name}">`
                                        : ""
                                }
                            </div>
                        `
                            : `
                            <div class="img-container" style="background-color: ${bgColorForImage};">
                                ${
                                    drink.image
                                        ? `<img src="${drink.image}" alt="${drink.name}">`
                                        : ""
                                }
                            </div>
                            <div class="text-left">
                                <h2>${drink.name}</h2>
                            </div>
                        `
                    }
                </div>
            `;
        })
        .join("");

    // 필터링된 아이템에 클릭 이벤트 추가
    const galleryItems = document.querySelectorAll(".gallery-item");
    galleryItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            showModal(filteredDrinks, index); // 클릭 시 모달 열기
        });
    });
}

// 기존 갤러리 렌더링 함수 (로고와 텍스트 포함)
function renderGallery(cafeData) {
    const gallery = document.getElementById("gallery");

    gallery.innerHTML = cafeData.drinks
        .map((drink, index) => {
            const isReverse = index % 2 === 1 ? "reverse" : "";

            // 이미지 유무에 따라 배경색 설정
            const backgroundColor = getBackgroundColor(selectedCafe, 0.1); // 이미지 없는 경우 투명도 20%
            const bgColorForImage = getBackgroundColor(selectedCafe);
            return `
                <div class="gallery-item ${isReverse}" data-index="${index}" style="background-color: ${backgroundColor};">
                    ${
                        isReverse
                            ? `
                            <div class="text-right">
                                <h2>${drink.name}</h2>
                            </div>
                            <div class="img-container" style="background-color: ${bgColorForImage};">
                                ${
                                    drink.image
                                        ? `<img src="${drink.image}" alt="${drink.name}">`
                                        : ""
                                }
                            </div>
                        `
                            : `
                            <div class="img-container" style="background-color: ${bgColorForImage};">
                                ${
                                    drink.image
                                        ? `<img src="${drink.image}" alt="${drink.name}">`
                                        : ""
                                }
                            </div>
                            <div class="text-left">
                                <h2>${drink.name}</h2>
                            </div>
                        `
                    }
                </div>
            `;
        })
        .join("");

    // 디버깅: 확인용 콘솔 로그 추가
    console.log("Rendered gallery items:", cafeData.drinks);

    // 각 갤러리 아이템에 클릭 이벤트 추가
    const galleryItems = document.querySelectorAll(".gallery-item");
    galleryItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            showModal(cafeData.drinks, index);
        });
    });
}


// 에러 렌더링 함수
function renderError() {
    document.getElementById("cafe-title").textContent = "Cafe Not Found";
    document.getElementById("gallery").innerHTML =
        "<p>The selected cafe does not exist.</p>";
}

// 배경색 함수
function getBackgroundColor(cafeName, opacity = 1) {
    const baseColors = {
        starbucks: [38, 64, 37], // 스타벅스 RGB
        gongcha: [114, 56, 61], // 공차 RGB
        compose: [239, 224, 149], // 컴포즈 RGB
        mega: [250, 207, 67], // 메가 RGB
    };

    const defaultColor = [255, 255, 255]; // 기본 흰색 RGB
    const color = baseColors[cafeName] || defaultColor;

    // RGBA 값 반환 (투명도 적용)
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
}


// CSS 효과를 위한 클래스 추가
function toggleButtonEffect(button, isActive) {
    if (isActive) {
        button.classList.add("button-active");
    } else {
        button.classList.remove("button-active");
    }
}

// 기존 요소 선택
const contentsContainer = document.querySelector(".contents-container");

// 햄버거 메뉴 열기
hamburgerBtn.addEventListener("click", () => {
    sideMenu.classList.remove("hidden"); // 메뉴 보이기
    sideMenu.classList.add("visible"); // 메뉴 활성화
    contentsContainer.classList.add("compressed"); // 콘텐츠 비율 조정
});

// 메뉴 닫기
menuClose.addEventListener("click", () => {
    sideMenu.classList.remove("visible"); // 메뉴 숨기기
    sideMenu.classList.add("hidden"); // 메뉴 비활성화
    contentsContainer.classList.remove("compressed"); // 콘텐츠 원래 비율 복원
});

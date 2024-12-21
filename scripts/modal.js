// 모달 요소
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalClose = document.querySelector(".modal-close");
const modalPrev = document.getElementById("modal-prev");
const modalNext = document.getElementById("modal-next");
const modalRecipe = document.getElementById("modal-recipe");

// 갤러리 데이터 및 현재 인덱스
let currentIndex = 0;
let currentGallery = [];

// 모달 열기 함수
function showModal(drinks, index) {
    currentGallery = drinks;
    currentIndex = index;
    updateModal();
    modal.style.display = "flex";
}

// 모달 업데이트 함수
function updateModal() {
    const drink = currentGallery[currentIndex];
    modalImg.src = drink.image;
    modalTitle.textContent = drink.name;
    modalDescription.textContent = drink.description;

    // 기존 레시피 내용을 비우고 새로 렌더링
    modalRecipe.innerHTML = "<p>RECIPE</p>";
    renderRecipe(drink.recipe);

    // 해시태그 렌더링
    renderTags(drink.features);
}

function renderTags(features) {
    // 기존 태그가 있다면 초기화
    let tagsContainer = document.getElementById("modal-tags");
    if (!tagsContainer) {
        // 태그 컨테이너가 없으면 생성
        tagsContainer = document.createElement("div");
        tagsContainer.id = "modal-tags";
        modalTitle.insertAdjacentElement("afterend", tagsContainer); // 제목 아래에 삽입
    }

    // 태그 초기화 후 새로 렌더링
    tagsContainer.innerHTML = "";
    features.forEach((feature) => {
        const tag = document.createElement("span");
        tag.className = "modal-tag";
        tag.textContent = `#${formatFeature(feature)}`;
        tagsContainer.appendChild(tag);
    });
}

// 해시태그 텍스트 포맷팅 함수
function formatFeature(feature) {
    // 필요 시 feature 텍스트를 한국어로 변환
    const featureMap = {
        "diet": "다이어트",
        "no-milk": "우유를 못마신다면",
        "high-caffeine": "밤샘이 필요할 때",
        "sweet": "고당도",
        "unique": "특이한 조합",
        "seasonal": "시즌메뉴를 더 특별하게",
    };
    return featureMap[feature] || feature;
}

// 레시피 데이터를 생성하고 렌더링하는 함수
function renderRecipe(recipe) {
    const recipeContainer = document.getElementById("modal-recipe");

    // 레시피 내용을 HTML로 생성
    let recipeHTML = "<ul>"; // ul 태그로 시작
    for (const [key, value] of Object.entries(recipe)) {
        recipeHTML += `
            <li>
                <span class="recipe-key">${formatRecipeKey(key)} </span>
                <span class="recipe-value">${value}</span>
            </li>`;
    }
    recipeHTML += "</ul>"; // ul 태그로 종료

    // 기존 <p> 아래에 렌더링
    recipeContainer.innerHTML += recipeHTML;
}

// 레시피 키 포맷팅 함수
function formatRecipeKey(key) {
    const formattedKey = key.replace(/_/g, " "); // 언더스코어를 공백으로 변경
    return formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1); // 첫 글자 대문자
}

// 화살표 이벤트
modalPrev.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateModal();
    }
});

modalNext.addEventListener("click", () => {
    if (currentIndex < currentGallery.length - 1) {
        currentIndex++;
        updateModal();
    }
});

// 모달 닫기 이벤트
modalClose.addEventListener("click", () => {
    modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

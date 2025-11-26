const inventorySystem = {
    // 1. 초기화 (초기 설정)
    init() {
        // HTML에 있는 버튼들을 가져옵니다.
        let openBtn = document.getElementById("inventory");
        let closeBtn = document.getElementById("exit-inventory");

        // 클릭 이벤트 연결
        if (openBtn) {
            openBtn.addEventListener("click", function () {
                inventorySystem.showInventory();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener("click", function () {
                inventorySystem.hideInventory();
            });
        }
        console.log("인벤토리 준비 완료");
    },

    // 2. 아이템 추가 함수
    addItem(itemName, count) {
        // count가 없으면 1개로 설정 (if문 사용)
        if (count == undefined) {
            count = 1;
        }

        let existingItem = null;

        for (let i = 0; i < gameState.player.items.length; i++) {
            let item = gameState.player.items[i];
            if (item.name == itemName) {
                existingItem = item;
                break; // 찾았으면 멈춤 (break문)
            }
        }

        if (existingItem != null) {
            existingItem.count += count;
        } else {
            // 배열에 추가 (push는 기본 기능)
            gameState.player.items.push({ name: itemName, count: count });
        }

        console.log(itemName + " " + count + "개 획득!");

        // 인벤토리가 켜져있으면 화면 갱신
        let ui = document.getElementById("inventory_UI");
        if (ui.style.display == "flex") {
            inventorySystem.showInventory(); // 갱신을 위해 다시 그리기
        }
    },

    // 3. 인벤토리 보여주기 (화면 그리기 포함)
    showInventory() {
        let ui = document.getElementById("inventory_UI");
        if (ui) {
            ui.style.display = "flex";

            // --- 여기서부터 아이템 목록 그리기 (render 기능) ---
            let listContainer = document.getElementById("inventory-list");
            listContainer.innerHTML = ""; // 기존 목록 지우기

            // 아이템이 없으면 메시지 출력
            if (gameState.player.items.length == 0) {
                listContainer.innerHTML = '<div style="padding:20px; text-align:center;">가방이 비었습니다.</div>';
                return;
            }

            for (let i = 0; i < gameState.player.items.length; i++) {
                let item = gameState.player.items[i];

                // HTML 태그 만들기
                let slot = document.createElement("div");
                slot.className = "item-slot";

                let htmlContent = "<div>";
                htmlContent += "<div>" + item.name + "</div>";
                htmlContent += "<small>x" + item.count + "</small>";
                htmlContent += "</div>";

                slot.innerHTML = htmlContent;

                // 클릭하면 아이템 사용하기 (인덱스 i를 이용)
                slot.setAttribute("data-index", i);
                slot.addEventListener("click", function () {
                    // 클릭된 요소의 data-index 값을 읽어옴
                    let idx = this.getAttribute("data-index");
                    inventorySystem.useItem(idx);
                });

                listContainer.appendChild(slot);
            }
        }
    },

    // 4. 인벤토리 숨기기
    hideInventory() {
        let ui = document.getElementById("inventory_UI");
        if (ui) {
            ui.style.display = "none";
        }
    },

    // 5. 아이템 사용하기
    useItem(index) {
        let item = gameState.player.items[index];

        if (item.name == "체력 물약") {

            // HTML에서 체력 태그 가져오기
            let hpTag = document.getElementById("player-hp");
            let maxHpTag = document.getElementById("player-max-hp");

            // 체력이 가득 차 있으면 사용하지 않음 (선택 사항)
            if (gameState.player.hp >= gameState.player.maxHp) {
                alert("체력이 이미 가득 찼습니다!");
                return; // 함수 종료 (아이템 소모 안 됨)
            }

            // 체력 2 회복
            gameState.player.hp = gameState.player.hp + 2;

            // 최대 체력(10)을 넘지 않게 막기
            if (gameState.player.hp > gameState.player.maxHp) {
                gameState.player.hp = gameState.player.maxHp;
            }

            // 화면에 반영
            hpTag.innerText = gameState.player.hp;

            // 알림창 띄우기
            alert("체력이 2 회복되었습니다. (현재 체력: " + gameState.player.hp + ")");

            // 아이템 개수 줄이기 (사용했으므로)
            item.count--;

            // 0개가 되면 가방에서 삭제
            if (item.count <= 0) {
                gameState.player.items.splice(index, 1);
            }

            // 인벤토리 화면 다시 그리기
            inventorySystem.showInventory();

        } else {
            // 아직 구현 안 된 아이템들
            alert(item.name + "은(는) 아직 사용할 수 없습니다.");
        }
    }
};
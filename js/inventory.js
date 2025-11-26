const inventorySystem = {
    init() {
        const openBtn = document.getElementById("inventory");
        const closeBtn = document.getElementById("exit-inventory");

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
    },

    addItem(itemName, count = 1) {
		let item = gameState.player.items.find((i) => i.name == itemName);
        if (item != undefined) {
            item.count += count;
        } else {
            gameState.player.items.push({ name: itemName, count: count });
        }

        console.log(`${itemName} ${count}개 획득`);

        const ui = document.getElementById("inventory_UI");

		//아이템 UI 열려있으면 다시 그리기
        if (ui.style.display != "none") {
            inventorySystem.showInventory();
        }
    },

    showInventory() {
        const ui = document.getElementById("inventory_UI");
		ui.style.display = "grid";

		// 아이템 목록 그리기
		const inventoryList = document.getElementById("inventory-list");
		inventoryList.innerHTML = ""; // 기존 목록 지우기

		if (gameState.player.items.length == 0) {
			inventoryList.innerHTML = `<div style="padding:20px; text-align:center;">가방이 비었습니다.</div>`;
			return;
		}

		for (let i = 0; i < gameState.player.items.length; i++) {
			let item = gameState.player.items[i];

			let slot = document.createElement("div");
			slot.className = "item-slot";
			slot.innerHTML = `
				<div>
					<div>${item.name}</div>
					<small>x${item.count}</small>
				</div>
			`;

			slot.setAttribute("data-index", i);
			slot.addEventListener("click", function () {
				inventorySystem.useItem(this.getAttribute("data-index"));
			});

			inventoryList.appendChild(slot);
        }
    },

    hideInventory() {
        document.getElementById("inventory_UI").style.display = "none";
    },

    useItem(index) {
        let item = gameState.player.items[index];

        switch(item.name) {
			case "체력 물약":
				const hpTag = document.getElementById("player-hp");
				const maxHpTag = document.getElementById("player-max-hp");

				if (gameState.player.hp >= gameState.player.maxHp) {
					alert("체력이 이미 가득 찼습니다!");
					return;
				}

				gameState.player.hp = Math.min(gameState.player.hp + 2, gameState.player.maxHp);
				hpTag.innerText = gameState.player.hp;
				alert("체력이 2 회복되었습니다. (현재 체력: " + gameState.player.hp + ")");
				break;
			default:
				break;
        }

		item.count--;
		if (item.count <= 0) {
			gameState.player.items.splice(index, 1);
		}

		inventorySystem.showInventory();
    }
};

// 인벤토리 시스템 초기화
document.addEventListener('DOMContentLoaded', function() {
    inventorySystem.init();
});
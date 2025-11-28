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
					<div class="item-name">${item.name}</div>
					<small class="item-count">x${item.count}</small>
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
		const player = gameState.player;
		let item = player.items[index];

		// 아이템 사용 기록 초기화
		if (!player.turnItemUsage) {
			player.turnItemUsage = {};
		}

		// 아이템을 이번 턴에 사용했는지 체크
		if (player.turnItemUsage[item.name]) {
			alert(item.name + "은(는) 한 턴에 한 번만 사용할 수 있습니다!");
			return;
		}

		// 버프 초기화
		if (!gameState.player.buffs) {
			gameState.player.buffs = {
				nextDiceFlatBonus: 0,
				nextDiceMinPlus: 0,
				nextDiceMaxPlus: 0,
				nextDiceHpFromRoll: false,
			};
		}

		let used = false;

		switch (item.name) {
			case "체력 물약":
				const hpTag = document.getElementById("player-hp");

				if (gameState.player.hp >= gameState.player.maxHp) {
					alert("체력이 이미 가득 찼습니다!");
					return;
				}

				gameState.player.hp = Math.min(gameState.player.hp + 2, gameState.player.maxHp);
				hpTag.innerText = gameState.player.hp;

				alert("체력이 2 회복되었습니다. (현재 체력: " + gameState.player.hp + ")");
				used = true;
				break;

			case "더블 주사위": {
				// 다음 주사위 눈금 +2
				gameState.player.buffs.nextDiceFlatBonus =
					(gameState.player.buffs.nextDiceFlatBonus || 0) + 2;

				alert("다음 주사위의 총 눈금이 +2 됩니다!");
				used = true;
				break;
			}

			case "생명의 주사위": {
				// 다음 주사위 눈금 / 2 만큼 체력 회복
				gameState.player.buffs.nextDiceHpFromRoll = true;

				alert("다음 주사위를 굴릴 때, 나온 눈금의 절반만큼 체력이 회복됩니다!");
				used = true;
				break;
			}

			case "위대한 주사위": {
				// 다음 주사위 최소/최대 눈금 +2
				gameState.player.buffs.nextDiceMinPlus =
					(gameState.player.buffs.nextDiceMinPlus || 0) + 2;
				gameState.player.buffs.nextDiceMaxPlus =
					(gameState.player.buffs.nextDiceMaxPlus || 0) + 2;

				alert("다음 주사위의 최소/최대 눈금이 +2 됩니다!");
				used = true;
				break;
			}

			case "레벨 업 주사위": {
				// 영구적으로 최소/최대 눈금 +1
				gameState.player.diceMinBonus = (gameState.player.diceMinBonus || 0) + 1;
				gameState.player.diceMaxBonus = (gameState.player.diceMaxBonus || 0) + 1;

				alert("주사위 최소/최대 눈금이 영구적으로 +1 증가했습니다!");
				used = true;
				break;
			}

			default:
				break;
		}

		if (used) {
			// 아이템 사용 기록
			player.turnItemUsage[item.name] = true;

			// 개수 차감
			item.count--;
			if (item.count <= 0) {
				player.items.splice(index, 1);
			}

			// 인벤토리 UI 다시 그리기
			inventorySystem.showInventory();
		}
	}
};

// 인벤토리 시스템 초기화
document.addEventListener('DOMContentLoaded', function () {
	inventorySystem.init();
});
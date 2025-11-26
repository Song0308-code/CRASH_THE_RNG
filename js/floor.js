// 층 관리 시스템
const floorSystem = {
    currentFloor: 1,
    maxFloor: 5, 

    // 다음 층으로 이동
    nextFloor() {
        if (this.currentFloor < this.maxFloor) {
             
            this.currentFloor++;
            this.loadFloorMonster(this.currentFloor);
            gameState.player.gold += 10;
            updateUI();
            this.showNextActionChoice();
        } else {
            alert('축하합니다! 모든 층을 클리어하셨습니다!');
        }
    },

    // 다음 행동 선택 (전투 시작)
    showNextActionChoice() {
        const choiceOverlay = document.createElement('div');
        choiceOverlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: black;
            display: flex;
            justify-content: center;
            align-items: center;    
        `; 

        const choiceContainer = document.createElement('div');
        choiceContainer.style.cssText = `
            background: #2F4F4F;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			gap: 10px;
        `;

        const title = document.createElement('h2');
        title.textContent = `${this.currentFloor}층에 도착했습니다!`; //방금 여기부분 건드렸음

        const battleButton = document.createElement('button');
        battleButton.className = 'action-btn';
        battleButton.textContent = '전투 시작';
        battleButton.onclick = () => {
            document.body.removeChild(choiceOverlay); //선택창을 제거하고 새로운 전투 시작.
            battleSystem.startNewBattle();
        };

        const shopButton = document.createElement('button');
        shopButton.className = 'action-btn';
        shopButton.textContent = '상점 방문';
        shopButton.onclick = () => {
            document.body.removeChild(choiceOverlay); //선택창 제거하고 상점으로 이동하기.
            if (typeof shopSystem !== 'undefined' && typeof shopSystem.showShop === 'function') {
                shopSystem.showShop();
            }
        };
        choiceContainer.appendChild(title);
        choiceContainer.appendChild(battleButton);
        choiceContainer.appendChild(shopButton);
        choiceOverlay.appendChild(choiceContainer);
        document.body.appendChild(choiceOverlay);
    }
};


floorSystem.loadFloorMonster = function(floor) {
    const nextMonster = monsterData[floor];

    if (nextMonster) {
        gameState.enemy.name = nextMonster.name;
        gameState.enemy.image = nextMonster.image;
        gameState.enemy.maxHp = nextMonster.maxHp;
        gameState.enemy.Max_dice = nextMonster.Max_dice;
        gameState.enemy.Min_dice = nextMonster.Min_dice;
        updateMonsterUI(); 
    }
};

// 초기화
    document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('current-floor').textContent = floorSystem.currentFloor;
    document.getElementById('total-floors').textContent = floorSystem.maxFloor;
});

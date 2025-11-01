// 층 관리 시스템
const floorSystem = {
    currentFloor: 1,
    maxFloor: 10,

    // 다음 층으로 이동
    nextFloor() {
        if (this.currentFloor < this.maxFloor) {
            this.currentFloor++;
            gameState.enemy.hp = gameState.enemy.maxHp; // 적 체력 회복
            document.getElementById('current-floor').textContent = this.currentFloor;
            
            // 층 클리어 보상
            gameState.player.gold += 10;
            updateUI();

            // 다음 행동 선택 창 표시
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
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        const choiceContainer = document.createElement('div');
        choiceContainer.style.cssText = `
            background: var(--panel);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
        `;

        const title = document.createElement('h2');
        title.textContent = `${this.currentFloor}층에 도착했습니다!`;
        title.style.marginBottom = '20px';

        const battleButton = document.createElement('button');
        battleButton.className = 'action-btn';
        battleButton.textContent = '전투 시작';
        battleButton.style.marginRight = '10px';
        battleButton.onclick = () => {
            document.body.removeChild(choiceOverlay);
            battleSystem.startNewBattle();
        };

        const shopButton = document.createElement('button');
        shopButton.className = 'action-btn';
        shopButton.textContent = '상점 방문';
        shopButton.onclick = () => {
            document.body.removeChild(choiceOverlay);
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

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('current-floor').textContent = floorSystem.currentFloor;
    document.getElementById('total-floors').textContent = floorSystem.maxFloor;
});

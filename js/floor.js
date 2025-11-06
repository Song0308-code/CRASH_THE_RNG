// 층 관리 시스템
const floorSystem = {
    currentFloor: 1,
    maxFloor: 10, //일단 10층으로 설정해둠

    // 다음 층으로 이동
    nextFloor() {
        if (this.currentFloor < this.maxFloor) {
             
            this.currentFloor++;
            gameState.enemy.hp = gameState.enemy.maxHp; // 이부분을 고쳐서 적 밸런스 맞춰야함 몬스터 ui도 if문으로 걸어서 초기화 하면 될듯?
            document.getElementById('current-floor').textContent = this.currentFloor;
            
            // 일단은 층에서 이기면 10골드 획득
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
        `;

        const title = document.createElement('h2');
        title.textContent = `${this.currentFloor}층에 도착했습니다!`; //방금 여기부분 건드렸음
        title.style.marginBottom = '20px';

        const battleButton = document.createElement('button');
        battleButton.className = 'action-btn';
        battleButton.textContent = '전투 시작';
        battleButton.style.marginRight = '10px';
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

// 초기화
    document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('current-floor').textContent = floorSystem.currentFloor;
    document.getElementById('total-floors').textContent = floorSystem.maxFloor;
});

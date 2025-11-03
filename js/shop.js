const shopSystem = {
    init() {
        // 테스트 버튼
        const testButton = document.getElementById('test-shop-button');
        if (testButton) {
            testButton.addEventListener('click', () => this.showShop());
        }
    },

    items: [
        { name: "체력 물약", cost: 5, effect: "heal", value: 2, description: "체력을 2만큼 회복합니다" },
        { name: "더블 주사위", cost: 7, effect: "dice_buff", value: 2, description: "다음 주사위 굴림에서 +2 보너스" },
        { name: "레벨 업 주사위", cost: 21, effect: "dice_permanent", value: 1, description: "주사위 최대값이 영구적으로 1 증가" }
    ],

    createShopElement() {
        // 상점 오버레이 생성
        const overlay = document.createElement('div');
        overlay.className = 'shop-overlay';
        
        // 상점 창 생성
        const shopWindow = document.createElement('div');
        shopWindow.className = 'shop-window';
        
        // 상점 내용 
        shopWindow.innerHTML = `
            <h1 class="shop-title">상점</h1>
            <div class="shop-header">
                <div id="shop-gold">소지금: ${gameState.player.gold}G</div>
            </div>
            <div class="shop-items">
                ${this.items.map(item => this.createItemCard(item)).join('')}
            </div>
            <button id="exit-shop" class="shop-btn">상점 나가기</button>
        `;

        overlay.appendChild(shopWindow);
        return overlay;
    },

    createItemCard(item) {
        const canAfford = gameState.player.gold >= item.cost;
        return `
            <div class="shop-item">
                <h2 class="item-name">${item.name}</h2>
                <p class="item-desc">${item.description}</p>
                <div class="item-cost">${item.cost}G</div>
                <button class="shop-btn ${!canAfford ? 'disabled' : ''}" 
                        onclick="shopSystem.buyItem('${item.name}')"
                        ${!canAfford ? 'disabled' : ''}>
                    ${canAfford ? '구매하기' : '골드 부족'}
                </button>
            </div>
        `;
    },

    showShop() {
        
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.display = 'none';
        }

        // 기존 상점이 있다면 제거
        const existingShop = document.querySelector('.shop-overlay');
        if (existingShop) existingShop.remove();

        // 상점 생성
        const shopElement = this.createShopElement();
        document.body.appendChild(shopElement);

        // 상점 표시
        shopElement.style.display = 'flex';

        // 나가기 버튼
        const exitBtn = shopElement.querySelector('#exit-shop');
        exitBtn.onclick = () => {
            this.hideShop();
            updateUI();
            battleSystem.startNewBattle();
        };
        
    },

    hideShop() {
        // 상점 제거
        const shop = document.querySelector('.shop-overlay');
        if (shop) {
            shop.remove();
        }

        // 게임 컨테이너 다시 표시
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.display = 'block';
        }
    },

    buyItem(itemName) {
        const item = this.items.find(i => i.name === itemName);
        if (!item) return;

        if (gameState.player.gold >= item.cost) {
            gameState.player.gold -= item.cost;
            inventorySystem.addItem(item);
            
            // UI 업데이트
            this.showShop(); // 상점 UI 리프레시
            updateUI(); // 전체 UI 업데이트
        }
    }
};
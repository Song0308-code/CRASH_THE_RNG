

const shopSystem = {
    init() {
        // 테스트 버튼
        const testButton = document.getElementById('test-shop-button');
        if (testButton) {
            testButton.addEventListener('click', function() {
                shopSystem.showShop();
            });
        }
        
        const exitBtn = document.getElementById('exit-shop'); //상점 나가는 버튼.
        if (exitBtn) {
            exitBtn.addEventListener('click', function() {
                shopSystem.hideShop();
                updateUI();
                if (typeof battleSystem !== 'undefined' && battleSystem.startNewBattle) {
                    battleSystem.startNewBattle();
                }
            });
        }
    },

    
    items: [],

    
    
    renderShop() {
        const overlay = document.getElementById('shop-overlay');
        const itemsContainer = document.getElementById('shop-items');
        const hadgold = document.getElementById('shop-gold');
        if (!overlay || !itemsContainer || !hadgold) return;

        // 보유 골드 갱신해주기
        hadgold.textContent = `보유골드: ${gameState.player.gold}G`;

        // 아이템 렌더링 없음 (단순 UI용)
        itemsContainer.innerHTML = '';
    },
    

    showShop() {
        //전투 씬일시에 전투ui 숨기기
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) {
                gameContainer.style.display = 'none';
        }
        //상점 창 띄우기.
        const overlay = document.getElementById('shop-overlay');
        if (!overlay) return;

        this.renderShop();
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        
    },

    hideShop() {
        // 상점 숨기기
        const overlay = document.getElementById('shop-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }

        // 게임 UI 다시 표시
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) {
                gameContainer.style.display = 'block';
        }
    },

    buyItem() {  }
};
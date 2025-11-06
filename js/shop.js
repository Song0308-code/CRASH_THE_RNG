const shopSystem = {
    init() {
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

    initShop() {
        const overlay = document.getElementById('shop-overlay');
        const hadgold = document.getElementById('shop-gold');
        if (!overlay ||  !hadgold) return;
        // 보유 골드 갱신해주기
        hadgold.textContent = `보유골드: ${gameState.player.gold}G`;
    },
    

    showShop() {
        //전투 씬일시에 전투ui 숨기기
            const gameContainer = document.getElementById('battle_UI');
            if (gameContainer) {
                gameContainer.style.display = 'none';
        }
        //상점 창 띄우기.
        const overlay = document.getElementById('shop-overlay');
        if (!overlay) return;

        this.initShop();
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
        const gameContainer = document.getElementById('battle_UI');
        if (gameContainer) {
            gameContainer.style.display = 'block';
        }
    },

    buyItem() {  }
};
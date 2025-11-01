// 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 게임 시스템 초기화
    shopSystem.init();
    inventorySystem.init();

    // 시작 버튼(타이틀) 처리
    const startBtn = document.getElementById('start-game-button');
    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.getElementById('game-container');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            // 숨김/표시 전환
            if (startScreen) startScreen.style.display = 'none';
            if (gameContainer) gameContainer.style.display = 'block';

            // UI 초기화
                updateUI();
                // 첫 전투 시작
                battleSystem.startNewBattle();
        });
    }
});
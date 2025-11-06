// 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 게임 시스템 초기화
    shopSystem.init();

    // 시작 버튼(타이틀) 처리
    const startBtn = document.getElementById('start-game-button');
    const start_UI = document.getElementById('start_UI');
    const gameContainer = document.getElementById('battle_UI');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (start_UI) start_UI.style.display = 'none';
            if (gameContainer) gameContainer.style.display = 'block';

            // UI 초기화
            updateUI();

            // 전투 시작.
            battleSystem.startNewBattle();
        });
    }
});
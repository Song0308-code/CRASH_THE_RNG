// 게임 초기화 및 이벤트 리스너 설정
window.addEventListener('DOMContentLoaded', () => {
    // 공격 버튼 이벤트
    document.getElementById('attack-button').addEventListener('click', () => {
        battleSystem.playerAttack();
        // 플레이어 공격 후 적 공격
        setTimeout(() => {
            if (gameState.enemy.hp > 0) {
                battleSystem.enemyAttack();
            }
        }, 1000);
    });

    // 상점 스킵 버튼 이벤트
    document.getElementById('skip-shop').addEventListener('click', () => {
        gameState.currentView = 'battle';
        battleSystem.startBattle();
    });

    // 게임 시작
    battleSystem.startBattle();
    updateUI();
});
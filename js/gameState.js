// 게임 상태 관리
const gameState = {
    player: {
        hp: 10,
        maxHp: 10,
        gold: 15
    }
};

// UI 업데이트 함수
function updateUI() {
    document.getElementById('player-hp').textContent = gameState.player.hp;
    document.getElementById('player-max-hp').textContent = gameState.player.maxHp;
    document.getElementById('player-gold').textContent = gameState.player.gold;
}
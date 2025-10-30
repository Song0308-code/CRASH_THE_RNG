// 게임의 전체적인 상태를 관리하는 객체
const gameState = {
    currentFloor: 1,
    totalFloors: 10,
    player: {
        hp: 5,
        maxHp: 10,
        gold: 15,
        inventory: [],
        baseDice: { min: 1, max: 6 }
    },
    enemy: {
        hp: 0,
        minDice: 1,
        maxDice: 6,
        name: "",
        image: ""
    },
    currentView: 'start' // 'start', 'battle', 'shop', 'floor-clear', 'game-over', 'victory'
};

// UI 업데이트 함수
function updateUI() {
    // 상태바 업데이트
    document.getElementById('current-floor').textContent = gameState.currentFloor;
    document.getElementById('total-floors').textContent = gameState.totalFloors;
    document.getElementById('player-hp').textContent = gameState.player.hp;
    document.getElementById('player-max-hp').textContent = gameState.player.maxHp;
    document.getElementById('player-gold').textContent = gameState.player.gold;

    // 뷰 상태에 따른 화면 전환
    updateGameView();
}

// 게임 화면 전환 함수
function updateGameView() {
    const views = ['battle-view', 'shop-view'];
    views.forEach(view => {
        document.getElementById(view).style.display = 
            view.includes(gameState.currentView) ? 'block' : 'none';
    });
}
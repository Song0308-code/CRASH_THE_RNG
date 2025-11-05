// 게임 상태 관리
const gameState = {
    player: { // 플레이어 스탯
        hp: 10,
        maxHp: 10,
        gold: 150, //아이템 잘 사지나 컴파일용으로 돈많이 설정해둠
        Max_dice: 6,
        Min_dice: 1,
        items: {} //아이템 인벤토리는 일단 만들어놧음.
    },
    enemy :{  // 적 스탯
        hp: 1,
        maxHp: 1, //일단 층 잘 넘어가는지 확인할라고 1로 설정해둠
        attack: 5,
        Max_dice: 6,
        Min_dice: 1
    }
};

// UI 업데이트 함수
function updateUI() {
    document.getElementById('player-hp').textContent = gameState.player.hp;
    document.getElementById('player-max-hp').textContent = gameState.player.maxHp;
    document.getElementById('player-gold').textContent = gameState.player.gold;
}
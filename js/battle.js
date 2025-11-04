// 주사위 굴리기 함수
function rollDice(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 전투 시스템 일단 메커니즘 구현은 ppt기준으로 돠어았어서 바꿔야함.
const battleSystem = {
    init() {
        const attackButton = document.getElementById('attack-button');
        if (attackButton) {
            attackButton.addEventListener('click', () => this.rollDice());
        }
    },

    startNewBattle() {
        // 새로운 전투 시작시 적 정보 초기화 이부분에서 밸런스 설정해야함.
        gameState.enemy.hp = gameState.enemy.maxHp;
        document.getElementById('enemy-hp').textContent = gameState.enemy.hp;
        // 전투 버튼 활성화
        document.getElementById('attack-button').disabled = false;
    },

    rollDice() {
        // 플레이어 주사위
        const playerRoll = rollDice(gameState.player.Min_dice, gameState.player.Max_dice);
        
        // 적 주사위
        const enemyRoll = rollDice(gameState.enemy.Min_dice, gameState.enemy.Max_dice);
        
        // 결과 표시
        alert(`당신의 주사위: ${playerRoll}\n적의 주사위: ${enemyRoll}`);
        
        // 주사위 결과에 따른 대미지 계산 전투메커니즘 쪽 (2데미지 고정)
        if (playerRoll > enemyRoll) {
            // 플레이어 승리
            gameState.enemy.hp -= 2;
            alert('적에게 2데미지!');
        } else if (enemyRoll > playerRoll) {
            // 적 승리
            gameState.player.hp -= 2;
            alert('당신이 2데미지를 받았습니다!');
        } else {
            alert('동점! 아무도 데미지를 받지 않았습니다.');
        }
        
        // UI 업데이트
        document.getElementById('enemy-hp').textContent = gameState.enemy.hp;
        updateUI();
        
        // 전투 결과 체크
        this.checkBattleResult();
    },

    checkBattleResult() {
        const attackButton = document.getElementById('attack-button');
        
        if (gameState.enemy.hp <= 0) {
            // 전투 버튼 비활성화
            attackButton.disabled = true;
            
            // 승리 처리
            setTimeout(() => {
                alert('전투 승리!');
                floorSystem.nextFloor();
            }, 100);
        } else if (gameState.player.hp <= 0) {
            // 전투 버튼 비활성화
            attackButton.disabled = true;
            setTimeout(() => {
                alert('게임 오버...');
                location.reload(); // 게임 재시작
            }, 100);
        }
    }
};

// 전투 시스템 초기화
document.addEventListener('DOMContentLoaded', () => {
    battleSystem.init();
});
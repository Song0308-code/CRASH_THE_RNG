const battleSystem = {
    startBattle() {
        this.generateEnemy();
        updateUI();
    },
    
    generateEnemy() {
        const floor = gameState.currentFloor;
        gameState.enemy = {
            hp: floor * 3,
            minDice: 1 + Math.floor(floor / 3),
            maxDice: 6 + Math.floor(floor / 2),
            name: `${floor}층의 몬스터`,
            image: `assets/monster${floor}.png` // 이미지는 나중에 추가
        };
    },
    
    playerAttack() {
        const damage = this.rollDice(gameState.player.baseDice.min, gameState.player.baseDice.max);
        gameState.enemy.hp -= damage;
        this.showDamage('player', damage);
        this.checkBattleEnd();
    },
    
    enemyAttack() {
        const damage = this.rollDice(gameState.enemy.minDice, gameState.enemy.maxDice);
        gameState.player.hp -= damage;
        this.showDamage('enemy', damage);
        this.checkBattleEnd();
    },
    
    rollDice(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    showDamage(source, damage) {
        // 데미지 표시 애니메이션 구현
        console.log(`${source}가 ${damage} 데미지를 입혔습니다.`);
    },
    
    checkBattleEnd() {
        if (gameState.enemy.hp <= 0) {
            // 전투 승리
            gameState.currentView = 'floor-clear';
            this.giveBattleRewards();
        } else if (gameState.player.hp <= 0) {
            // 게임 오버
            gameState.currentView = 'game-over';
        }
        updateUI();
    },
    
    giveBattleRewards() {
        const goldReward = gameState.currentFloor * 5;
        gameState.player.gold += goldReward;
    }
};
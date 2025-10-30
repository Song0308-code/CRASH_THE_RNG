const floorSystem = {
    advanceFloor() {
        if (gameState.currentFloor < gameState.totalFloors) {
            gameState.currentFloor++;
            gameState.currentView = 'shop'; // 상점 선택 기회 제공
            shopSystem.showShop();
            updateUI();
        } else {
            gameState.currentView = 'victory';
            this.showVictoryScreen();
        }
    },

    showVictoryScreen() {
        // 승리 화면 표시
        const container = document.getElementById('game-container');
        container.innerHTML = `
            <div class="victory-screen">
                <h1>축하합니다!</h1>
                <p>모든 층을 클리어하셨습니다!</p>
                <button onclick="location.reload()">다시 시작</button>
            </div>
        `;
    }
};
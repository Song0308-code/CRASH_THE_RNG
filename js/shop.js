const shopSystem = {
    items: [
        { name: "체력 물약", cost: 5, effect: "heal", value: 2, duration: 1 },
        { name: "더블 주사위", cost: 7, effect: "dice_buff", value: 2, duration: 1 },
        { name: "레벨 업 주사위", cost: 21, effect: "dice_permanent", value: 1, duration: "영구" }
    ],
    
    showShop() {
        const shopDiv = document.getElementById('shop-items');
        shopDiv.innerHTML = '';
        
        this.items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-item';
            itemElement.innerHTML = `
                <span>${item.name} - ${item.cost}G</span>
                <button onclick="shopSystem.buyItem(${index})"
                        ${gameState.player.gold < item.cost ? 'disabled' : ''}>
                    구매
                </button>
            `;
            shopDiv.appendChild(itemElement);
        });
    },
    
    buyItem(itemIndex) {
        const item = this.items[itemIndex];
        if (gameState.player.gold >= item.cost) {
            gameState.player.gold -= item.cost;
            inventorySystem.addItem(item);
            this.showShop(); // 상점 UI 업데이트
            updateUI();
        }
    }
};
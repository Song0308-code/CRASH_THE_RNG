const inventorySystem = {
    addItem(item) {
        const existingItem = gameState.player.inventory.find(i => i.name === item.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            gameState.player.inventory.push({ ...item, quantity: 1 });
        }
        this.updateInventoryUI();
    },

    useItem(itemName) {
        const item = gameState.player.inventory.find(i => i.name === itemName);
        if (item && item.quantity > 0) {
            applyItemEffect(item);
            item.quantity -= 1;
            if (item.quantity === 0) {
                gameState.player.inventory = gameState.player.inventory.filter(i => i.name !== itemName);
            }
            this.updateInventoryUI();
        }
    },

    updateInventoryUI() {
        const inventoryDiv = document.getElementById('inventory-items');
        inventoryDiv.innerHTML = '';
        
        gameState.player.inventory.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.innerHTML = `
                <span>${item.name} (${item.quantity}개)</span>
                <button onclick="inventorySystem.useItem('${item.name}')">사용</button>
            `;
            inventoryDiv.appendChild(itemElement);
        });
    }
};
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
        // Only allow using items before the dice roll (gameState.allowItemUse)
        if (!gameState.allowItemUse) {
            console.log('아이템은 주사위를 굴리기 전에만 사용할 수 있습니다.');
            return;
        }

        const item = gameState.player.inventory.find(i => i.name === itemName);
        if (item && item.quantity > 0) {
            // applyItemEffect should be implemented elsewhere
            if (typeof applyItemEffect === 'function') {
                applyItemEffect(item);
            } else {
                console.log('applyItemEffect 함수가 정의되어 있지 않습니다.');
            }

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
            const btn = document.createElement('button');
            btn.textContent = '사용';
            btn.onclick = () => inventorySystem.useItem(item.name);
            // Disable use button if item use is not allowed at this moment
            if (!gameState.allowItemUse) btn.disabled = true;

            itemElement.innerHTML = `<span>${item.name} (${item.quantity}개)</span>`;
            itemElement.appendChild(btn);
            inventoryDiv.appendChild(itemElement);
        });
    }
};
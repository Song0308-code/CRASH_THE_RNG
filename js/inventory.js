const inventorySystem = {
    init() {
        // 인벤토리 버튼 이벤트 연결
        const inventoryBtn = document.getElementById('inventory-button');
        if (inventoryBtn) {
            inventoryBtn.addEventListener('click', () => this.showInventory());
        }
    },

    addItem(item) {
        // 아이템 카운트 증가
        gameState.player.items[item.name]++;
        
        // 인벤토리가 열려있다면 UI 업데이트
        if (document.querySelector('.inventory-popup')) {
            this.showInventory();
        }
    },

    createInventoryElement() {
        const popup = document.createElement('div');
        popup.className = 'inventory-popup';
        
        // 보유 중인 아이템만 필터링
        const items = Object.entries(gameState.player.items)
            .filter(([_, count]) => count > 0)
            .map(([name, count]) => ({
                name,
                count,
                ...shopSystem.items.find(item => item.name === name)
            }));
        
        popup.innerHTML = `
            <div class="inventory-content">
                <div class="inventory-header">
                    <h2 class="inventory-title">인벤토리</h2>
                    <button id="close-inventory" class="inventory-btn close-btn">&times;</button>
                </div>
                <div class="inventory-items">
                    ${items.length > 0 ? 
                        items.map(item => this.createItemCard(item)).join('') :
                        '<div class="empty-inventory">아이템이 없습니다</div>'
                    }
                </div>
            </div>
        `;

        // 닫기 버튼 이벤트 연결
        const closeBtn = popup.querySelector('#close-inventory');
        closeBtn.onclick = () => this.hideInventory();

        return popup;
    },

    createItemCard(item) {
        return `
            <div class="inventory-item">
                <div class="item-header">
                    <h2 class="item-name">${item.name}</h2>
                    <span class="item-count">${item.count}개</span>
                </div>
                <p class="item-desc">${item.description}</p>
                <button class="inventory-btn use-item" 
                        onclick="inventorySystem.useItem('${item.name}')">
                    사용하기
                </button>
            </div>
        `;
    },

    showInventory() {
        // 토글: 이미 열려있다면 닫기
        const existingInventory = document.querySelector('.inventory-popup');
        if (existingInventory) {
            existingInventory.remove();
            return;
        }

        // 새 인벤토리 생성 (DOM에 아직 없음)
        const inventoryElement = this.createInventoryElement();

        // 인벤토리 버튼 위치를 계산해 body에 절대 위치로 추가
        const inventoryBtn = document.getElementById('inventory-button');
        const margin = 10;
        const popupWidth = 320; 

        if (inventoryBtn) {
            const rect = inventoryBtn.getBoundingClientRect();

            
            inventoryElement.style.position = 'absolute';
            inventoryElement.style.visibility = 'hidden';
            inventoryElement.style.left = '0px';
            inventoryElement.style.top = '0px';
            document.body.appendChild(inventoryElement);

            let popupHeight = inventoryElement.offsetHeight;

           
            const preferredRight = rect.right + 10; 
            const preferredLeft = rect.left - popupWidth - 10; 
            let left = preferredRight;

            
            if (left + popupWidth > window.innerWidth - margin) {
                left = preferredLeft;
            }

           
            if (left + popupWidth > window.innerWidth - margin) {
                left = Math.max(margin, window.innerWidth - popupWidth - margin);
            }
            if (left < margin) left = margin;

           
            const spaceBelow = window.innerHeight - rect.bottom - margin;
            const spaceAbove = rect.top - margin;
            let top;

            
            const maxAvailable = Math.max(spaceBelow, spaceAbove);
            if (popupHeight > maxAvailable) {
                const maxPopup = Math.max(100, maxAvailable); 
                inventoryElement.style.maxHeight = `${maxPopup}px`;
                inventoryElement.style.overflowY = 'auto';
                
                const itemsDiv = inventoryElement.querySelector('.inventory-items');
                if (itemsDiv) {
                    
                    itemsDiv.style.maxHeight = `${Math.max(40, maxPopup - 80)}px`;
                    itemsDiv.style.overflowY = 'auto';
                }
                
                popupHeight = inventoryElement.offsetHeight;
            }

            if (spaceBelow < popupHeight && spaceAbove > spaceBelow) {
               
                top = rect.top - popupHeight - 10 + window.scrollY;
            } else {
                
                top = rect.bottom + 10 + window.scrollY;
            }

            
            const maxTop = window.innerHeight - popupHeight - margin + window.scrollY;
            const minTop = margin + window.scrollY;
            if (top > maxTop) top = maxTop;
            if (top < minTop) top = minTop;

            inventoryElement.style.left = `${left + window.scrollX}px`;
            inventoryElement.style.top = `${top}px`;
            inventoryElement.style.visibility = 'visible';
           
            inventoryElement.style.zIndex = 2000;
        } else {
            
            inventoryElement.style.position = 'absolute';
            inventoryElement.style.left = `${(window.innerWidth - popupWidth)/2}px`;
            inventoryElement.style.top = `${100 + window.scrollY}px`;
            inventoryElement.style.zIndex = 2000;
            document.body.appendChild(inventoryElement);
        }
    },

    hideInventory() {
        const inventory = document.querySelector('.inventory-popup');
        if (inventory) {
            inventory.remove();
        }
    },

    useItem(itemName) {
        if (gameState.player.items[itemName] <= 0) return;

        // 아이템 정보 찾기
        const item = shopSystem.items.find(i => i.name === itemName);
        if (!item) return;

        // 아이템 효과 적용
        this.applyItemEffect(item);

        // 아이템 카운트 감소
        gameState.player.items[itemName]--;

        // UI 업데이트
        this.showInventory();
        if (typeof updateUI === 'function') updateUI();
    },

    applyItemEffect(item) {
        switch(item.effect) {
            case 'heal':
                gameState.player.hp = Math.min(
                    gameState.player.hp + item.value,
                    gameState.player.maxHp
                );
                break;

            case 'dice_buff':
                // 다음 주사위 굴림에 보너스 추가
                if (!gameState.player.tempBuffs) gameState.player.tempBuffs = [];
                gameState.player.tempBuffs.push({
                    type: 'dice',
                    value: item.value,
                    duration: 1
                });
                break;

            case 'dice_permanent':
                // 주사위 최대값 영구 증가
                if (!gameState.player.permanentBuffs) gameState.player.permanentBuffs = [];
                gameState.player.permanentBuffs.push({
                    type: 'dice_max',
                    value: item.value
                });
                break;
        }
    }
};
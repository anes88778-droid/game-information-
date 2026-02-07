let gameState = {
    level: 1,
    monstersDefeated: 0,
    treeHP: 100,
    specialReady: true,
    playerX: 250
};

function showUI(id) {
    document.querySelectorAll('.overlay').forEach(el => el.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function startGame() {
    showUI('none');
    document.getElementById('game-screen').classList.remove('hidden');
    spawnEnemy();
    startCooldown();
}

// Controls
window.addEventListener('keydown', (e) => {
    const player = document.getElementById('player');
    if(e.key === 'ArrowRight') gameState.playerX += 20;
    if(e.key === 'ArrowLeft') gameState.playerX -= 20;
    if(e.key === 'ArrowUp' || e.code === 'Space') {
        player.style.bottom = '150px';
        setTimeout(() => player.style.bottom = '50px', 400);
    }
    if(e.key === 'ArrowDown') player.style.height = '60px';
    player.style.left = gameState.playerX + 'px';
});

window.addEventListener('keyup', (e) => {
    if(e.key === 'ArrowDown') document.getElementById('player').style.height = '100px';
});

// Combat
window.addEventListener('contextmenu', e => e.preventDefault()); // Disable right-click menu
window.addEventListener('mousedown', (e) => {
    if(e.button === 2) basicAttack();
    if(e.button === 0 && gameState.specialReady) specialAttack();
});

function spawnEnemy() {
    const enemy = document.getElementById('enemy');
    const isBoss = (gameState.monstersDefeated + 1) % 5 === 0;
    
    enemy.style.right = '-100px';
    enemy.style.background = isBoss ? 'purple' : 'darkgrey';
    enemy.dataset.hp = (100 * gameState.level) * (isBoss ? 2 : 1);
    
    // Enemy movement logic would go here
}

function specialAttack() {
    gameState.specialReady = false;
    const skillBtn = document.getElementById('special-skill');
    skillBtn.classList.remove('skill-ready');
    
    // Hit Logic
    console.log("Ultimate Pollution Purge!");
    
    setTimeout(() => {
        gameState.specialReady = true;
        skillBtn.classList.add('skill-ready');
    }, 10000); // 10s Cooldown
}

function updateTreeHP(damage) {
    gameState.treeHP -= damage;
    document.getElementById('tree-hp').innerText = gameState.treeHP;
    if(gameState.treeHP <= 0) showUI('game-over');
}
// إضافة نظام الجسيمات للتفتت
function createCrumbleEffect(x, y) {
    for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.style.cssText = `
            position: absolute; left: ${x}px; top: ${y}px;
            width: 10px; height: 10px; background: #555;
            border-radius: 50%; pointer-events: none;
            transition: all 1s ease-out;
        `;
        document.getElementById('game-screen').appendChild(p);
        
        setTimeout(() => {
            p.style.transform = `translate(${(Math.random()-0.5)*200}px, ${(Math.random()-0.5)*200}px)`;
            p.style.opacity = '0';
        }, 10);
        setTimeout(() => p.remove(), 1000);
    }
}

// تطوير وظيفة الضربة القاضية
function specialAttack() {
    if (!gameState.specialReady) return;
    
    gameState.specialReady = false;
    const skillBtn = document.getElementById('special-skill');
    skillBtn.style.background = 'transparent'; 
    skillBtn.style.boxShadow = 'none';

    // تأثير بصري على الشاشة
    const flash = document.createElement('div');
    flash.className = 'hit-flash';
    document.body.appendChild(flash);
    flash.style.opacity = '0.3';
    setTimeout(() => flash.remove(), 100);

    // تدمير الوحش الحالي فوراً
    const enemy = document.getElementById('enemy');
    const rect = enemy.getBoundingClientRect();
    
    if (gameState.monstersDefeated % 5 === 4) { // إذا كان وحشاً أسطورياً
        enemy.classList.add('disintegrate');
        createCrumbleEffect(rect.left, rect.top);
    }
    
    enemyDied(true); // استدعاء وظيفة الموت

    // إعادة التعبئة بعد 10 ثواني
    setTimeout(() => {
        gameState.specialReady = true;
        skillBtn.style.background = '#0096ff';
        skillBtn.style.boxShadow = '0 0 15px #0096ff';
        playSound('snd-ready'); // صوت تنبيه الجاهزية
    }, 10000);
}

// نظام المتجر (ترقية القوة)
function buyUpgrade(type) {
    if (gameState.gold >= 50) {
        gameState.gold -= 50;
        gameState.playerDamage += 10;
        updateHUD();
        playSound('snd-buy');
    } else {
        alert("Not enough gold! Protect the tree to earn more.");
    }
}

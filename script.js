document.addEventListener('DOMContentLoaded', () => {
    const TELEGRAM_WEB_APP = Telegram.WebApp;

    TELEGRAM_WEB_APP.ready();

    const user = TELEGRAM_WEB_APP.initDataUnsafe.user;

    console.log(`User ID: ${user.id}`);
    console.log(`Username: ${user.username}`);
    console.log(`First Name: ${user.first_name}`);
    console.log(`Last Name: ${user.last_name}`);

    let counter = 0;
    let pointsPerClick = 1;
    let upgradeCost = 10;
    let energyUpgradeCost = 500;
    let currentEnergy = 3000;
    let maxEnergy = 3000;
    const upgradeMultiplier = 1.75;
    const energyRechargeTime = 60 * 60 * 1000; // 1 hour in milliseconds
    const energyPerSecond = maxEnergy / (energyRechargeTime / 1000); // Energy restored per second

    const counterElement = document.getElementById('counter');
    const clickImage = document.getElementById('clickImage');
    const upgradeButton = document.getElementById('upgradeButton');
    const energyUpgradeButton = document.getElementById('energyUpgradeButton');
    const currentEnergyElement = document.getElementById('currentEnergy');
    const maxEnergyElement = document.getElementById('maxEnergy');
    const restoreTimeElement = document.getElementById('restoreTime');

    const updateDisplay = () => {
        counterElement.textContent = counter;
        currentEnergyElement.textContent = Math.floor(currentEnergy);
        maxEnergyElement.textContent = maxEnergy;
        upgradeButton.textContent = `Upgrade Points per Click (Cost: ${upgradeCost})`;
        energyUpgradeButton.textContent = `Upgrade Max Energy (Cost: ${energyUpgradeCost})`;

        const timeToFullEnergy = (maxEnergy - currentEnergy) / energyPerSecond;
        const hours = Math.floor(timeToFullEnergy / 3600);
        const minutes = Math.floor((timeToFullEnergy % 3600) / 60);
        const seconds = Math.floor(timeToFullEnergy % 60);
        restoreTimeElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const rechargeEnergy = () => {
        if (currentEnergy < maxEnergy) {
            currentEnergy += energyPerSecond;
            if (currentEnergy > maxEnergy) {
                currentEnergy = maxEnergy;
            }
        }
        updateDisplay();
    };

    const saveGame = () => {
        localStorage.setItem('counter', counter);
        localStorage.setItem('pointsPerClick', pointsPerClick);
        localStorage.setItem('upgradeCost', upgradeCost);
        localStorage.setItem('energyUpgradeCost', energyUpgradeCost);
        localStorage.setItem('currentEnergy', currentEnergy);
        localStorage.setItem('maxEnergy', maxEnergy);
        localStorage.setItem('lastUpdate', Date.now());
    };

    const loadGame = () => {
        counter = parseInt(localStorage.getItem('counter')) || 0;
        pointsPerClick = parseInt(localStorage.getItem('pointsPerClick')) || 1;
        upgradeCost = parseInt(localStorage.getItem('upgradeCost')) || 10;
        energyUpgradeCost = parseInt(localStorage.getItem('energyUpgradeCost')) || 500;
        currentEnergy = parseFloat(localStorage.getItem('currentEnergy')) || 3000;
        maxEnergy = parseInt(localStorage.getItem('maxEnergy')) || 3000;

        const lastUpdate = parseInt(localStorage.getItem('lastUpdate')) || Date.now();
        const timeSinceLastUpdate = Date.now() - lastUpdate;
        const energyGained = (timeSinceLastUpdate / 1000) * energyPerSecond;

        currentEnergy += energyGained;
        if (currentEnergy > maxEnergy) {
            currentEnergy = maxEnergy;
        }
        updateDisplay();
    };

    clickImage.addEventListener('click', () => {
        if (currentEnergy >= pointsPerClick) {
            counter += pointsPerClick;
            currentEnergy -= pointsPerClick;
            updateDisplay();
            saveGame();
        } else {
            alert('Not enough energy!');
        }
    });

    upgradeButton.addEventListener('click', () => {
        if (counter >= upgradeCost) {
            counter -= upgradeCost;
            pointsPerClick++;
            upgradeCost = Math.round(upgradeCost * upgradeMultiplier);
            updateDisplay();
            saveGame();
        } else {
            alert('Not enough points to upgrade!');
        }
    });

    energyUpgradeButton.addEventListener('click', () => {
        if (counter >= energyUpgradeCost) {
            counter -= energyUpgradeCost;
            maxEnergy = Math.round(maxEnergy * upgradeMultiplier);
            currentEnergy = maxEnergy;
            energyUpgradeCost = Math.round(energyUpgradeCost * upgradeMultiplier);
            updateDisplay();
            saveGame();
        } else {
            alert('Not enough points to upgrade max energy!');
        }
    });

    loadGame();
    updateDisplay();
    setInterval(rechargeEnergy, 1000);
});

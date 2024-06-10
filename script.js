document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
        return;
    }

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
        const data = { counter, pointsPerClick, upgradeCost, energyUpgradeCost, currentEnergy, maxEnergy };
        fetch('/saveUserData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, data })
        });
    };

    const loadGame = () => {
        fetch('/getUserData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        })
        .then(response => response.json())
        .then(data => {
            counter = data.counter;
            pointsPerClick = data.pointsPerClick;
            upgradeCost = data.upgradeCost;
            energyUpgradeCost = data.energyUpgradeCost;
            currentEnergy = data.currentEnergy;
            maxEnergy = data.maxEnergy;

            updateDisplay();
        });
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

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    render: render,
    update: update
});

const CardsOnReelCount = 10;

function preload() {
    game.load.image('button_start', 'button_start.png');
    game.load.image('button_stop', 'button_stop.png');
    for (let i = 1; i <= CardsOnReelCount; i++) {
        game.load.image('clover_' + i, 'pcp/Clover/card_' + i + '_clover.png');
    }
}
var startButton;
var stopButton;

var spinSpeed = 3;
var spinSpeedShift = 0.5;
var isSpinEnabled = false;

var spriteYGap = 20;
var spriteWidth = 62;
var spriteHeight = 84;

var maxReelY = (spriteHeight + spriteYGap) * (CardsOnReelCount - 1) + spriteYGap;
var minReelY = 10;

var winBox = {
    winBoxThickness: 5,
    winBoxMargin: 50,
};
var winCard = new Array(ReelCount);
var isReelStopped = new Array(ReelCount);

const bottomPanelY = 430;
const bottomPanelColor = 0x0080ff;
var bottomPanel;
var graphics;

const ReelCount = 3;
var reels = new Array(ReelCount);

function drawWinBox() { //Не нашёл адекватного способа нарисовать рамку, кроме как четырмя прямоугольниками
    graphics.beginFill(bottomPanelColor);
    graphics.drawRect(winBox.winBoxMargin, spriteYGap * 1.5 + spriteHeight, game.width - 2 * winBox.winBoxMargin, winBox.winBoxThickness);
    graphics.drawRect(winBox.winBoxMargin, spriteYGap * 2.5 + spriteHeight * 2, game.width - 2 * winBox.winBoxMargin, winBox.winBoxThickness);
    graphics.drawRect(game.width - winBox.winBoxThickness - winBox.winBoxMargin, spriteYGap * 1.5 + spriteHeight,
        winBox.winBoxThickness, spriteYGap + spriteHeight);
    graphics.drawRect(winBox.winBoxMargin, spriteYGap * 1.5 + spriteHeight, winBox.winBoxThickness, spriteYGap + spriteHeight);

    graphics.endFill();
}

function create() {
    game.stage.backgroundColor = '#182d3b';

    for (let reelNumber = 0; reelNumber < ReelCount; reelNumber++) {
        let reel = new Array(CardsOnReelCount);
        for (let j = 0; j < CardsOnReelCount; j++) {
            reel[j] = game.add.sprite(250 * reelNumber + 100, (spriteHeight + spriteYGap) * j + spriteYGap, 'clover_' + (j + 1), j);
            reels[reelNumber] = reel;
        }
        winCard[reelNumber] = -1;
        isReelStopped[reelNumber] = true;
    }

    graphics = game.add.graphics(0, 0);
    graphics.beginFill(bottomPanelColor);
    graphics.drawRect(0, bottomPanelY, game.width, game.height - bottomPanelY);
    graphics.endFill();

    drawWinBox();

    startButton = game.add.button(game.world.centerX - 200, 450, 'button_start', startAnimation, this, 0, 0, 0);
    stopButton = game.add.button(game.world.centerX + 100, 450, 'button_stop', stopAnimation, this, 0, 0, 0);
}

function render() {}

function update() {
    if (!isSpinEnabled) {
        return;
    }
    for (let i = 0; i < ReelCount; i++) {
        let reel = reels[i];
        for (let j = 0; j < CardsOnReelCount; j++) {
            if (reel[j].y >= maxReelY)
                reel[j].y = minReelY - spriteHeight;
            else
                reel[j].y += spinSpeed + spinSpeedShift * i;
        }
    }
}

function startAnimation() {
    isSpinEnabled = true;
}

function getRandomCard() {
    return Math.floor(Math.random() * CardsOnReelCount);
}

function stopAnimation() {
    isSpinEnabled = false;
    for (let i = 0; i < ReelCount; i++) {
        winCard[i] = getRandomCard();
        console.log(winCard[i]);
    }
}
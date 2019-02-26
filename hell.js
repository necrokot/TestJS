const ReelCount = 3;
var reels = new Array(ReelCount);

var baseSpinSpeed = 3;
var spinSpeedShift = 0.5;

var spriteYGap = 20;
var spriteWidth = 62;
var spriteHeight = 84;

const CardsOnReelCount = 10;
var maxReelY = (spriteHeight + spriteYGap) * (CardsOnReelCount - 1) + spriteYGap;
var minReelY = 10;

class Reel {
    constructor(spinSpeed, winPositionY) {
        this.cardList = new Array(CardsOnReelCount);
        this.spinSpeed = spinSpeed;
        this.winCard = -1;
        this.isRunning = false;
        this.winPositionY = winPositionY;
    }

    spinReel(pixels) {
        for (let i = 0; i < this.cardList.length; i++) {
            if (this.cardList[i].y >= maxReelY)
                this.cardList[i].y = minReelY - spriteHeight;
            else
                this.cardList[i].y += pixels;
        }
    }

    update() {
        if (this.isRunning) {
            if (this.winCard != -1) {
                let winDistance = this.cardList[this.winCard].y - this.winPositionY;
                if (winDistance >= 0 && winDistance < this.spinSpeed) {
                    this.spinReel(winDistance);
                    this.isRunning = false;
                    return
                }
            }
            this.spinReel(this.spinSpeed);
        }
    }

    start() {
        this.winCard = -1;
        this.isRunning = true;
    }

    stop() {
        this.winCard = getRandomCard();
    }

}

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    render: render,
    update: update
});


function preload() {
    game.load.image('button_start', 'button_start.png');
    game.load.image('button_stop', 'button_stop.png');
    for (let i = 1; i <= CardsOnReelCount; i++) {
        game.load.image('clover_' + i, 'pcp/Clover/card_' + i + '_clover.png');
    }
}

var graphics;
var startButton;
var stopButton;

var winBox = {
    thickness: 5,
    sideMargin: 50
};

const bottomPanelY = 430;
const bottomPanelColor = 0x0080ff;
var bottomPanel;

function drawWinBox() { //Не нашёл адекватного способа нарисовать рамку, кроме как четырмя прямоугольниками
    graphics.beginFill(bottomPanelColor);

    graphics.drawRect(winBox.sideMargin, spriteYGap * 1.5 + spriteHeight, game.width - 2 * winBox.sideMargin, winBox.thickness);
    graphics.drawRect(winBox.sideMargin, spriteYGap * 2.5 + spriteHeight * 2, game.width - 2 * winBox.sideMargin, winBox.thickness);
    graphics.drawRect(game.width - winBox.thickness - winBox.sideMargin, spriteYGap * 1.5 + spriteHeight,
        winBox.thickness, spriteYGap + spriteHeight);
    graphics.drawRect(winBox.sideMargin, spriteYGap * 1.5 + spriteHeight, winBox.thickness, spriteYGap + spriteHeight);

    graphics.endFill();
}

function create() {
    game.stage.backgroundColor = '#182d3b';

    for (let reelNumber = 0; reelNumber < ReelCount; reelNumber++) {
        let reel = new Reel(baseSpinSpeed + spinSpeedShift * (reelNumber + 1), spriteHeight + spriteYGap * 2);
        for (let cardCount = 0; cardCount < CardsOnReelCount; cardCount++) {
            reel.cardList[cardCount] = game.add.sprite(250 * reelNumber + 100, (spriteHeight + spriteYGap) * cardCount + spriteYGap, 'clover_' + (cardCount + 1), cardCount);
            reels[reelNumber] = reel;
        }
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
    for (let i = 0; i < ReelCount; i++) {
        reels[i].update();
    }
}

function startAnimation() {
    for (let i = 0; i < ReelCount; i++) {
        reels[i].start();
    }
}

function getRandomCard() {
    return Math.floor(Math.random() * CardsOnReelCount);
}

function stopAnimation() {
    for (let i = 0; i < ReelCount; i++) {
        reels[i].stop();
    }
}
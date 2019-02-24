var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    render: render,
    update: update
});

const SpriteOnReelCount = 10;

function preload() {
    game.load.image('button_start', 'button_start.png');
    game.load.image('button_stop', 'button_stop.png');
    for (let i = 1; i <= SpriteOnReelCount; i++) {
        game.load.image('clover_' + i, 'pcp/Clover/card_' + i + '_clover.png');
    }
}
var startButton;
var stopButton;

var maxReelY = 350;
var minReelY = 10;

var spinSpeed = 3;
var spinSpeedShift = 0.5;
var isSpinEnabled = false;

var spriteYGap = 20;
var spriteWidth = 62;
var spriteHeight = 84;

var maxReelY = (spriteHeight + spriteYGap) * SpriteOnReelCount;
var minReelY = 10;

const bottomPanelY = 420;
var bottomPanel;
var graphics;

const ReelCount = 3;
var reels = new Array(ReelCount);
var lastSpriteInReel = {
    left: SpriteOnReelCount,
    middle: SpriteOnReelCount,
    right: SpriteOnReelCount
};

function create() {
    game.stage.backgroundColor = '#182d3b';

    for (let reelNumber = 0; reelNumber < ReelCount; reelNumber++) {
        let reel = new Array(SpriteOnReelCount);
        for (let j = 0; j < SpriteOnReelCount; j++) {
            reel[j] = game.add.sprite(250 * reelNumber + 100, (spriteHeight + spriteYGap) * j + minReelY, 'clover_' + (j + 1), j);
            reels[reelNumber] = reel;
        }
    }

    graphics = game.add.graphics(0, 0);
    graphics.beginFill(0x022c1b);
    graphics.drawRect(0, bottomPanelY, game.width, game.height - bottomPanelY);
    graphics.endFill();

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
        for (let j = 0; j < SpriteOnReelCount; j++) {
            if (reel[j].y >= maxReelY)
                reel[j].y = minReelY;
            else
                reel[j].y += spinSpeed + spinSpeedShift * i;
        }
    }
}

function startAnimation() {
    isSpinEnabled = true;
}

function stopAnimation() {
    isSpinEnabled = false;
}
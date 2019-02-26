const ReelCount = 3; //Количество барабанов
var reels = new Array(ReelCount); //Массив барабанов

var baseSpinSpeed = 3; //Скорость вращения первого барабана
var spinSpeedShift = 0.5; //Приращение скорости вращения каждого последующего барабана

var cardWidth = 62; //Ширина карты
var CardHeight = 84; //Высота карты

var cardYGap = 20; //Расстояние между картами на барабане (по вертикали)
const CardsOnReelCount = 10; //Количество карт на барабане
//Фактически, барабан является длинной лентой, на которой через промежутки размером cardYGap расположены карты.
//Когда карта "доезжает" до конца ленты, её перекидывает наверх, выше видимой части.
var maxReelY = (CardHeight + cardYGap) * (CardsOnReelCount - 1) + 1.5 * cardYGap; //Длина ленты

class Reel { //Класс, описывающий один барабан
    constructor(spinSpeed, winPositionY, winSignal) {
        this.cardList = new Array(CardsOnReelCount); //Массив изображений(Image) карт
        this.spinSpeed = spinSpeed; //Шаг поворота данного барабана на вызов update(), в пикселях
        this.winCard = -1; //Номер карты, попавшей на выигрышную линию(в дальнейшем - выигрышная карта, для краткости)
        this.isRunning = false; //Флаг, показывающий, вращается ли в данный момент барабан
        this.winPositionY = winPositionY; //Координата по Y, которую должна иметь карта, что бы занять положение по центру рамки вокруг выигрышной линии
    }

    spinReel(pixels) { //Поворачивает барабан на указанное количество пикселей
        for (let i = 0; i < this.cardList.length; i++) {
            if (this.cardList[i].y >= maxReelY)
                this.cardList[i].y = cardYGap / 2 - CardHeight;
            else
                this.cardList[i].y += pixels;
        }
    }

    update() { //Отвкчает за обновление состояния барабана
        if (this.isRunning) {
            if (this.winCard != -1) {
                let winDistance = this.cardList[this.winCard].y - this.winPositionY;
                //Если выставлен номер выигрышной карты и расстояние от неё до нужной позиции на экране меньше шага поворота,
                //довернём барабан на соответствующее число пикселей.
                if (winDistance >= 0 && winDistance < this.spinSpeed) {
                    this.spinReel(winDistance);
                    this.isRunning = false;
                    return
                }
            }
            this.spinReel(this.spinSpeed);
        }
    }

    start() { //Запускает вращение барабанов
        this.winCard = -1; //Сбрасываем номер выигрышной карты, на случай если это не первый запуск
        this.isRunning = true;
    }

    stop() { //Выставляет номер выигрышной карт
        this.winCard = getRandomCard();
    }

}

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
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

var winBox = { //Параметры рамки вокруг выигрышной линии
    thickness: 5, //Толщина рамки
    sideMargin: 50, //Отступ от краёв экрана
    color: 0x0080ff //Цвет рамки
};

var bottomPanel = { //Параметры нижней панели
    y: 430, //Высота нижней панели
    color: 0x0080ff //Цвет нижней панели
};

function drawWinBox() { //Отрисовка рамки вокруг выигрышной линии
    //Не нашёл адекватного способа нарисовать рамку, кроме как четырмя прямоугольниками
    graphics.beginFill(winBox.color);

    graphics.drawRect(winBox.sideMargin, cardYGap * 1.5 + CardHeight, game.width - 2 * winBox.sideMargin, winBox.thickness);
    graphics.drawRect(winBox.sideMargin, cardYGap * 2.5 + CardHeight * 2, game.width - 2 * winBox.sideMargin, winBox.thickness);
    graphics.drawRect(game.width - winBox.thickness - winBox.sideMargin, cardYGap * 1.5 + CardHeight,
        winBox.thickness, cardYGap + CardHeight);
    graphics.drawRect(winBox.sideMargin, cardYGap * 1.5 + CardHeight, winBox.thickness, cardYGap + CardHeight);

    graphics.endFill();
}

function drawBottonPanel() { //Отрисовка нижней панели
    graphics.beginFill(bottomPanel.color);
    graphics.drawRect(0, bottomPanel.y, game.width, game.height - bottomPanel.y);
    graphics.endFill();
}

function create() {
    game.stage.backgroundColor = '#182d3b';

    for (let reelNumber = 0; reelNumber < ReelCount; reelNumber++) { //Создаём ReelCount барабанов
        let reel = new Reel(baseSpinSpeed + spinSpeedShift * (reelNumber + 1), CardHeight + cardYGap * 2);
        for (let cardCount = 0; cardCount < CardsOnReelCount; cardCount++) { //Создаём изображения карт на барабане
            reel.cardList[cardCount] = game.add.sprite(250 * reelNumber + 100, (CardHeight + cardYGap) * cardCount + cardYGap, 'clover_' + (cardCount + 1), cardCount);
            reels[reelNumber] = reel;
        }
    }

    graphics = game.add.graphics(0, 0);

    drawBottonPanel();
    drawWinBox();

    startButton = game.add.button(game.world.centerX - 200, 450, 'button_start', startAnimation, this, 0, 0, 0);
    stopButton = game.add.button(game.world.centerX + 100, 450, 'button_stop', stopAnimation, this, 0, 0, 0);
}

function update() {
    for (let i = 0; i < ReelCount; i++) {
        reels[i].update();
    }
}

function startAnimation() { //Запускает вращение всех барабанов
    for (let i = 0; i < ReelCount; i++) {
        reels[i].start();
    }
}

function getRandomCard() { //Выдаёт случайное целое число в диапазоне от 0 до CardsOnReelCount
    return Math.floor(Math.random() * CardsOnReelCount);
}

function stopAnimation() { //Останавливает вращение всех барабанов
    for (let i = 0; i < ReelCount; i++) {
        reels[i].stop();
    }
}
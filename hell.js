var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});

var barrel_left;

function preload() {
    game.load.spritesheet('reel', 'animation/explosion-2.png', 64, 64, 8);
    game.load.image('button_start', 'button_start.png')
    game.load.image('button_stop', 'button_stop.png')
}
var start_button;
var stop_button;

var left_reel;
var left_reel_anim;
var middle_reel;
var middle_reel_anim;
var right_reel;
var right_reel_anim;

function create() {
    game.stage.backgroundColor = '#182d3b';

    left_reel = game.add.image(100, 100, 'reel', 1);
    left_reel_anim = left_reel.animations.add('span');

    middle_reel = game.add.image(200, 100, 'reel', 1);
    middle_reel_anim = middle_reel.animations.add('span');

    right_reel = game.add.image(300, 100, 'reel', 1);
    right_reel_anim = right_reel.animations.add('span');

    start_button = game.add.button(game.world.centerX - 200, 400, 'button_start', startAnimation, this, 0, 0, 0)
    stop_button = game.add.button(game.world.centerX + 100, 400, 'button_stop', stopAnimation, this, 0, 0, 0)
}

function update() {

}

function startAnimation() {
    left_reel_anim.play(10, true);
    middle_reel_anim.play(20, true);
    right_reel_anim.play(100, true);
}

function stopAnimation() {
    left_reel_anim.stop()
    middle_reel_anim.stop()
    right_reel_anim.stop()
}
import * as _ from "lodash";
import Phaser = require('phaser');

class Game {
    player;

    constructor() {
        this.player = null;
    }

    preload(phaser) {
        phaser.load.image('sky', 'assets/sky.png');
        phaser.load.image('ground', 'assets/platform.png');
        phaser.load.image('star', 'assets/star.png');
        phaser.load.image('bomb', 'assets/bomb.png');
        phaser.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create(phaser) {
        phaser.add.image(400, 300, 'sky');

        let platforms = phaser.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        this.player = phaser.physics.add.sprite(100, 450, 'dude');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        phaser.anims.create({
            key: 'left',
            frames: phaser.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        phaser.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        phaser.anims.create({
            key: 'right',
            frames: phaser.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        phaser.physics.add.collider(this.player, platforms);
    }

    update(phaser) {
        let cursors = phaser.input.keyboard.createCursorKeys();

        if (cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }
}


let game = new Game();


function preload() {
    game.preload(this);
}

function create() {
    game.create(this);
}

function update() {
    game.update(this);
}

let config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let phaser = new Phaser.Game(config);

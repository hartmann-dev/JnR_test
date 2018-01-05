
var MyGameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function MyGameScene() {
        Phaser.Scene.call(this, {key: 'my-game-scene'});
    },

    preload: function () {
        //this.load.image('ground', 'assets/ground.png');
        //this.load.image('char', 'assets/char_standing.png');
        this.load.image('plattform_left', 'assets/plattform_left.png');
        this.load.image('plattform_middle', 'assets/plattform_middle.png');
        this.load.image('plattform_right', 'assets/plattform_right.png');
        this.load.image('enemy_1', 'assets/enemy_1.png');
        this.load.image('enemy_2', 'assets/enemy_2.png');

        this.load.image('bg', 'assets/bg.png');

        this.load.spritesheet('char', 'assets/char.png', { frameWidth: 89, frameHeight: 129, endFrame: 5});


    },

    create: function () {
        //Hintergrund
        this.add.image(0,0, 'bg').setPosition(400,300)
        this.fpsText = this.add.text(0, 0, 'FPS: ' + parseInt(game.loop.actualFps)).setColor("0x000000");
        this.playerConf = {
            'runSpeed': 300,
            'jumpSpeed': 400
        }
        this.isJumping = false;

        var that = this;
        var gameHeight = game.config.height;
        var gameWidth = game.config.width;

        var levelMap =[{
            x: 0,
            y: gameHeight,
            image: 'plattform_left'
        }, {
            gapX: 120,
            y: gameHeight - 80,
            image: 'plattform_middle'
        }, {
            gapX: 180,
            y: gameHeight,
            image: 'plattform_right'
        }];



        var sibl = {
            x: 0, y: 0, height: 0, width: 0
        };

        var images = [];

        levelMap.forEach(function (ele) {

            var x = ele.x = ele.gapX ? sibl.width + sibl.x + ele.gapX : ele.x;
            var y = ele.y = ele.gapY ? sibl.height + sibl.y + ele.gapY : ele.y;

            var image = that.physics.add.staticImage(x  , y, ele.image);
            image.x += image.width / 2;
            image.body.x += image.width / 2;

            image.y -= image.height / 2;
            image.body.y -= ( image.height / 2 ) - 15 ;

            images.push(image);

            sibl = {
                x: x, y: y, height: image.height, width: image.width
            };;



        });
        this.lizard = this.physics.add.staticImage(590, 550, 'enemy_1').setOrigin(0.5,0.5).setSize(50,150,false);
        this.lizard.upOrDown = 'down';
        //enemies.push(this.physics.add.staticImage(780, 400, 'enemy_2').setOrigin(0.5,0.5));

        //this.player = this.physics.add.image(100, 100, 'char').setOrigin(0,0);
        //this.player.body.setSize(50,120);



        var playerAnimation = this.anims.create({
            key: 'char',
            frames: this.anims.generateFrameNumbers('char', {
                start: 0,
                end: 4
            }),
            repeat: -1,
            frameRate: 8
        });


        this.player = this.physics.add.sprite(100, 100, 'char').play('char');
        this.player.setOrigin(0.5, 0.5).body.setSize(50,120);
        //this.player.anims.play('char');
        this.player.myAnimations = {};
        this.player.myAnimations.walk = playerAnimation;


        this.physics.add.collider(this.player, images);
        this.physics.add.collider(this.player, this.lizard);

        this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyLeftt = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);


    },
    update: function(){
        this.fpsText.setText('FPS: ' + parseInt(game.loop.actualFps));


        if(!this.player.active){
            return false;
        }


        if(this.player.y > game.config.height - this.player.height + 100){
            this.player.destroy();
            this.add.text(100, 100, 'Verloren!').setColor("0x000000");;
            return;
        }

        if(this.player.x > game.config.width){
            this.player.destroy();
            this.add.text(100, 100, 'Gewonnen!').setColor("0x000000");;
            return;
        }



        if('down' == this.lizard.upOrDown){
            if(this.lizard.y < 700){
                this.lizard.y += 2;
                this.lizard.body.y += 2;
            } else {
                this.lizard.upOrDown = 'up'
            }
        } else if('up' == this.lizard.upOrDown){
            if(this.lizard.y >= 550){
                this.lizard.y -= 2;
                this.lizard.body.y -= 2;
            } else {
                this.lizard.upOrDown = 'down'
            }
        }

        if (this.player.body.touching.down  && this.keyUp.isDown)
        {
            this.player.body.velocity.y = -this.playerConf.jumpSpeed;
        }
        else if (this.keyDown.isDown)
        {
           //
        }
        else if (this.keyLeftt.isDown)
        {

            if(this.player.myAnimations.walk.paused){
                this.player.myAnimations.walk.resume(this.player.myAnimations.walk.getFrameAt(0));
            }
            this.player.body.velocity.x = -this.playerConf.runSpeed;
            if(this.player.scaleX > 0){
                this.player.scaleX  = -1;
                this.player.body.setOffset(-23,0)
            }
        }
        else if (this.keyRight.isDown)
        {

            if(this.player.myAnimations.walk.paused){
                this.player.myAnimations.walk.resume(this.player.myAnimations.walk.getFrameAt(0));
            }
            this.player.body.velocity.x = this.playerConf.runSpeed;
            if(this.player.scaleX < 0){
                this.player.scaleX  = 1;
                this.player.body.setOffset(15, 0)
            }
        }
        else
        {

            if(!this.player.myAnimations.walk.paused){
                this.player.myAnimations.walk.pause(this.player.myAnimations.walk.getFrameAt(0));
            }
            this.player.body.velocity.x = 0;

        }


    }

});

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    pixelArt: true,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 800
            }
        }
    },
    backgroundColor: '#fff',
    scene: [MyGameScene]
};

var game = new Phaser.Game(config);
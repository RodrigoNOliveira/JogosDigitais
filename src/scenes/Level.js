import { Math, Scene } from "phaser";
import Carrot from "../objects/Carrots";

export default class Level extends Scene{

    /** @type {Phaser.Physics.Arcade.Sprite} */
    player;

     /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms;


    /**@type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors


    /**@type {Phaser.Physics.Arcade.Group} */
    carrots;


    constructor(){
        super('level');
    }

    preload(){
        this.load.image('background', 'assets/bg_layer1.png');
        this.load.image('platform', 'assets/ground_grass.png');
        this.load.image('bunny-stand', 'assets/bunny1_stand.png');
        this.load.image('carrot', 'assets/carrot.png');
        this.load.audio('jump', 'assets/sfx/jump.ogg');
    }

    create(){
        //BACKGROUND
        this.add.image(240 ,320, 'background').setScrollFactor(0,0);
        

        //platform
        ///const platform = this.physics.add.staticImage(240 ,320, 'platform')
            //.setScale(0.5);

            //platform.body.updateFromGameObject(); //atualiza o tamanho do corpo para a nova escala


        //GRUPO DE PLATAFORMAS

        this.platforms = this.physics.add.staticGroup();

        for (let i = 0; i <5; i++){
            const x = Math.Between(80,400);
            const y = 150 * i;

            const platform = this.platforms.create(x,y, 'platform');
            platform.setScale(0.5);
            platform.body.updateFromGameObject();
        }


        //CRIANDO O PLAYER

        this.player = this.physics.add.image(240 ,120, 'bunny-stand')
            .setScale(0.5);

        //FAZ OS ELEMENTOS COLIDIREM
        this.physics.add.collider(this.player, this.platforms);
    
        //DESABILITAR A COLISÃO DO COELHO NAS LATERAIS E EM CIMA
        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;


        //CÂMERA
        this.cameras.main.startFollow(this.player);


        //DEFINIR A DEAD ZONE PARA A CAMERA
        this.cameras.main.setDeadzone(this.scale.width *1.5)



        //CURSORES  
        this.cursors = this.input.keyboard.createCursorKeys();

        //CENOURAS
        this.carrots = this.physics.add.group({
            classType: Carrot
        });
        this.physics.add.collider(this.carrots, this.platforms);
        this.physics.add.overlap(this.player, this.carrots, this.handleCollectCarrot, undefined, this);


        

    }


    update(time ,delta){
        //PULANDO
        const touchingGround = this.player.body.touching.down;
       
        if ( touchingGround){
            this.player.setVelocityY(-300);
            this.sound.play('jump');
        }



        //REUSANDO AS PLATAFORMAS
        this.platforms.children.iterate(child =>{
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child;


            //PEGAR A POSIÇÃO Y DA CAMERA
            const scrollY = this.cameras.main.scrollY;
            if (platform.y >= scrollY + 650){
                platform.x = Math.Between(80,400);
                platform.y = scrollY - Math.Between(0,10);
                platform.body.updateFromGameObject();


                //criar uma cenoura
                this.addCarrotAbove(platform);

            }

        })



        //CURSORES DIREITA E ESQUERDA
        if (this.cursors.left.isDown){
            this.player.setVelocityX(-200);

        } else if (this.cursors.right.isDown){
            this.player.setVelocityX(200);
        } else{
            this.player.setVelocityX(0);
        }

    }



    addCarrotAbove(platform){
        const y = platform.y - platform.displayHeight;


        const carrot = this.carrots.get(platform.x, y, 'carrot');

        carrot.setActive(true);
        carrot.setVisible(true);

        this.add.existing(carrot);
        carrot.body.setSize(carrot.width, carrot.height);
        this.physics.world.enable(carrot);
    }

    handleCollectCarrot(player, carrot){
        this.carrots.killAndHide(carrot);
        this.physics.world.disableBody(carrot.body);
    }

}
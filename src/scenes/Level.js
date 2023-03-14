import { Scene } from "phaser";

export default class Level extends Scene{


    constructor(){
        super('level');
    }

    preload(){
        this.load.image('background', 'assets/bg_layer1.png');
        this.load.image('platform', 'assets/ground_grass.png');
        this.load.image('bunny-stand', 'assets/bunny1_stand.png');
    }

    create(){
        //background
        this.add.image(240 ,320, 'background');
        

        //platform
        const platform = this.physics.add.staticImage(240 ,320, 'platform')
            .setScale(0.5);

            platform.body.updateFromGameObject(); //atualiza o tamanho do corpo para a nova escala

        //player
        const player = this.physics.add.image(240 ,120, 'bunny-stand')
            .setScale(0.5);

        this.physics.add.collider(player, platform);
    
    }


    update(time ,delta){
        
    }


}
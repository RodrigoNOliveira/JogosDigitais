import { AUTO, Game } from "phaser";
import Level from "./src/scenes/Level";
import Primeira from "./src/scenes/Primeira";

const config = {
  width: 480,   // largura
  height: 640,  //altura
  type: AUTO,   //tipo de renderização
  scene: [Level],
  physics: {
    default: 'arcade',
    arcade:{
      gravity: {
        y: 200
      },
      debug: true
    }
  }
}


new Game(config);

 //Variáveis para ajuste de tela
 var larguraJogo = window.innerWidth;
 var alturaJogo = window.innerHeight;


const config = {
    type: Phaser.AUTO,
    width: larguraJogo,
    height: alturaJogo,
    physics:{
        default: 'arcade',
        arcade:{
            debug: false
        }
    },
    scene: [Cena01, Menu]
};

const game = new Phaser.Game(config);
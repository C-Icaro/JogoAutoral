

class Menu extends Phaser.Scene{
    constructor(){
        super({key: 'Menu'});
        
    }

    preload(){
        //Preload das imagens:
        this.load.image("backgroundMenu", "assets/Background/Battleground2-Pale.png");
        this.load.image("logo", "assets/logo.png");
        this.load.image("jogar", "assets/jogar.png");
    }
    create(){
    //Adicionando as imagens no jogo de forma centralizada ou ajustada.
    this.add.image(larguraJogo*0.5, alturaJogo*0.5, 'backgroundMenu').setDisplaySize(larguraJogo, alturaJogo);
    this.logo = this.add.image(larguraJogo*0.5, alturaJogo*0.5-150, 'logo').setScale(0.6);
    this.botaoJogar = this.add.sprite(larguraJogo*0.5, alturaJogo*0.5+50, 'jogar').setScale(0.4).setInteractive();;

    this.tweens.add({
        targets: this.botaoJogar,//Objeto sendo animado
        scale: 0.45,//Escala máxima atingida pela animação yoyo
        duration: 800,//Tempo que durará a animação
        ease: 'Sine.easeInOut',//Cria suavização do movimento em senoide
        yoyo: true,//Animação de efeito visual para chamar a atenção do usuário
        repeat: -1//Repetições que serão feitaas (infinitas nesse caso)
    });
    
    this.tweens.add({
        targets: this.logo,
        scale: 0.65,
        duration: 800,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });

    // Verifique se o botão realmente existe antes de adicionar o evento
    if (this.botaoJogar) {
        this.botaoJogar.on('pointerover', () => {//Caso o mouse esteja acima do botão
            this.botaoJogar.setScale(1.2);  // Cresce ao passar o mouse
        });

        this.botaoJogar.on('pointerout', () => {//Caso o mouse esteja fora do botão
            this.tweens.add({
                targets: this.botaoJogar,
                scale: 0.5,
                duration: 800,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        });

        this.botaoJogar.on('pointerdown', () => {//Caso o mouse faça um clique do botão
            this.scene.stop('Menu');//Comando para parar a cena
            this.scene.start('Cena01');//Inicia a cena principal do jogo
        })
    }

    }

    update(){

     
        
    }
}
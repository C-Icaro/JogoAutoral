class Cena01 extends Phaser.Scene{
    constructor(){
        super({key: 'Cena01'});}
             
    
    preload(){
        this.load.image('backgroundCena01', 'assets/Background/Battleground2/Bright/Battleground2.png');
    }
    
    create(){
        this.add.image(larguraJogo*0.5, alturaJogo*0.5, 'backgroundCena01').setDisplaySize(larguraJogo, alturaJogo);
    }  
        
}

var primeiroContato = true;
var inimigos = true;
var golensAbatidos = 0;
var placar;

class Cena01 extends Phaser.Scene{
    constructor(){
        super({key: 'Cena01'});
    }
             
    preload(){
        // Carrega as imagens e spritesheets necessárias para a cena
        this.load.image('backgroundCena01', 'assets/Background/Battleground2/Bright/Battleground2.png');
        this.load.image('floorCena01', 'assets/Background/Battleground2/Bright/floor.png');
        this.load.spritesheet('teclaE', 'assets/teclaE.png', { frameWidth: 450, frameHeight: 450 });
        this.load.spritesheet("player", "assets/player02Sheet.png", { frameWidth: 900, frameHeight: 900 });
        this.load.spritesheet("golem", "assets/golem01Sheet.png", { frameWidth: 720, frameHeight: 480 });
    }
    
    create(){

        // Configura as teclas de entrada
        this.keys = this.input.keyboard.addKeys({
            interaction: Phaser.Input.Keyboard.KeyCodes.E,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Adiciona o chão como um objeto estático para colisão
        this.floorCena01 = this.physics.add.staticImage(larguraJogo*0.5, alturaJogo, 'floorCena01').setDisplaySize(larguraJogo, alturaJogo);
        
        // Adiciona o fundo da cena
        this.add.image(larguraJogo*0.5, alturaJogo*0.5, 'backgroundCena01').setDisplaySize(larguraJogo, alturaJogo);
        
        //Adicionando zona e interação com o dragão:
        this.dragao = this.add.zone(larguraJogo * 0.5, alturaJogo * 0.3, 320, 350).setOrigin(0.5, 0.5);
        this.physics.world.enable(this.dragao);
    
        // Adiciona um gráfico para tornar a zona visível
        const graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xff0000 } });
        
        // Adiciona o jogador e configura a gravidade
        this.player = this.physics.add.sprite(100, this.floorCena01.y-265, "player").setScale(0.3);
        this.player.body.setGravityY(1500);

        
        // Adiciona colisão entre o jogador e o chão
        this.physics.add.collider(this.player, this.floorCena01);

        //Adicioona sprite da tecla E
        this.teclaE = this.add.sprite(larguraJogo*0.5, alturaJogo*0.1, 'teclaE').setDisplaySize(100, 100);
        this.teclaE.setAlpha(0);

        // Cria as animações do jogador
        this.anims.create({
            key: "idle",
            frameRate: 18,
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 17 }),
            repeat: -1
        });
        this.anims.create({
            key: "walking",
            frameRate: 12,
            frames: this.anims.generateFrameNumbers("player", { start: 20, end: 31 }),
            repeat: -1
        });
        this.anims.create({
            key: "attack",
            frameRate: 12,
            frames: this.anims.generateFrameNumbers("player", { start: 39, end: 46 }),
            repeat: 1
        });
        this.anims.create({
            key: "attack-run",
            frameRate: 12,
            frames: this.anims.generateFrameNumbers("player", { start: 50, end: 61 }),
            repeat: 1
        });
        this.anims.create({
            key: "dying",
            frameRate: 13,
            frames: this.anims.generateFrameNumbers("player", { start: 65, end: 77 }),
            repeat: 1
        });

        //Cria animações do golem
        this.anims.create({
            key: "golem-walking",
            frameRate: 18,
            frames: this.anims.generateFrameNumbers("golem", {start: 0, end: 17}),
            repeat: -1
        });
        this.anims.create({
            key: "golem-attack",
            frameRate: 12,
            frames: this.anims.generateFrameNumbers("golem", {start: 20, end: 31}),
            repeat: -1
        });
        this.anims.create({
            key: "golem-dying",
            frameRate: 12,
            frames: this.anims.generateFrameNumbers("golem", {start: 35, end: 46}),
            repeat: 1
        });

        //Cria animações das teclas
        this.anims.create({
            key: "teclaE",
            frameRate: 6,
            frames: this.anims.generateFrameNumbers("teclaE", {start: 0, end: 5}),
            repeat: -1  
        })

        //Adiciona tecla E com animação
        if(primeiroContato === true){
            this.teclaE.setAlpha(100);
            this.teclaE.play('teclaE', true);}

        //Adiciona overlap do player com o dragão (interação)
        this.physics.add.overlap(this.player, this.dragao, () => {

            if(this.keys.interaction.isDown){
                console.log("interação com o dragão");
                this.chat();
            }

        })

        this.textbox = this.add.graphics().fillStyle(0xA9A9A9, 0.75).fillRect(larguraJogo*0.1, alturaJogo*0.1, 450, 150);//Cria retangulo para texto
        this.textbox.setAlpha(0);//Deixa o retangulo invisível

        this.box = this.add.graphics().fillStyle(0xA9A9A9, 0.9).fillRect(larguraJogo*0.5 - 115, alturaJogo*0.1 - 8, 180, 40);
        placar = this.add.text(larguraJogo*0.5 - 100, alturaJogo*0.1, 'Golens abatidos: ' + golensAbatidos, {font: "20px Blackletter", fill: "#000000", align: "left", fontWeight: "black" });

        this.box.setAlpha(0);
        placar.setAlpha(0);
        
       
    }  

    update(){
      

        // Verifica se a tecla esquerda está pressionada
        if (this.keys.left.isDown) {
            this.player.setFlipX(true); // Vira o jogador para a esquerda
            if (this.keys.shift.isDown) {
                this.player.setVelocityX(-300); // Aumenta a velocidade ao correr
                if (this.keys.interaction.isDown && primeiroContato === false) {
                    this.player.play("attack-run", true); // Executa a animação de ataque correndo
                } else {
                    this.player.play("walking", true); // Executa a animação de caminhada
                }
            } else {
                this.player.setVelocityX(-160); // Velocidade normal ao andar
                this.player.play("walking", true); // Executa a animação de caminhada
            }
        } else if (this.keys.right.isDown) {
            this.player.setFlipX(false); // Vira o jogador para a direita
            if (this.keys.shift.isDown) {
                this.player.setVelocityX(300); // Aumenta a velocidade ao correr
                if (this.keys.interaction.isDown && primeiroContato === false) {
                    this.player.play("attack-run", true); // Executa a animação de ataque correndo
                } else {
                    this.player.play("walking", true); // Executa a animação de caminhada
                }
            } else {
                this.player.setVelocityX(160); // Velocidade normal ao andar
                this.player.play("walking", true); // Executa a animação de caminhada
            }
        } else {
            this.player.setVelocityX(0); // Para o jogador quando nenhuma tecla de movimento está pressionada
            if (this.keys.interaction.isDown && primeiroContato === false) {
                this.player.play("attack", true); // Executa a animação de ataque
            } else {
                this.player.play("idle", true); // Executa a animação de idle
            }
        }

        // Mecânica de pulo
        if (this.keys.space.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-500); // Faz o jogador pular
        }

        if(inimigos === true){   
            this.inimigos();}

    }

   

    chat(){
        primeiroContato = false;//Mudando o estado da variável primeiro contato
        this.dragao.destroy();//Destruindo a zona do dragão
        // Adiciona um texto na tela
        this.teclaE.setAlpha(0);
        this.teclaE.stop('teclaE');

        this.textbox.setAlpha(100);        

        let messages = [
            "Olá, aventureiro! \nEu sou o dragão guardião deste castelo.",
            "Estou em busca de um herói que possa me ajudar \na derrotar o golem que está aterrorizando a cidade.",
            "Você pode me ajudar?",
            "Rápido, eles estão chegando!", ""]

        this.instrução = this.add.text(this.textbox.x + 370, alturaJogo*0.1 + 120, "Clique 'E' para continuar", { font: "15px Blackletter", fill: "#000000", align: "center", fontWeight: "bold" }).setOrigin(0.5, 0.5);

        let linha = [];
    
        for(let i = 0; i < messages.length; i++){
            linha[i] = this.add.text(this.textbox.x + 370, alturaJogo*0.1 + 50, messages[i], { font: "20px Blackletter", fill: "#000000", align: "left", fontWeight: "black" }).setOrigin(0.5, 0.5);
            linha[i].setAlpha(0);
            
        }

        let currentLine = 0;

        // Função para mostrar a próxima linha
        const showNextLine = () => {
            if (currentLine > 0) {
                linha[currentLine - 1].destroy(); // Exclui a mensagem anterior
            }
            if (currentLine < messages.length) {
                linha[currentLine].setAlpha(1);
                currentLine++;
            }
            if(currentLine >= messages.length){
                this.instrução.destroy();
                this.textbox.destroy();
                this.box.setAlpha(100);
                placar.setAlpha(100);
                inimigos = true;
            }

        };
    
        // Mostra a primeira linha
        showNextLine();
    
        // Adiciona um evento de tecla para avançar para a próxima linha
        this.input.keyboard.on('keydown-E', showNextLine);

        return 0;
    } 
   
    inimigos(){
         /*
        let playerAtack = false;
        let golemAtack = false;
        let golemLife = 3;

        console.log("Função inimigos");
        this.golem = this.physics.add.sprite(larguraJogo*0.8, this.floorCena01.y-265, "golem").setScale(0.5).setFlipX(true);
        inimigos = false;

        

        do{
            setTimeout(() => {
                this.golem.setVelocityX(-50);
                this.golem.play("golem-walking", true);
                this.physics.add.overlap(this.player, this.golem, () => {
                    this.golem.play("golem-attack", true);
                    this.golemAtack = true;
                });
            }, 3000);
        }
        while(golemLife =! 0);

        this.physics.add.collider(this.golem, this.floorCena01);
        this.physics.add.collider(this.player, this.golem, () => {
            if(this.player.body.touching.right){
                this.player.setVelocityX(-100);
            }
            if(this.player.body.touching.left){
                this.player.setVelocityX(100);
            }
        });
 */
    }
   


}

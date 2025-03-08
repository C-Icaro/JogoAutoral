var primeiroContato = true;//Naturalmente true
var golensAbatidos = 0;//Contagem de inimigos 
var placar;//Guarda a quandidade de inimigos abatidos
var placarVidaGolem;//Guarda a quantidade de vida dos golens
var placarVidaPlayer;//Guarda a quantidade de vida do player


class Cena01 extends Phaser.Scene{
    constructor(){
        super({key: 'Cena01'});
        this.golemLife = 3;//Inicia a cena com as informações de vida 
        this.playerLife = 3;
        this.golemCreated = false; // Variável de controle para criação do golem
    
    }
             
    preload(){
        // Carrega as imagens e spritesheets necessárias para a cena
        this.load.image('backgroundCena01', 'assets/Background/Battleground2.png');
        this.load.image('floorCena01', 'assets/Background/floor.png');
        this.load.spritesheet('teclaE', 'assets/teclaE.png', { frameWidth: 450, frameHeight: 450 });
        this.load.spritesheet("player", "assets/player02Sheet.png", { frameWidth: 900, frameHeight: 900 });
        this.load.spritesheet("golem", "assets/golem01Sheet.png", { frameWidth: 720, frameHeight: 480 });
        this.load.image("teclas", "assets/teclas.png");

        this.add.text(larguraJogo*0.5, alturaJogo * 0.5, "Carregando...", {
            font: "20px Blackletter", fill: "#ffffff", align: "left", fontWeight: "black"//Configurações de texto
        }).setOrigin(0.5, 0.5);
    }
    
    create(){

        // Configura as teclas de entrada
        this.keys = this.input.keyboard.addKeys({
            interaction: Phaser.Input.Keyboard.KeyCodes.E,
            up: Phaser.Input.Keyboard.KeyCodes.W,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Adiciona o chão como um objeto estático para colisão
        this.floorCena01 = this.physics.add.staticImage(larguraJogo*0.5, alturaJogo, 'floorCena01').setDisplaySize(larguraJogo, alturaJogo);
        
        // Adiciona o fundo da cena
        this.add.image(larguraJogo*0.5, alturaJogo*0.5, 'backgroundCena01').setDisplaySize(larguraJogo, alturaJogo);

        //Adiciona imagem de instruções de jogo
        this.teclas = this.add.image(larguraJogo*0.2, alturaJogo*0.3, 'teclas').setScale(0.25).setInteractive();
            this.tweens.add({//Adiciona animação de yoyo (explicada em Menu)
            targets: this.teclas,
            scale: 0.28,
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        //Adicionando zona invisível e interação com o dragão:
        this.dragao = this.add.zone(larguraJogo * 0.5, alturaJogo * 0.3, 320, 500).setOrigin(0.5, 0.5);
        this.physics.world.enable(this.dragao);
    
        // Adiciona um gráfico para tornar a zona visível
        const graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xff0000 } });
        
        // Adiciona o jogador e configura a gravidade
        this.player = this.physics.add.sprite(100, this.floorCena01.y-265, "player").setScale(0.35).setSize(430, 600);
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
        this.anims.create({
            key: "golem-idle",
            frameRate: 12,
            frames: this.anims.generateFrameNumbers("golem", {start: 50, end: 61}),
            repeat: -1
        });

        //Cria animações da tecla E
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

            if(this.keys.interaction.isDown && primeiroContato === true){
                console.log("interação com o dragão");
                this.chat();
            }

        })

        this.textbox = this.add.graphics().fillStyle(0xA9A9A9, 0.75).fillRect(larguraJogo*0.1, alturaJogo*0.1, 450, 150);//Cria retangulo para texto
        this.textbox.setAlpha(0);//Deixa o retangulo invisível

        this.placarBox = this.add.graphics().fillStyle(0xA9A9A9, 0.9).fillRect(larguraJogo*0.5 - 115, alturaJogo*0.1 - 8, 180, 90);//Adicionando retangulo cinza
        //Adicionando placares no retangulo
        placar = this.add.text(larguraJogo*0.5 - 100, alturaJogo*0.1, 'Golens abatidos: ' + golensAbatidos, {font: "20px Blackletter", fill: "#000000", align: "left", fontWeight: "black" });
        placarVidaPlayer = this.add.text(larguraJogo*0.5 - 100, alturaJogo*0.1 + 25, 'Vida player: ' + this.playerLife, {font: "20px Blackletter", fill: "#000000", align: "left", fontWeight: "black" });
        placarVidaGolem = this.add.text(larguraJogo*0.5 - 100, alturaJogo*0.1 + 50, 'Vida golem: ' + this.golemLife , {font: "20px Blackletter", fill: "#000000", align: "left", fontWeight: "black" });

        //Escondendo os placares e retangulo
        this.placarBox.setAlpha(0);
        placar.setAlpha(0);
        placarVidaPlayer.setAlpha(0);
        placarVidaGolem.setAlpha(0);
        
       
    }  

    update(){
      

        // Verifica se a tecla esquerda está pressionada
        if (this.keys.left.isDown && this.player.x > 60) {
            this.player.setFlipX(true); // Vira o jogador para a esquerda
            if (this.keys.shift.isDown) {
                this.player.setVelocityX(-300); // Aumenta a velocidade ao correr
                if (this.keys.interaction.isDown && primeiroContato === false) {
                    setTimeout(() => {//Cooldown do ataque
                        this.player.play("attack-run", true); // Executa a animação de ataque correndo
                        }, 2000);
                } else {
                    this.player.play("walking", true); // Executa a animação de caminhada
                }
            } else {
                this.player.setVelocityX(-160); // Velocidade normal ao andar
                this.player.play("walking", true); // Executa a animação de caminhada
            }
        } else if (this.keys.right.isDown && this.player.x < larguraJogo - 100) {
            this.player.setFlipX(false); // Vira o jogador para a direita
            if (this.keys.shift.isDown) {
                this.player.setVelocityX(300); // Aumenta a velocidade ao correr
                if (this.keys.interaction.isDown && primeiroContato === false) {
                    setTimeout(() => {//Cooldown do ataque
                        this.player.play("attack-run", true); // Executa a animação de ataque correndo
                        }, 2000);
                    
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
                setTimeout(() => {//Cooldown do ataque
                this.player.play("attack", true); // Executa a animação de ataque
                }, 1000);
                
            } else {
                this.player.play("idle", true); // Executa a animação de idle
            }
        }

        // Mecânica de pulo
        if (this.keys.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-900); // Faz o jogador pular
        }

    }
   

    chat(){
        this.dragao.destroy();//Destruindo a zona do dragão
        //Escondendo ou destruindo informações
        this.teclaE.setAlpha(0);
        this.teclas.destroy();
        this.teclaE.stop('teclaE');

        //Mostra a caixa de texto
        this.textbox.setAlpha(100);        

        //Variável que armazena os textos a serem printados
        let messages = [
            "Olá, aventureiro! \nEu sou o dragão guardião deste castelo.",
            "Estou em busca de um herói que possa me ajudar \na derrotar o golem que está aterrorizando a cidade.",
            "Você pode me ajudar?",
            "Rápido, eles estão chegando!\n\nPule sobre os Golens para derrota-los.", ""]

        //Linha de instrução ao jogador
        this.instrução = this.add.text(this.textbox.x + 370, alturaJogo*0.1 + 120, "Clique 'E' para continuar", { font: "15px Blackletter", fill: "#000000", align: "center", fontWeight: "bold" }).setOrigin(0.5, 0.5);

        //Criação do array que guardará as linhas que serão printadas (com configuração de texto)
        let linha = [];
            
        //For de atribuição, atribui à linha específica sua mensagem e configuração de texto
        for(let i = 0; i < messages.length; i++){
            linha[i] = this.add.text(this.textbox.x + 370, alturaJogo*0.1 + 50, messages[i], { font: "20px Blackletter", fill: "#000000", align: "left", fontWeight: "black" }).setOrigin(0.5, 0.5);
            linha[i].setAlpha(0);//Esconde a linha enquanto não é usada
            
        }

        let currentLine = 0;//Variável de controle para exibição do texto

        // Função para mostrar a próxima linha
        const showNextLine = () => {
            if (currentLine > 0) {
                linha[currentLine - 1].destroy(); // Exclui a mensagem anterior
            }
            if (currentLine < messages.length) {//Enquanto a variável de controle for menor que o número de mensagens, o processo continua.
                linha[currentLine].setAlpha(1);//Exibe a mensagem respectiva
                currentLine++;//Incrementa a variável de controle
            }
            if(currentLine >= messages.length){//Momento em que a variável de controle não é mais menor que o número de mensagens, encerramento do processo.
                this.instrução.destroy();//Destroi a linha de instrução
                this.textbox.setAlpha(0);//Esconde a caixa de texto

                //Exibindo caixa de placar e placares
                this.placarBox.setAlpha(100);
                placar.setAlpha(100);
                placarVidaPlayer.setAlpha(100);
                placarVidaGolem.setAlpha(100);

                //Chamando a função inimigos:
                if(primeiroContato === true){
                this.inimigos();}
            }

        };
    
        // Mostra a primeira linha
        showNextLine();
    
        // Adiciona um evento de tecla para avançar para a próxima linha
        this.input.keyboard.on('keydown-E', showNextLine);
        return 0;
    } 
   
    inimigos() {
        primeiroContato = false;//Mudando o estado da variável primeiro contato

        if (!this.golemCreated) {//Aguarda true
            this.golemLife = 3;//Reinicia a vida do golem
            this.golemCreated = true; // Marca que o golem foi criado

            placarVidaPlayer.setText('Vida player: ' + this.playerLife);
            placarVidaGolem.setText('Vida golem: ' + this.golemLife);

            console.log("Função inimigos");
            //Adiciona o Golem no extremo leste da tela;
            this.golem = this.physics.add.sprite(larguraJogo * 1.1, this.floorCena01.y - 255, "golem").setScale(0.5).setFlipX(true).setSize(400,380);
            this.golem.body.pushable = false;//Impede que o Golem seja arrastado

            this.bordaEsquerda = this.add.zone(0, alturaJogo * 0.5, 100, 500);//Zona de controle do golem
            this.physics.world.enable(this.bordaEsquerda);
           

            //Os ifs abaixo adicionam progressão e dificuldade ao jogo adicionando velocidade e tamanho ao inimigo.
            if(golensAbatidos < 3){
                this.golem.setVelocityX(-40);
            }
            if(golensAbatidos > 2){
                this.golem.setVelocityX(-80);
                this.golem.setScale(0.6);
            }
            if(golensAbatidos > 4){
                this.golem.setVelocityX(-100);
                this.golem.setScale(0.7);
            }
            if(golensAbatidos > 7){
                this.golem.setVelocityX(-120);
                this.golem.setScale(0.8);
            }
            if(golensAbatidos > 9){
                this.golem.setVelocityX(-140);
                this.golem.setScale(0.85);
            }

            this.golem.stop("golem-attack");//Encerra animação de ataque
            this.golem.play("golem-walking", true);//Inicia animação de caminhada

            this.physics.add.collider(this.golem, this.bordaEsquerda, () => {//Colisão entre golem e zona de controle
                    console.log("Golem entrou no castelo");
                    this.golem.setPosition(larguraJogo * 1.1, this.floorCena01.y - 255); // Retorna o golem para a posição inicial
            });


            this.physics.add.collider(this.golem, this.player, () => {
                // Verifica se houve colisão lateral entre o golem e o jogador e se o jogador ainda tem vida
                if ((this.golem.body.touching.right && !this.golem.body.wasTouching.right && this.playerLife > 0) || 
                    (this.golem.body.touching.left && !this.golem.body.wasTouching.left && this.playerLife > 0)) {
                    
                    
                    // Aciona a animação de ataque do golem e para o movimento horizontal
                    this.golem.play("golem-attack");
                    this.golem.setVelocityX(0);
            
                    console.log(`Colisão lateral contabilizada! Vida do player: ${this.playerLife}`);
                    this.playerLife--;
                    placarVidaPlayer.setText('Vida player: ' + this.playerLife);
            
                    // Verifica se a vida do jogador acabou
                    if (this.playerLife === 0) {
                        this.player.setPosition(100, this.floorCena01.y-265);
                        this.player.setVisible(false);
                        
                        // Aguarda 3 segundos para restaurar a vida do jogador e torná-lo visível novamente
                        setTimeout(() => {
                            this.playerLife = 3;
                            placarVidaPlayer.setText('Vida player: ' + this.playerLife);
                            this.player.setVisible(true);
                        }, 3000);
                    }
                }
            
                // Verifica se houve colisão na parte superior (quando o jogador pula sobre o golem)
                if (this.golem.body.touching.up && !this.golem.body.wasTouching.up && this.golemLife > 0) {
                    console.log(`Colisão superior contabilizada! Vida do Golem: ${this.golemLife}`);
                    this.golemLife--;
                    placarVidaGolem.setText('Vida golem: ' + this.golemLife);
            
                    // Verifica se a vida do golem chegou a zero
                    if (this.golemLife === 0) {
                        golensAbatidos++;
                        placar.setText('Golens abatidos: ' + golensAbatidos);
            
                        // Inicia a animação de morte do golem e o remove após 2 segundos
                        this.golem.play("golem-dying", true);
                        this.golem.setVelocityX(0);
                        setTimeout(() => {
                            this.golem.destroy();
                        }, 2000);
            
                        // Aguarda 3 segundos antes de criar um novo golem ou finalizar o jogo
                        setTimeout(() => {
                            this.golemCreated = false;//Informa que não existe Golem criado

                            if (golensAbatidos === 12) {//Caso de finalização do jogo
                                //Exibindo a caixa de texto e dando informações textuais ao jogador
                                this.textbox.setAlpha(100);
                                this.add.text(this.textbox.x + 370, alturaJogo * 0.1 + 120, "Aguarde para retornar ao Menu.", {
                                    font: "15px Blackletter", fill: "#000000", align: "center", fontWeight: "bold"//Configurações de texto
                                }).setOrigin(0.5, 0.5);
                                this.add.text(this.textbox.x + 370, alturaJogo * 0.1 + 50, "Obrigado Heroi, você salvou o reino!!!", {
                                    font: "20px Blackletter", fill: "#000000", align: "left", fontWeight: "black"//Configurações de texto
                                }).setOrigin(0.5, 0.5);
            
                                // Retorna ao menu após 5 segundos
                                setTimeout(() => {
                                    primeiroContato = true;//Voltando ao estado natural da variável
                                    golensAbatidos = 0;//Reiniciando a contagem de Golens abatidos
                                    this.scene.stop("Cena01");//Desliga a cena principal
                                    this.scene.start("Menu");//Volta à cena do Menu
                                }, 5000);
                            } else {
                                // Cria novos inimigos se o jogo ainda não terminou
                                this.inimigos();
                            }
                        }, 3000);
                    }
                }
            });
        }
    }
}            

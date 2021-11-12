var desert, invisibleGround, desertImg;
var man, man_running, man_collided;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOver, gameOverImg;
var restart, restartImg;
var jumpSound , checkPointSound, dieSound;

var play = 1;
var end = 0;
var gameState = play;

function preload()
{
  man_running = loadAnimation("Man1.png","Man2.png","Man3.png");
  man_collided = loadAnimation("Man_collided.png");
  desertImg = loadImage("Desert.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png");

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png");

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}
function setup() {
    createCanvas(windowWidth, windowHeight);

    man = createSprite(90,500,20,50);
    man.addAnimation("running", man_running);
    man.addAnimation("collided", man_collided);
    man.scale = 0.3;

desert = createSprite(width/2,200);
desert.addImage("desert", desertImg);
desert.x = desert.width /2;


  invisibleGround = createSprite(200,600,400,10);
  invisibleGround.visible = false;

  obstaclesGroup = createGroup();

  score = 0;

  man.setCollider("rectangle",0,0,man.width,man.height);
  man.debug = false;
}
function draw() {
  
    background(180);
    //displaying score

    if(gameState === play){

      desert.velocityX = -(4 + 3* score/100);
        //scoring
     score = score + Math.round(getFrameRate()/60);

     if(score>0 && score%100 === 0){
      checkPointSound.play() 
   }
     if(desert.x < 400){
        desert.x = desert.width/2;
     }
    desert.depth = man.depth;
    man.depth = man.depth+1;

    //add gravity
    man.velocityY = man.velocityY + 0.8

    if(keyDown("space")&& man.y >= 100) {
      man.velocityY = -16;
     jumpSound.play();
  }
     spawnObstacles();

     if(obstaclesGroup.isTouching(man)){
        man.velocityY = -12;
        jumpSound.play();
        gameState = end;
        dieSound.play()

      gameOver = createSprite(600,300);
     gameOver.addImage(gameOverImg);
  
     restart = createSprite(600,350);
     restart.addImage(restartImg);

     gameOver.scale = 0.8;
     restart.scale = 0.8;
    }
    }
  if (gameState === end) {
    gameOver.visible = true;
    restart.visible = true;

    man.changeAnimation("collided", man_collided);

   desert.velocityX = 0;
   man.velocityY = 0;

  obstaclesGroup.setLifetimeEach(-1);
  obstaclesGroup.setVelocityXEach(0);
  }
  man.collide(invisibleGround);

if(mousePressedOver(restart)) {
    reset();
  }


drawSprites();
stroke("yellow");
textSize(40);
text("Score: "+ score, 550,50);
function spawnObstacles(){
    if (frameCount % 100 === 0){
      var obstacle = createSprite(1300,540,10,30);
      obstacle.velocityX = -(6 + score/100);
      
      man.depth = obstaclesGroup.depth;
      obstaclesGroup.depth = obstaclesGroup.depth+1;
       //generate random obstacles
       var rand = Math.round(random(1,6));
       switch(rand) {
         case 1: obstacle.addImage(obstacle1);
                 break;
         case 2: obstacle.addImage(obstacle2);
                 break;
         case 3: obstacle.addImage(obstacle3);
                 break;
         case 4: obstacle.addImage(obstacle4);
                 break;
         case 5: obstacle.addImage(obstacle5);
                 break;
         case 6: obstacle.addImage(obstacle6);
                 break;
         default: break;
       }
       //assign scale and lifetime to the obstacle           
       obstacle.scale = 0.1;
       obstacle.lifetime = 200;

       obstaclesGroup.add(obstacle);
 }
}
function reset(){
    gameState = play;
    gameOver.visible=false;
    restart.visible=false;
    obstaclesGroup.destroyEach();
    man.changeAnimation("running")
    score=0
  }
}
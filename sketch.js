//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, ground_moving;
var cloud_image;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var count = 0;
var cloud_group, obstacle_group;
var jump, die, checkpoint;
var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  ground_moving = loadImage("ground2.png");
  
  cloud_image = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  checkpoint = loadSound("checkPoint.mp3");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50, 180, 20, 20);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5
  
  ground = createSprite(300, 180, 800, 20);
  ground.addImage("moving", ground_moving);
  ground.velocityX = -3;
  ground.x = ground.width/2;
  
  invisibleGround = createSprite(300, 185, 600, 5);
  invisibleGround.visible = false;
  
  cloud_group = new Group();
  obstacle_group = new Group();
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
}

function draw() {
  background("white");
  text("Score: " + count, 500, 50);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*count/100);
    
    //scoring
    count = count + Math.round(getFrameRate()/50);
    
    if (count>0 && count%100 === 0){
      checkpoint.play();
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 159){
      trex.velocityY = -12 ;
      jump.play();
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(obstacle_group.isTouching(trex)){
      gameState = END;
      die.play();
    }
  }
  
  else if(gameState === END) {
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstacle_group.setVelocityXEach(0);
    cloud_group.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided", trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstacle_group.setLifetimeEach(-1);
    cloud_group.setLifetimeEach(-1);
    
    gameOver.visible = true;
    restart.visible = true;
  
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  trex.collide(invisibleGround);
  drawSprites();
}

function spawnClouds() {
  if(frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage("cloud moving", cloud_image);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    // //add each cloud to the group
    cloud_group.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = - (6 + 3*count/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1)
              break;
      case 2: obstacle.addImage(obstacle2)
              break;
      case 3: obstacle.addImage(obstacle3)
              break;
      case 4: obstacle.addImage(obstacle4)
              break;
      case 5: obstacle.addImage(obstacle5)
              break;
      case 6: obstacle.addImage(obstacle6)
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
    //add each obstacle to the group
    obstacle_group.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstacle_group.destroyEach();
  cloud_group.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<count){
    localStorage["HighestScore"] = count;
  }
  console.log(localStorage["HighestScore"]);
  
  count = 0;
  
}
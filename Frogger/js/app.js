var currentScreen;
var score = 0;

function trackCollisions(objects) {
  objects.forEach(function(object1) {
    objects.forEach(function(object2) {
      if(object1 != object2) {
        if(checkCollision(object1, object2)) {
          if(object1 instanceof Player || object2 instanceof Player) {
            currentScreen.player.reset();
            score = 0;
          }
          else {
            if(object1.speed > object2.speed) {
              object2.speed = object1.speed;
            }
            else {
              object1.speed = object2.speed;
            }
          }
        }
      }
    });
  });
}
function checkCollision(object1, object2) {
  var rec1 = object1.collisionRectangle;
  var rec2 = object2.collisionRectangle;

  if(rec1.x > (rec2.x + rec2.width) || rec2.x > (rec1.x + rec1.width)) {
    return false;
  }
  if(rec1.y > (rec2.y + rec2.height) || rec2.y > (rec1.y + rec1.height)) {
    return false;
  }

  return true;
}

function updateScore() {
  document.getElementsByTagName("title")[0].innerHTML = "Frogger :: Score " + score;
}

var gameObject = function () {
  this.collisionRectangle = {};
};

gameObject.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

gameObject.prototype.update = function(dt) {

}

gameObject.prototype.collidesWith = function(object) {
  var rec1 = this.collisionRectangle;
  var rec2 = object.collisionRectangle;

  if(rec1.x > (rec2.x + rec2.width) || rec2.x > (rec1.x + rec1.width)) {
    return false;
  }
  if(rec1.y > (rec2.y + rec2.height) || rec2.y > (rec1.y + rec1.height)) {
    return false;
  }

  return true;
}

var Enemy = function() {
  gameObject.call(this);
  this.y = 228 - 83 * Math.floor(Math.random() * 3);
  this.x = -101;
  this.speed = Math.floor((Math.random() * 100) + 50) + score * 50;
  this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype = Object.create(gameObject.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(dt) {
  this.x += this.speed * dt;

  this.collisionRectangle = {
    x: this.x,
    y: this.y + 10,
    width: 101,
    height: 63
  };
  /*
  if(this.collidesWith(currentScreen.player)) {
    score = 0;
    updateScore();
    test.reset();
  }
  */

  if(this.x > 505) {
    var index = currentScreen.instances.indexOf(this);
    currentScreen.instances.splice(index, 1);
  }
};

var Player = function () {
  gameObject.call(this);

  this.handleInput = function (keyboardKey) {
    switch(keyboardKey) {
      case 'left':
      this.x -= (101 * (this.x > 0));
      break;
      case 'up':
      this.y -= (83 * (this.y > 0));
      break;
      case 'right':
      this.x += (101 * (this.x < 404));
      break;
      case 'down':
      this.y += (83 * (this.y < 375));
      break;
    }
  };

  this.reset = function () {
    this.x = 0;
    this.y = 375;
  };

  this.reset();

  this.sprite = 'images/char-boy.png';
}

Player.prototype = Object.create(gameObject.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(dt) {
  this.collisionRectangle = {
    x: this.x + 20,
    y: this.y + 60,
    width: 61,
    height: 10
  };
  if(this.y < 0) {
    score++;
    updateScore();
    this.reset();
  }
};

var Screen = function () {
  this.instances = [];
};
Screen.prototype.render = function() {
  this.instances.forEach(function(instance) {
      instance.render();
  });
};

Screen.prototype.update = function(dt) {
  this.instances.forEach(function(instance) {
      instance.update(dt);
  });
};

var GameScreen = function () {
  Screen.call(this);

  this.spawnEnemy = function () {
    currentScreen.instances.push(new Enemy());
    setTimeout(currentScreen.spawnEnemy, 1500 - (score * 100));
  }
};

GameScreen.prototype = Object.create(Screen.prototype);
GameScreen.prototype.constructor = GameScreen;

GameScreen.prototype.spawnEnemy = function () {
  currentScreen.instances.push(new Enemy());
  setTimeout(currentScreen.spawnEnemy, 1000);
}

GameScreen.prototype.update = function (dt) {
  this.instances.forEach(function(instance) {
    instance.update(dt);
  });
  trackCollisions(currentScreen.instances);
};

GameScreen.prototype.render = function () {
  var rowImages = [
    'images/water-block.png',   // Top row is water
    'images/stone-block.png',   // Row 1 of 3 of stone
    'images/stone-block.png',   // Row 2 of 3 of stone
    'images/stone-block.png',   // Row 3 of 3 of stone
    'images/grass-block.png',   // Row 1 of 2 of grass
    'images/grass-block.png'    // Row 2 of 2 of grass
  ],
  numRows = 6,
  numCols = 5,
  row, col;

for (row = 0; row < numRows; row++) {
    for (col = 0; col < numCols; col++) {
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
    }
  }

  this.instances.forEach(function(instance) {
      instance.render();
  });

};

GameScreen.prototype.init = function () {
  this.player = new Player();
  this.instances.push(this.player);
  document.addEventListener('keyup', function(e) {
    var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };
      currentScreen.player.handleInput(allowedKeys[e.keyCode]);
  });
  this.spawnEnemy();
}

var SplashScreen = function () {
    Screen.call(this);

};

SplashScreen.prototype = Object.create(Screen.prototype);
SplashScreen.prototype.constructor = SplashScreen;

SplashScreen.prototype.init = function () {
  var splash = new gameObject();
  splash.sprite = 'images/ps1frogger.png';
  splash.x = 0;
  splash.y = 70;
  this.instances.push(splash);

  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "green";
  ctx.fillText("Insert coins (0/3) to start...", 0,  500);


  document.addEventListener('keyup', function a (e) {
    currentScreen = new GameScreen;
    currentScreen.init();
    document.removeEventListener('keyup', a);
  });
};

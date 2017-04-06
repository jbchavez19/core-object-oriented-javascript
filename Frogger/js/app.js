var score = 0;

function updateScore() {
  document.getElementsByTagName("title")[0].innerHTML = "Frogger :: Score " + score;
}


var gameObject = function () {
  this.collisionRectangle = {};
};

gameObject.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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

  // enemy.y gets a random starting position: 43, 126, or 209
  // enemy.x always starts outside view
  this.y = 228 - 83 * Math.floor(Math.random() * 3)
  this.x = -101;


  this.speed = Math.floor((Math.random() * 100) + 50) + score;

  this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype = Object.create(gameObject.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(dt) {
  this.x += this.speed * dt;

  this.collisionRectangle = {
    x: this.x,
    y: this.y,
    width: 101,
    height: 83
  };

  if(this.collidesWith(player)) {
    score = 0;
    updateScore();
    player.reset();
  }

  if(this.x > 505) {
    var index = allEnemies.indexOf(this);
    allEnemies.splice(index, 1);
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

var allEnemies = [];
var player;

player = new Player();

var spawnEnemy = function () {
  allEnemies.push(new Enemy());
  setTimeout(spawnEnemy, 1000);
};
spawnEnemy();

document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

    player.handleInput(allowedKeys[e.keyCode]);
});

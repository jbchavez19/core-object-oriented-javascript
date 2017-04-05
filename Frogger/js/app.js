//Settings

var score = 0;

function updateScore() {
  document.getElementsByTagName("title")[0].innerHTML = "Frogger :: Score " + score;
}

var gameObject = function () {

};

gameObject.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Enemy = function() {
  gameObject.call(this);

  // enemy.y gets a random starting position: 43, 126, or 209
  // enemy.x always starts outside view
  this.y = 228 - 83 * Math.floor(Math.random() * 3)
  this.x = -101;

  // speed gets a random number between 1-5, plus score
  this.speed = Math.floor((Math.random() * ((score + 1) * 60)) + 20);

  this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype = Object.create(gameObject.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(dt) {
  this.x += this.speed * dt;

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
  console.log("Number of Enemies", allEnemies.length);
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

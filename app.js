$(document).ready(function () {
  // create a variable that targets the canvas
  var canvas = $("#canvas")[0];
  // this line is required but poorly explained as to why
  var ctx = canvas.getContext("2d");
  // ctx now refers to the canvas

  // a snake is a series of red squares (an object)
  var snake = [
    { x: 50, y: 100, oldX: 0, oldY: 0 },
    { x: 50, y: 90, oldX: 0, oldY: 0 },
    { x: 50, y: 80, oldX: 0, oldY: 0 },
  ];

  var food = {
    x: 200,
    y: 200,
    eaten: false,
  };

  var snakeWidth = (snakeHeight = 10);

  const left = 37;
  const up = 38;
  const right = 39;
  const down = 40;

  var keyPressed = down;
  var score = 0;
  const blockSize = 10;
  var game;

  game = setInterval(gameLoop, 500);

  function gameLoop() {
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
  }

  function moveSnake() {
    $.each(snake, function (index, value) {
      snake[index].oldX = value.x;
      snake[index].oldY = value.y;
      if (index === 0) {
        if (keyPressed === down) {
          snake[index].y = value.y + blockSize;
        } else if (keyPressed === up) {
          snake[index].y = value.y - blockSize;
        } else if (keyPressed === right) {
          snake[index].x = value.x + blockSize;
        } else if (keyPressed === left) {
          snake[index].x = value.x - blockSize;
        }
      } else {
        snake[index].x = snake[index - 1].oldX;
        snake[index].y = snake[index - 1].oldY;
      }
    });
  }

  function drawSnake() {
    $.each(snake, function (index, value) {
      ctx.fillStyle = "red";
      ctx.fillRect(value.x, value.y, snakeWidth, snakeHeight);
      ctx.strokeStyle = "white";
      ctx.strokeRect(value.x, value.y, snakeWidth, snakeHeight);
      if (index === 0) {
        if (collided(value.x, value.y)) {
          gameOver();
        }
        if (didEatFood(value.x, value.y)) {
          score++;
          $("#score").text(score);
          makeSnakeBigger();
          food.eaten = true;
        }
      }
    });
  }

  function makeSnakeBigger() {
    snake.push({
      x: snake[snake.length - 1].oldX,
      y: snake[snake.length - 1].oldY,
    });
  }

  function collided(x, y) {
    return (
      snake.filter(function (value, index) {
        return index != 0 && value.x === x && value.y === y;
      }).length > 0 ||
      x < 0 ||
      x > canvas.width - 10 ||
      y < 0 ||
      y > canvas.height - 10
    );
  }

  function drawFood() {
    ctx.fillStyle = "yellow";
    if (food.eaten) {
      food = getNewFoodPosition();
    } else {
      ctx.fillRect(food.x, food.y, snakeWidth, snakeHeight);
    }
  }

  function didEatFood(x, y) {
    return food.x === x && food.y === y;
  }

  function clearCanvas() {
    ctx.clearRect(9, 0, canvas.width, canvas.height);
  }

  $(document).keydown(function (e) {
    if ($.inArray(e.which, [down, up, left, right]) != -1) {
      keyPressed = checkKeyIsAllowed(e.which);
    }
  });

  function checkKeyIsAllowed(tempKey) {
    let key;
    if (tempKey === down) {
      key = keyPressed != up ? tempKey : keyPressed;
    } else if (tempKey === up) {
      key = keyPressed != down ? tempKey : keyPressed;
    } else if (tempKey === left) {
      key = keyPressed != right ? tempKey : keyPressed;
    } else if (tempKey === right) {
      key = keyPressed != left ? tempKey : keyPressed;
    }
    return key;
  }

  function gameOver() {
    clearInterval(game);
    alert("Game Over!");
  }

  function getNewFoodPosition() {
    let xArr = [],
      yArr = [],
      xy;
    $.each(snake, function (index, value) {
      if ($.inArray(value.x, xArr) != -1) {
        xArr.push(value.x);
      }
      if ($.inArray(value.y, yArr) === -1) {
        yArr.push(value.y);
      }
    });
    xy = getEmptyXY(xArr, yArr);
    return xy;
  }

  function getEmptyXY(xArr, yArr) {
    let newX, newY;
    newX = getRandomNumber(canvas.width - 10, 10);
    newY = getRandomNumber(canvas.height - 10, 10);
    if ($.inArray(newX, xArr) === -1 && $.inArray(newY, yArr) === -1) {
      return {
        x: newX,
        y: newY,
        eaten: false,
      };
    } else {
      return getEmptyXY(xArr, yArr);
    }
  }

  function getRandomNumber(max, multipleOf) {
    let result = Math.floor(Math.random() * max);
    result = result % 10 == 0 ? result : result + (multipleOf - (result % 10));
    return result;
  }
});

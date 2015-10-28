(function() {
  'use strict';

  if (typeof Breakout === "undefined") {
    window.Breakout = {};
  }

  var paddleX,
      paddleHeight,
      paddleWidth,
      x = 150,
      y = 150,
      dx = 2,
      dy = 4,
      WIDTH,
      HEIGHT,
      intervalId,
      rightDown = false,
      leftDown = false,
      canvasMinX,
      canvasMaxX;

  var bricks,
      BRICKROWS,
      BRICKCOLUMNS,
      BRICKWIDTH,
      BRICKHEIGHT,
      BRICKPADDING;

  var initBricks = Breakout.initBricks = function () {
    BRICKROWS = 5;
    BRICKCOLUMNS = 5;
    BRICKWIDTH = (WIDTH/BRICKCOLUMNS) - 1;
    BRICKHEIGHT = 15;
    BRICKPADDING = 1;

   bricks = new Array(BRICKROWS);
    for (var i = 0; i < BRICKROWS; i++) {
      bricks[i] = new Array(BRICKCOLUMNS);
      for (var j = 0; j < BRICKCOLUMNS; j++){
        bricks[i][j] = true;
      }
    }
  };

  var drawBricks = Breakout.drawBricks = function () {
    for (var i = 0; i < BRICKROWS; i++){
      for (var j = 0; j < BRICKCOLUMNS; j++){
        if (bricks[i][j]) {
          drawRect((j * (BRICKWIDTH + BRICKPADDING)) + BRICKPADDING,
                   (i * (BRICKHEIGHT + BRICKPADDING)) + BRICKPADDING,
                   BRICKWIDTH, BRICKHEIGHT);
        }
      }
    }
    checkBrickHit();
  };

  var checkBrickHit = Breakout.checkBrickHit = function () {
    var brickrowheight = BRICKHEIGHT + BRICKPADDING;
    var brickcolumnwidth = BRICKWIDTH + BRICKPADDING;
    var row = Math.floor(y/brickrowheight);
    var column = Math.floor(x/brickcolumnwidth);
    if ((y < BRICKROWS * brickrowheight) &&
       (row >= 0) &&
       (column >= 0) &&
       (bricks[row][column])) {
        dy = -dy;
        bricks[row][column] = false;
    }
  };

  var initMouse = Breakout.initMouse = function () {
    canvasMinX = $('#canvas').offset().left;
    canvasMaxX = canvasMinX + WIDTH;
  };

  var onMouseMove = Breakout.onMouseMove = function (e) {
    if (e.pageX > canvasMinX && e.pageX < canvasMaxX) {
      paddleX = e.pageX - canvasMinX - (paddleWidth/2);
    }
  };

  var onKeyDown = Breakout.onKeyDown = function (e) {
    if (e.keyCode == 39) {
      rightDown = true;
    } else if (e.keyCode == 37) {
      leftDown = true;
    }
  };

  var onKeyUp = Breakout.onKeyUp = function (e) {
    if (e.keyCode == 39) {
      rightDown = false;
    } else if (e.keyCode == 37) {
      leftDown = false;
    }
  };


  var drawPaddle = Breakout.drawPaddle = function () {
    paddleHeight = 10;
    paddleWidth = 75;
    drawRect(paddleX, HEIGHT - paddleHeight, paddleWidth, paddleHeight);
  };

  var drawBall = Breakout.drawBall = function (x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  };

  var drawRect = Breakout.drawRect = function (x, y, width, height) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.closePath();
    ctx.fill();
  };

  var clear = Breakout.clear = function () {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
  };

  var draw = Breakout.draw = function () {
    clear();
    drawBall(x, y, 10);
    drawBricks();

    // paddle responds to keypress events
    if (rightDown) {
      paddleX += 5;
    } else if (leftDown) {
      paddleX -= 5;
    }
    if (paddleX < 0) {
      paddleX = 0;
    } else if (paddleX > WIDTH - paddleWidth) {
      paddleX = WIDTH - paddleWidth;
    }
    drawPaddle();

    // ball bounces off walls
    if (x + dx > WIDTH || x + dx < 0) {
      dx = -dx;
    } else if (y + dy < 0) {
      dy = -dy;
    } else if (y + dy > HEIGHT) {
      // ball bounces off paddle or ends game
      if (x > paddleX && x < paddleX + paddleWidth) {
        // ball changes velocity depending on where it hits on the paddle
        if (x < paddleX + (paddleWidth / 3)) {
          dx = -2;
          dy = -dy
        } else if (x < paddleX + 2 * (paddleWidth / 3)) {
          dy = -dy;
        } else {
          dx = 2;
          dy = -dy;
        }
      } else {
        clearInterval(intervalId);
      }
    }


    x += dx;
    y += dy;
  };

  var init = Breakout.init = function (canvas) {
    $(document).keyup(Breakout.onKeyUp);
    $(document).keydown(Breakout.onKeyDown);
    $(document).mousemove(Breakout.onMouseMove);
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();
    paddleX = WIDTH / 2;
    initMouse();
    initBricks();
    intervalId = setInterval(draw, 10);
  };


}());

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
      leftDown = false;

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
    paddleX = paddleX || WIDTH / 2;
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

    // paddle responds to keypress events
    if (rightDown) {
      paddleX += 5;
    } else if (leftDown) {
      paddleX -= 5;
    }
    drawPaddle();

    // ball bounces off walls
    if (x + dx > WIDTH || x + dx < 0) {
      dx = -dx;
    } else if (y + dy < 0) {
      dy = -dy;
    } else if (y + dy > HEIGHT) {
      clearInterval(intervalId);
    }

    x += dx;
    y += dy;
  };

  var init = Breakout.init = function (canvas) {
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();
    intervalId = setInterval(draw, 10);
  };


}());

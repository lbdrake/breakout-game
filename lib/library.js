(function() {
  'use strict';

  if (typeof Breakout === "undefined") {
    window.Breakout = {};
  }

  var paddleX,
      paddleHeight,
      paddleWidth;

  var drawPaddle = Breakout.drawPaddle = function () {
    paddleX = WIDTH / 2;
    paddleHeight = 10;
    paddleWidth = 75;
    drawBlock(paddleX, HEIGHT - paddleHeight, paddleWidth, paddleHeight);
  };

  var x = 150,
      y = 150,
      dx = 2,
      dy = 4,
      WIDTH,
      HEIGHT;

  var drawBall = Breakout.drawBall = function (x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  };

  var drawBlock = Breakout.drawBlock = function (x, y, width, height) {
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
    drawPaddle();
    // ball bounces off walls
    if (x + dx > WIDTH || x + dx < 0) {
      dx = -dx;
    } else if (y + dy > HEIGHT || y + dy < 0){
      dy = -dy;
    }

    x += dx;
    y += dy;
  };

  var init = Breakout.init = function (canvas) {
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();
    return setInterval(draw, 20);
  };


}());

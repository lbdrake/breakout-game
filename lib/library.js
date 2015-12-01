(function() {
  'use strict';

  if (typeof Breakout === "undefined") {
    window.Breakout = {};
  }

  var paddleX,
      paddleHeight,
      paddleWidth,
      ballRadius,
      x,
      y,
      dx,
      dy,
      WIDTH,
      HEIGHT,
      intervalId,
      rightDown = false,
      leftDown = false,
      canvasMinX,
      canvasMaxX,
      backgroundImage,
      marioImage;

        var bricks,
            BRICKROWS,
            BRICKCOLUMNS,
            BRICKWIDTH,
            BRICKHEIGHT,
            BRICKPADDING,
            brickImage;

        var initBricks = Breakout.initBricks = function () {
          BRICKROWS = 3;
          BRICKCOLUMNS = 5;
          BRICKWIDTH = (canvas.width/BRICKCOLUMNS) - 155;
          BRICKHEIGHT = BRICKWIDTH;
          BRICKPADDING = 5;
          brickImage = new Image();
          brickImage.src = 'public/brick.jpg';

         bricks = new Array(BRICKROWS);
          for (var i = 0; i < BRICKROWS; i++) {
            bricks[i] = new Array(BRICKCOLUMNS);
            for (var j = 0; j < BRICKCOLUMNS; j++){
              bricks[i][j] = true;
            }
          }
        };

        var drawBricks = Breakout.drawBricks = function () {
          var checkForBricks = 0;
          for (var i = 0; i < BRICKROWS; i++){
            for (var j = 0; j < BRICKCOLUMNS; j++){
              if (bricks[i][j]) {
                ctx.drawImage(brickImage,(j * (BRICKWIDTH + BRICKPADDING)) + BRICKPADDING + (canvas.width * 0.37),
                         (i * (BRICKHEIGHT + BRICKPADDING)) + BRICKPADDING + (canvas.width * 0.2),
                         BRICKWIDTH, BRICKHEIGHT);
                checkForBricks += 1;
              }
            }
          }

          if (checkForBricks == 0) {
            clearInterval(intervalId);
            intervalId = null;
            window.alert("Congrats, you won!");
          };
          checkBrickHit();
        };

        var checkBrickHit = Breakout.checkBrickHit = function () {
          var brickrowheight = BRICKHEIGHT + BRICKPADDING;
          var brickcolumnwidth = BRICKWIDTH + BRICKPADDING;
          var row = Math.floor(y/brickrowheight);
          var column = Math.floor(x/brickcolumnwidth);
          if ((y < BRICKROWS * brickrowheight + WIDTH * 0.18) &&
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
    ctx.fillStyle = "#000033";
    paddleHeight = 10;
    paddleWidth = 75;
    drawRect(paddleX, HEIGHT - paddleHeight, paddleWidth, paddleHeight);
  };

  var drawBall = Breakout.drawBall = function (x, y, radius) {
      // context.shadowOffsetX = 10;
      // context.shadowOffsetY = 10;
      // context.shadowBlur = 10;
      // context.shadowColor = "black"

    // var mugatuBall = new Image();
    // mugatuBall.src = 'public/Mugatu-1.png';
    //
    //   ctx.drawImage(mugatuBall, x, y, 30, 40)
    // mugatuBall.onload = function(){
    // };
    // white ball
      // ctx.fillStyle = "#CCFF00";
      // ctx.beginPath();
      // ctx.arc(x, y, radius, 0, Math.PI*2, true);
      // ctx.closePath();
      // ctx.fill();
      ctx.drawImage(marioImage, 0, 0, 20, 20, x, y, 40, 40)
  };

  var drawRect = Breakout.drawRect = function (x, y, width, height) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.closePath();
    ctx.fill();
  };

  var clear = Breakout.clear = function () {
    ctx.fillStyle = "#5D94FB";
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawRect(0,0, WIDTH, HEIGHT);
  };

  var loadBackground = Breakout.loadImages = function () {
    backgroundImage = new Image();
    backgroundImage.src = 'public/mariobackground.jpg';
    marioImage = new Image();
    marioImage.src = 'public/mario.png';
    };

  var draw = Breakout.draw = function () {
    clear();
    ctx.drawImage(backgroundImage, 0, 0, WIDTH, HEIGHT);
    drawBall(x, y, ballRadius);
    Breakout.drawBricks();

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
    if (x + dx + ballRadius > WIDTH || x + dx - ballRadius < 0) {
      dx = -dx;
    } else if (y + dy - ballRadius < 0) {
      dy = -dy;
    } else if (y + dy + ballRadius > HEIGHT - paddleHeight) {
      // ball bounces off paddle or ends game
      if (x > paddleX && x < paddleX + paddleWidth) {
        // ball changes velocity depending on where it hits on the paddle
        if (x < paddleX + (paddleWidth / 3)) {
          dx = -1;
          dy = -dy;
        } else if (x < paddleX + 2 * (paddleWidth / 3)) {
          dy = -dy;
        } else {
          dx = 1;
          dy = -dy;
        }
      } else if (y + dy + ballRadius > HEIGHT) {
        clearInterval(intervalId);
        intervalId = null;
        window.alert("You lost!");
      }
    }


    x += dx;
    y += dy;
  };

  var init = Breakout.init = function (canvas) {
    if (!intervalId) {
      $(document).keyup(Breakout.onKeyUp);
      $(document).keydown(Breakout.onKeyDown);
      $(document).mousemove(Breakout.onMouseMove);
      WIDTH = $("#canvas").width();
      HEIGHT = $("#canvas").height();
      paddleX = WIDTH / 2;
      ballRadius = 10;
      x = 150;
      y = 150;
      dx = 2;
      dy = 4;
      initMouse();
      Breakout.initBricks();
      loadBackground();
      draw();
    setTimeout(function () {
      intervalId = setInterval(draw, 10);
    }, 1000);
    }
  };


}());

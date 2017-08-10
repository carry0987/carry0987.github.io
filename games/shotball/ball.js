  window.onload = function() {
    canvas = document.getElementById("cas");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ballRadius = 12, g = 9.8 , mocali = 0.5, balls = [], collarg = 0.8;
    pxpm = canvas.width / 20;   //px/m

    for (var i = 0; i < 100; i++) {
      var ball = new Ball(getRandom(ballRadius, canvas.width - ballRadius), getRandom(ballRadius, canvas.height - ballRadius), ballRadius, "rgba(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + " , 1)");
      balls.push(ball);
    }

    animate();

    canvas.onclick = function(event) {
      event = event || window.event;
      var x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - canvas.offsetLeft;
      var y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - canvas.offsetTop;

      balls.forEach(function(b) {
        b.vx = (x - b.x) / 40; //初速度 m/s
        b.vy = (y - b.y) / 40;
      });
    };

    function getRandom(a, b) {
      return Math.random() * (b - a) + a;
    }


    function animate() {

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.restore();

      var t = 16 / 1000;
      collision();
      balls.forEach(function(b) {
        b.run(t);
      });

      if ("requestAnimationFrame" in window) {
        requestAnimationFrame(animate);
      } else if ("webkitRequestAnimationFrame" in window) {
        webkitRequestAnimationFrame(animate);
      } else if ("msRequestAnimationFrame" in window) {
        msRequestAnimationFrame(animate);
      } else if ("mozRequestAnimationFrame" in window) {
        mozRequestAnimationFrame(animate);
      }
    }
  };

  function collision() {
    for (var i = 0; i < balls.length; i++) {
      for (var j = 0; j < balls.length; j++) {
        var b1 = balls[i], b2 = balls[j];
        if (b1 !== b2) {
          var rc = Math.sqrt(Math.pow(b1.x - b2.x, 2) + Math.pow(b1.y - b2.y, 2));
          if (Math.ceil(rc) < (b1.radius + b2.radius + 2)) {

            //獲得碰撞後速度的增量
            var ax = ((b1.vx - b2.vx) * Math.pow((b1.x - b2.x), 2) + (b1.vy - b2.vy) * (b1.x - b2.x) * (b1.y - b2.y)) / Math.pow(rc, 2);
            var ay = ((b1.vy - b2.vy) * Math.pow((b1.y - b2.y), 2) + (b1.vx - b2.vx) * (b1.x - b2.x) + (b1.y - b2.y)) / Math.pow(rc, 2);

            //給與小球新的速度
            b1.vx = (b1.vx - ax) * collarg;
            b1.vy = (b1.vy - ay) * collarg;
            b2.vx = (b2.vx + ax) * collarg;
            b2.vy = (b2.vy + ay) * collarg;

            //獲取兩球斜切位置並且強制扭轉
            var clength = ((b1.radius + b2.radius + 2) - rc) / 2;
            var cx = clength * (b1.x - b2.x) / rc;
            var cy = clength * (b1.y - b2.y) / rc;
            b1.x = b1.x + cx;
            b1.y = b1.y + cy;
            b2.x = b2.x - cx;
            b2.y = b2.y - cy;
          }
        }
      }
    }
  }

  var Ball = function(x, y, r, color) {
    this.x = x;
    this.y = y;
    this.oldx = x;
    this.oldy = y;
    this.vx = 0;
    this.vy = 0;
    this.radius = r;
    this.color = color;
    this.candrod = true;
  };

  Ball.prototype = {
    paint: function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius - 1, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      this.moving = false;
    },
    run: function(t) {
      if (!this.candrod) {
        return this.paint();
      }

      this.oldx = this.x;
      this.oldy = this.y;

      this.vx += this.vx > 0 ? -mocali * t : mocali * t;
      this.vy = this.vy + g * t;

      this.x += t * this.vx * pxpm;
      this.y += t * this.vy * pxpm;

      if (this.y > canvas.height - ballRadius || this.y < ballRadius) {
        this.y = this.y < ballRadius ? ballRadius : (canvas.height - ballRadius);
        this.vy = -this.vy * collarg
      }

      if (this.x > canvas.width - ballRadius || this.x < ballRadius) {
        this.x = this.x < ballRadius ? ballRadius : (canvas.width - ballRadius);
        this.derectionX = !this.derectionX;
        this.vx = -this.vx * collarg;
      }

      this.paint();
    },
  }

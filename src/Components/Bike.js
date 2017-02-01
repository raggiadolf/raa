import React, { Component } from 'react';

class Bike extends Component {
  constructor(props) {
    super(props);
    const whlRd = 10;
    this.state = {
      x: 30,
      speed: 1,
      maxSpeed: 10,
      minSpeed: 1,
      wheelRadius: whlRd,
      stravaClicked: false,
    }
  }

  trackCursor(e) {
    const bikeWidth = (this.state.wheelRadius * 4) + 15;
    const bikeHeight = (this.state.wheelRadius * 2) + 15;
    const bikeY = e.pageY - this.refs.canvas.offsetTop;
    const bikeX = e.pageX - (this.refs.canvas.width - this.state.x - bikeWidth);
    
    if ((bikeY >= 15 && bikeY <= 15 + bikeHeight) &&
        (bikeX >= 0 && bikeX <= bikeWidth + this.state.wheelRadius)) {
      document.body.style.cursor = "pointer";
      this.setState({ stravaClicked: true });
    } else {
      document.body.style.cursor = "";
      this.setState({ stravaClicked: false });
    }
  }

  mouseClicked(e) {
    if (this.state.stravaClicked) {
      window.open('https://www.strava.com/athletes/7541135', '_blank');
    }
  }

  resizeCanvas() {
    const canvas = this.refs.canvas;
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvasWidth !== displayWidth ||
        canvasHeight !== displayHeight) {
          canvas.width = displayWidth;
          canvas.height = displayHeight;
        }

    return {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height
    }
  }

  drawFrame(ctx, frontWheel, rearWheel, wheelRadius) {
    ctx.beginPath();
    
    ctx.moveTo(frontWheel.x, frontWheel.y); // frontwheel hub / bottom of fork
    ctx.lineTo(frontWheel.x + 5, frontWheel.y - 20); // top of head tube
    ctx.lineTo(frontWheel.x, frontWheel.y - 20); // front end of handebars (before drops)
    ctx.moveTo(frontWheel.x + 5, frontWheel.y - 15); // Move to top of headtube before starting top tube (slightly lower, because aero)
    ctx.lineTo(rearWheel.x - wheelRadius, frontWheel.y - 15); // back end of top tube / top of seat tube
    ctx.lineTo(rearWheel.x - wheelRadius - 2, rearWheel.y + 2); // Bottom of seat tube / Bottom bracket
    ctx.lineTo(rearWheel.x, rearWheel.y); // back end of chain stays
    ctx.lineTo(rearWheel.x - wheelRadius, frontWheel.y - 15); // front end of seat stays / top of seat tube
    ctx.lineTo(rearWheel.x - wheelRadius + 1, frontWheel.y - 23); // top of seatpost
    ctx.moveTo(rearWheel.x - wheelRadius - 2, rearWheel.y + 2); // Move to bottom bracket before drawing downtube
    ctx.lineTo(frontWheel.x + 5, frontWheel.y - 15); // Top of downtube / top of headtube

    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw dropbars
    ctx.beginPath();
    ctx.arc(frontWheel.x, frontWheel.y - 16, 4, Math.PI * 1.5, Math.PI * 0.5, true);
    ctx.stroke();

    // Draw saddle
    ctx.beginPath(); // Simple triangle
    ctx.moveTo(rearWheel.x - wheelRadius + 5, frontWheel.y - 23); // Top right of saddle
    ctx.lineTo(rearWheel.x - wheelRadius - 5, frontWheel.y - 23); // Top left of saddle
    ctx.lineTo(rearWheel.x - wheelRadius + 3, frontWheel.y - 20); // Bottom of saddle
    ctx.fill();
  }

  draw() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#424242';
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const wheelRadius = this.state.wheelRadius;

    // update
    let newX = this.state.x;

    // change speed depending on what state we're in
    (this.state.moveLeft || this.state.moveRight) && this.setState({ speed: Math.min(this.state.speed + .1, this.state.maxSpeed) });
    this.state.braking && this.setState({ speed: Math.max(this.state.speed - .3, 0) });
    (this.state.slowDownLeft || this.state.slowDownRight) && this.setState({ speed: Math.max(this.state.speed - .1, 0) });

    // Move left/right depending on state
    if (this.state.moveLeft) {
      newX = this.state.x + this.state.speed;
    } else if (this.state.moveRight) {
      newX = this.state.x - this.state.speed;
    } else if (this.state.slowDownLeft) {
      newX = this.state.x + this.state.speed;
      if (this.state.speed === 0) this.setState({ slowDownLeft: false });
    } else if (this.state.slowDownRight) {
      newX = this.state.x - this.state.speed;
      if (this.state.speed === 0) this.setState({ slowDownRight: false });
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    if ((newX + (wheelRadius * 4)) > canvasWidth && (newX + (wheelRadius * 4)) < canvasWidth + (wheelRadius * 4) + 10) { // front wheel going off left edge, draw new bike on rhs
      this.drawBike(ctx, canvasWidth - this.state.x + canvasWidth, canvasHeight - 15, wheelRadius);
    } else if (newX + (wheelRadius * 4) > canvasWidth + (wheelRadius * 4) + 10) { // bike completely off lhs, move bike to rhs
      newX = this.state.x - canvasWidth;
    } else if ((newX - wheelRadius) < 0 && (newX - wheelRadius) > 0 - (wheelRadius * 6) + 10) { // rear wheel going off right edge, draw new bike on lhs
      this.drawBike(ctx, 0 - this.state.x, canvasHeight - 15, wheelRadius);
    } else if ((newX - wheelRadius) < 0 - (wheelRadius * 6) + 10) { // bike completely off rhs, move bike to lhs
      newX = this.state.x + canvasWidth;
    }

    this.setState({ x: newX });

    this.drawBike(ctx, canvasWidth - this.state.x, canvasHeight - 15, wheelRadius);

    window.requestAnimationFrame(() => { this.draw() });
  }

  drawBike(ctx, rearX, rearY, wheelRadius) {
    const rearWheel = {
      x: rearX,
      y: rearY,
      radius: wheelRadius,
      startAngle: 0,
      endAngle: Math.PI * 2
    };

    const frontWheel = {
      x: rearWheel.x - wheelRadius - 20,
      y: rearY,
      radius: wheelRadius,
      startAngle: 0,
      endAngle: Math.PI * 2
    };

    // Draw front wheel
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.arc(frontWheel.x, frontWheel.y, frontWheel.radius, frontWheel.startAngle, frontWheel.endAngle, true);
    ctx.stroke();

    // Draw rear wheel
    ctx.beginPath();
    ctx.lineWidth = 1.5
    ctx.arc(rearWheel.x, rearWheel.y, rearWheel.radius, rearWheel.startAngle, rearWheel.endAngle, true);
    ctx.stroke();

    this.drawFrame(ctx, frontWheel, rearWheel, wheelRadius);
  }

  handleKeyPress(e) {
    switch(e.keyCode) {
      case 37:
        if (this.state.moveRight || this.state.slowDownRight) {
          this.setState({ braking: true });
        } else {
          this.setState({ moveLeft: true, braking: false, slowDownLeft: false });
        }
        break;
      case 39:
        if (this.state.moveLeft || this.state.slowDownLeft) {
          this.setState({ braking: true });
        } else {
          this.setState({ moveRight: true, braking: false, slowDownRight: false });
        }
        break;
      default:
        break;
    }
  }

  handleKeyUp(e) {
    switch(e.keyCode) {
      case 37:
        this.setState({ moveLeft: false, slowDownLeft: true, braking: false });
        break;
      case 39:
        this.setState({ moveRight: false, slowDownRight: true, braking: false });
        break;
      default:
        break;
    }
  }

  componentWillMount() {
    document.addEventListener("keydown", (e) => { this.handleKeyPress(e) });
    document.addEventListener("keyup", (e) => { this.handleKeyUp(e) });
    document.addEventListener("mousemove", (e) => { this.trackCursor(e) });
    document.addEventListener("click", (e) => { this.mouseClicked(e) });
    window.addEventListener("resize", () => { this.resizeCanvas() });
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", (e) => { this.handleKeyPress(e) });
    document.removeEventListener("keyup", (e) => { this.handleKeyUp(e) });
    document.removeEventListener("mousemove", (e) => { this.trackCursor(e) });
    document.removeEventListener("click", (e) => { this.mouseClicked(e) });
    window.removeEventListener("resize", () => { this.resizeCanvas() });
  }

  componentDidMount() {
    this.resizeCanvas();
    this.draw();
  }

  render() {
    return (
      <canvas
        id="Bike"
        ref="canvas"
      >
      </canvas>
    );
  }
}

export default Bike;

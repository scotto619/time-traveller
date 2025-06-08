export class AnalogueClock {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.radius = this.canvas.height / 2;
    this.canvas.width = this.canvas.height;
    this.ctx.translate(this.radius, this.radius);
    this.radius = this.radius * 0.90;
    this.hour = 3;
    this.minute = 0;
    this.dragging = null;

    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));

    this.drawClock();
  }

  drawClock() {
    this.ctx.clearRect(-this.radius, -this.radius, this.canvas.width, this.canvas.height);
    this.drawFace();
    this.drawNumbers();
    this.drawTime();
  }

  drawFace() {
    let ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    let grad = ctx.createRadialGradient(0, 0, this.radius * 0.95, 0, 0, this.radius * 1.05);
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, 'white');
    grad.addColorStop(1, '#333');
    ctx.strokeStyle = grad;
    ctx.lineWidth = this.radius * 0.1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.05, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
  }

  drawNumbers() {
    let ang;
    let num;
    let ctx = this.ctx;
    ctx.font = this.radius * 0.15 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (num = 1; num <= 12; num++) {
      ang = num * Math.PI / 6;
      ctx.rotate(ang);
      ctx.translate(0, -this.radius * 0.85);
      ctx.rotate(-ang);
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, this.radius * 0.85);
      ctx.rotate(-ang);
    }
  }

  drawTime() {
    let hour = this.hour % 12;
    hour = (hour * Math.PI / 6) + (this.minute * Math.PI / (6 * 60));
    this.drawHand(hour, this.radius * 0.5, this.radius * 0.07, 'hour');
    let minuteAngle = (this.minute * Math.PI / 30);
    this.drawHand(minuteAngle, this.radius * 0.8, this.radius * 0.07, 'minute');
  }

  drawHand(pos, length, width, type) {
    let ctx = this.ctx;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.strokeStyle = type === this.dragging ? '#f00' : '#000';
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
  }

  angleFromCoords(x, y) {
    let angle = Math.atan2(y, x);
    if (angle < 0) angle += 2 * Math.PI;
    return angle;
  }

  onMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - this.canvas.width / 2;
    const y = e.clientY - rect.top - this.canvas.height / 2;
    const angle = this.angleFromCoords(x, y);

    const minuteAngle = this.minute * Math.PI / 30;
    const hourAngle = (this.hour % 12) * Math.PI / 6 + (this.minute * Math.PI / (6 * 60));

    const diffMin = Math.abs(angle - minuteAngle);
    const diffHour = Math.abs(angle - hourAngle);

    if (diffMin < 0.4) {
      this.dragging = 'minute';
    } else if (diffHour < 0.4) {
      this.dragging = 'hour';
    }
  }

  onMouseMove(e) {
    if (!this.dragging) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - this.canvas.width / 2;
    const y = e.clientY - rect.top - this.canvas.height / 2;
    const angle = this.angleFromCoords(x, y);

    if (this.dragging === 'minute') {
      this.minute = Math.round((angle * 30) / Math.PI) % 60;
    } else if (this.dragging === 'hour') {
      const rawHour = (angle * 6) / Math.PI;
      this.hour = Math.floor(rawHour / 5);
    }

    this.drawClock();
  }

  onMouseUp(e) {
    this.dragging = null;
  }
}

window.AnalogueClock = AnalogueClock;

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
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    const grad = ctx.createRadialGradient(0, 0, this.radius * 0.95, 0, 0, this.radius * 1.05);
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
    const ctx = this.ctx;
    ctx.font = this.radius * 0.15 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (let num = 1; num <= 12; num++) {
      const ang = num * Math.PI / 6;
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
    const hourAngle = ((this.hour % 12) * Math.PI / 6) + (this.minute * Math.PI / (6 * 60));
    const minuteAngle = this.minute * Math.PI / 30;
    this.drawHand(hourAngle, this.radius * 0.5, this.radius * 0.07, 'hour');
    this.drawHand(minuteAngle, this.radius * 0.8, this.radius * 0.07, 'minute');
  }

  drawHand(pos, length, width, type) {
    const ctx = this.ctx;
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

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left - this.canvas.width / 2,
      y: e.clientY - rect.top - this.canvas.height / 2
    };
  }

  pointToHandDistance(mouse, angle, length) {
    const tipX = Math.sin(angle) * -length;
    const tipY = Math.cos(angle) * -length;

    const dx = tipX;
    const dy = tipY;
    const lengthSquared = dx * dx + dy * dy;

    const t = ((mouse.x * dx) + (mouse.y * dy)) / lengthSquared;
    const tClamped = Math.max(0, Math.min(1, t));

    const closestX = tClamped * dx;
    const closestY = tClamped * dy;

    const distX = mouse.x - closestX;
    const distY = mouse.y - closestY;

    return Math.sqrt(distX * distX + distY * distY);
  }

  onMouseDown(e) {
    const mouse = this.getMousePos(e);
    const hourAngle = ((this.hour % 12) * Math.PI / 6) + (this.minute * Math.PI / (6 * 60));
    const minuteAngle = this.minute * Math.PI / 30;

    const hourDist = this.pointToHandDistance(mouse, hourAngle, this.radius * 0.5);
    const minuteDist = this.pointToHandDistance(mouse, minuteAngle, this.radius * 0.8);

    const threshold = 20;
    if (minuteDist < hourDist && minuteDist < threshold) {
      this.dragging = 'minute';
    } else if (hourDist < threshold) {
      this.dragging = 'hour';
    }
  }

  onMouseMove(e) {
    if (!this.dragging) return;
    const mouse = this.getMousePos(e);
    const angle = Math.atan2(mouse.x, -mouse.y);
    if (this.dragging === 'minute') {
      this.minute = Math.round((angle * 30) / Math.PI) % 60;
    } else if (this.dragging === 'hour') {
      let rawHour = (angle * 6) / Math.PI;
      rawHour = rawHour < 0 ? rawHour + 72 : rawHour;
      this.hour = Math.floor(rawHour / 6);
    }
    this.drawClock();
  }

  onMouseUp(e) {
    this.dragging = null;
  }
}

window.AnalogueClock = AnalogueClock;

const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 2048, 2048 ],
  pixelsPerInch: 300
};

const sketch = () => {
  const margin = 120;
  const cols = 8;
  const rows = cols;
  
  return ({ context, width, height }) => {
    context.fillStyle = 'rgb(255, 253, 248)';
    context.fillRect(0, 0, width, height);

    const gridWidth = width - 2 * margin;
    const gridHeight = height - 2 * margin;

    context.fillStyle = 'hsl(0, 0%, 98%)';
    context.fillRect(margin, margin, gridWidth, gridHeight);

    const tileWidth = gridWidth / cols;
    const tileHeight = gridHeight / rows;

    const colorOne = 'hsl(0, 100%, 50%)';
    const colorTwo = 'hsl(240, 100%, 50%)';
    const color = [ colorOne, colorTwo ];

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const tilePosX = margin + tileWidth * i;
        const tilePosY = margin + tileHeight * j;

        context.lineWidth = 2;
        context.strokeRect(tilePosX, tilePosY, tileWidth, tileHeight);

        context.save();

        const truchetTiles = new TruchetTile(tilePosX, tilePosY, tileWidth, tileHeight);
        truchetTiles.draw(context, color);

        context.restore();
      }
    }
  };
};

canvasSketch(sketch, settings);

class TruchetTile {
  constructor(posX, posY, tileWidth, tileHeight) {
    this.posX = posX;
    this.posY = posY;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.calculateTiles();
  }

  calculateTiles = () => {
    this.arcRadius = this.tileWidth / 2;
    this.offset = (this.tileWidth - this.arcRadius) / 2;
    this.centerX = this.tileWidth / 2;
    this.centerY = this.tileHeight / 2;
  }

  applyTileStyle = (context, strokeWeight) => {
    context.fillStyle = null;
    context.lineWidth = strokeWeight;
    context.lineCap = 'square';
    context.lineJoin = 'round';
  }

  applyStrokeColor = (context, color) => {
    context.strokeStyle = color;
  }

  draw = (context, color) => {
    context.translate(this.posX, this.posY);

    const strokeWeight = 32;
    this.applyTileStyle(context, strokeWeight);

    const tileTypes = [
      this.drawArcTileRB,
      this.drawArcTileBR,
      this.drawArcTileInvRB,
      this.drawArcTileInvBR,
      this.drawLineTileRB,
      this.drawLineTileBR
    ];

    const randomTileTypeIndex = Math.floor(Math.random() * tileTypes.length);

    tileTypes[randomTileTypeIndex].call(this, context, color);
  }

  drawArcTileRB = (context, color) => {
    this.applyStrokeColor(context, color[0]);
    context.beginPath();
    context.arc(0, 0, this.arcRadius, 0, Math.PI / 2);
    context.stroke();

    this.applyStrokeColor(context, color[1]);
    context.beginPath();
    context.arc(this.tileWidth, this.tileHeight, this.arcRadius, Math.PI, 3 * Math.PI / 2);
    context.stroke();
  }

  drawArcTileBR = (context, color) => {
    this.applyStrokeColor(context, color[1]);
    context.beginPath();
    context.arc(0, 0, this.arcRadius, 0, Math.PI / 2);
    context.stroke();

    this.applyStrokeColor(context, color[0]);
    context.beginPath();
    context.arc(this.tileWidth, this.tileHeight, this.arcRadius, Math.PI, 3 * Math.PI / 2);
    context.stroke();
  }

  drawArcTileInvRB = (context, color) => {
    this.applyStrokeColor(context, color[0]);
    context.beginPath();
    context.arc(this.tileWidth, 0, this.arcRadius, Math.PI / 2, Math.PI);
    context.stroke();

    this.applyStrokeColor(context, color[1]);
    context.beginPath();
    context.arc(0, this.tileHeight, this.arcRadius, 3 * Math.PI / 2, Math.PI * 2);
    context.stroke();
  }

  drawArcTileInvBR = (context, color) => {
    this.applyStrokeColor(context, color[1]);
    context.beginPath();
    context.arc(this.tileWidth, 0, this.arcRadius, Math.PI / 2, Math.PI);
    context.stroke();

    this.applyStrokeColor(context, color[0]);
    context.beginPath();
    context.arc(0, this.tileHeight, this.arcRadius, 3 * Math.PI / 2, Math.PI * 2);
    context.stroke();
  }

  drawLineTileRB = (context, color) => {
    this.applyStrokeColor(context, color[0]);
    context.beginPath();
    context.moveTo(this.centerX, 0);
    context.lineTo(this.centerX, this.tileHeight);
    context.stroke();

    this.applyStrokeColor(context, color[1]);
    context.beginPath();
    context.moveTo(0, this.centerY);
    context.lineTo(this.tileWidth, this.centerY);
    context.stroke();
  }

  drawLineTileBR = (context, color) => {
    this.applyStrokeColor(context, color[1]);
    context.beginPath();
    context.moveTo(this.centerX, 0);
    context.lineTo(this.centerX, this.tileHeight);
    context.stroke();

    this.applyStrokeColor(context, color[0]);
    context.beginPath();
    context.moveTo(0, this.centerY);
    context.lineTo(this.tileWidth, this.centerY);
    context.stroke();
  }
}
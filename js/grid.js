/**
 * Class for working with game canvas
 * @constructor
 */
function Grid() {
  this.canvas = document.querySelector(".gameCanvas");
  this.canvasCx = this.canvas.getContext("2d");

  this.isRunning = 0;
  this.drawing = {
    status: false,
    setValue: null
  };
  this.currInterval = null;

  this.data = new GridData(this);
  this.bindEvents();
}

/**
 * Bind canvas listeners
 */
Grid.prototype.bindEvents = function() {
  if(!this.canvas) {
    return;
  }

  this.canvas.addEventListener("mousedown", this.onCanvasDown.bind(this));
  this.canvas.addEventListener("mousemove", this.onCanvasMove.bind(this));
  this.canvas.addEventListener("mouseup", this.onCanvasUp.bind(this));
};

/**
 * Handle canvas mouse down
 * @param ev
 */
Grid.prototype.onCanvasDown = function(ev) {
  if(this.isRunning) {
    return;
  }
  ev.preventDefault();

  this.drawing.status = true;

  var xy = this._getEventXY(ev);
  var currCellValue = this.data.get(xy.x, xy.y);
  // toggle value
  this.drawing.setValue = 1 - currCellValue;
  // draw in case up and down without move
  this.data.setAndDraw(xy.x, xy.y, this.drawing.setValue);
};

/**
 * Handle canvas mouse move event (change current cell)
 * @param ev
 */
Grid.prototype.onCanvasMove = function(ev) {
  if(!this.drawing.status || this.isRunning) {
    return;
  }

  var xy = this._getEventXY(ev);
  this.data.setAndDraw(xy.x, xy.y, this.drawing.setValue);
};

/**
 * Handle canvas mouse up event
 * @param ev
 */
Grid.prototype.onCanvasUp = function(ev) {
  this.drawing.status = false;
};

/**
 * Init new grid
 */
Grid.prototype.initGrid = function() {
  if(this.isRunning) {
    return;
  }

  this.data.init();
};

/**
 * Start running and looping
 */
Grid.prototype.start = function(finishCb) {
  if(this.isRunning) {
    return;
  }

  // Make callback for finish
  var nextStepFinishCb = function() {
    this.stop();
    finishCb();
  }.bind(this);

  this.isRunning = true;

  this.nextStep(nextStepFinishCb);
  this.currInterval = setInterval(function() {
    this.nextStep(nextStepFinishCb);
  }.bind(this), 500);
};

/**
 * Stop running current interval
 */
Grid.prototype.stop = function() {
  clearInterval(this.currInterval);
  this.isRunning = false;
};

/**
 * Start next step with optional callback for no changes event
 */
Grid.prototype.nextStep = function(lastStepCb) {
  this.data.nextStep(lastStepCb);
};

/**
 * Make a new grid with randomized values
 */
Grid.prototype.randomize = function() {
  this.stop();
  this.data.randomize();
};

/**
 * Set number of cells for x and y
 * @param width
 * @param height
 */
Grid.prototype.setDimensions = function(width, height) {
  if(this.isRunning) {
    return;
  }

  this.width = width;
  this.height = height;

  this.cellSize = this.canvas.width / width;
  this.canvas.height = height * this.cellSize;
};


/**
 * Private functions
 */


/**
 * Get x y for event
 * @private
 */
Grid.prototype._getEventXY = function(ev) {
  var x = (ev.offsetX || ev.layerX);
  var y = (ev.offsetY || ev.layerY);

  x = Math.floor(x / this.cellSize);
  y = Math.floor(y / this.cellSize);
  return {x: x, y: y};
};


/**
 * Clear all canvas
 * @private
 */
Grid.prototype._clear = function() {
  this.canvasCx.clearRect(0, 0, this.height * this.cellSize, this.width * this.cellSize);
};

/**
 * Draw one cell with stroke and optional fill
 * @param x
 * @param y
 * @param fill
 * @private
 */
Grid.prototype._draw = function(x, y, fill) {
  // Fill rect
  this.canvasCx.fillStyle = fill ? "#333" : "#fff";
  this.canvasCx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
  // Fill stroke
  this.canvasCx.strokeStyle = "#333";
  this.canvasCx.lineWidth = 1;
  this.canvasCx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
};

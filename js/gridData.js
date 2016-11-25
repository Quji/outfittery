/**
 * Class for game data
 * @constructor
 */
function GridData(grid) {
  this.grid = grid;
  this.data = [];
  this.tempData = [];
}

/**
 * Init function, that cleans with null
 */
GridData.prototype.init = function() {
  this.grid._clear();

  for (var x = 0; x < this.grid.width; x++) {
    for (var y = 0; y < this.grid.height; y++) {
      this.setAndDraw(x, y, 0);
    }
  }
};

/**
 * Randomize all values with 1/3 success chance
 */
GridData.prototype.randomize = function() {
  for (var x = 0; x < this.grid.width; x++) {
    for (var y = 0; y < this.grid.height; y++) {
      var newValue = Math.round(Math.random() * 3) === 0;
      this.setAndDraw(x, y, newValue);
    }
  }
};

/**
 * Redraw all cells (after setting new data)
 */
GridData.prototype.redraw = function() {
  for (var x = 0; x < this.grid.width; x++) {
    for (var y = 0; y < this.grid.height; y++) {
      this.setAndDraw(x, y, this.data[x][y]);
    }
  }
};

/**
 * Makes new data and redraw grid
 */
GridData.prototype.nextStep = function(lastStepCb) {
  var changes = 0;

  for (var x = 0; x < this.grid.width; x++) {
    for (var y = 0; y < this.grid.height; y++) {
      var neighbours = this._calcNeighbours(x, y);
      switch (neighbours) {
        default:
          this.setTemp(x, y, 0);
          break;
        case 2:
          this.setTemp(x, y, this.data[x][y]);
          break;
        case 3:
          this.setTemp(x, y, 1);
          break;
      }

      if(this.tempData[x][y] !== this.data[x][y]) {
        changes++;
      }
    }
  }
  // Append new data
  this.data = this.tempData;
  this.tempData = [];

  this.redraw();

  // Check for infinitive looping
  if(changes === 0 && lastStepCb) {
    lastStepCb();
  }
};

/**
 * Set and draw value to grid
 * @param x
 * @param y
 * @param value
 */
GridData.prototype.setAndDraw = function(x, y, value) {
  this.data[x] = this.data[x] || [];
  this.data[x][y] = value;
  this.grid._draw(x, y, value);
};

/**
 * Set temp value before redraw
 * @param x
 * @param y
 * @param value
 */
GridData.prototype.setTemp = function(x, y, value) {
  this.tempData[x] = this.tempData[x] || [];
  this.tempData[x][y] = value;
};

/**
 * Get value
 * @param x
 * @param y
 */
GridData.prototype.get = function(x, y) {
  return this.data[x][y];
};

/**
 * Game rules
 * @param x
 * @param y
 * @returns {number}
 * @private
 */
GridData.prototype._calcNeighbours  = function(x, y) {
  var k = 0;

  // Check all cells around
  for (var checkX = x - 1; checkX <= x + 1; checkX++) {
    for (var checkY = y - 1; checkY <= y + 1; checkY++) {
      if(typeof this.data[checkX] === "undefined") {
        continue;
      }
      k += this.data[checkX][checkY];
    }
  }
  // exclude current cell
  k = k - this.data[x][y];

  return k
};

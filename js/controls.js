/**
 * Handle all controls on page
 * @constructor
 */
function Controls() {
  this.startBtn = document.querySelector(".startBtn");
  this.stopBtn = document.querySelector(".stopBtn");
  this.stepBtn = document.querySelector(".stepBtn");
  this.rndBtn = document.querySelector(".randomizeBtn");

  this.widthInput = document.querySelector(".widthInput");
  this.heightInput = document.querySelector(".heightInput");

  this.grid = new Grid();

  this.bindEvents();
  // Read default values
  this.onInputBlur();
}

/**
 * Bind buttons and input listeners
 */
Controls.prototype.bindEvents = function() {
  this.startBtn.addEventListener("click", this.onStartClick.bind(this));
  this.stopBtn.addEventListener("click", this.onStopClick.bind(this));
  this.stepBtn.addEventListener("click", this.onStepClick.bind(this));
  this.rndBtn.addEventListener("click", this.onRandomizeClick.bind(this));

  this.widthInput.addEventListener("blur", this.onInputBlur.bind(this));
  this.heightInput.addEventListener("blur", this.onInputBlur.bind(this));
};

/**
 * Handle start button click
 */
Controls.prototype.onStartClick = function() {
  var finishCb = function() {
    this.enableStarts();
  }.bind(this);

  this.grid.start(finishCb);
  this.startBtn.setAttribute("disabled", "disabled");
  this.stopBtn.removeAttribute("disabled");
  // block inputs
  this.widthInput.setAttribute("disabled", "disabled");
  this.heightInput.setAttribute("disabled", "disabled");
};

/**
 * Handle stop button click
 */
Controls.prototype.onStopClick = function() {
  this.enableStarts();
  this.grid.stop();
};

/**
 * Make start button enabled and stop button disabled
 */
Controls.prototype.enableStarts = function() {
  this.startBtn.removeAttribute("disabled");
  this.stopBtn.setAttribute("disabled", "disabled");
  this.widthInput.removeAttribute("disabled");
  this.heightInput.removeAttribute("disabled");
};

/**
 * Handle step button click
 */
Controls.prototype.onStepClick = function() {
  this.enableStarts();
  this.grid.stop();
  this.grid.nextStep();
};

/**
 * Handle randomize button click
 */
Controls.prototype.onRandomizeClick = function() {
  this.enableStarts();
  this.grid.stop();
  this.grid.randomize();
};

/**
 * Handle inputs blur
 */
Controls.prototype.onInputBlur = function() {
  var width = parseInt(this.widthInput.value);
  var height = parseInt(this.heightInput.value);

  this.grid.setDimensions(width, height);
  this.grid.initGrid();
};

new Controls();

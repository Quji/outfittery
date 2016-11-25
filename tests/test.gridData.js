
describe('Grid data', function() {

  it('should set data', function() {
    var testGridData = new GridData(new MockGrid());
    testGridData.setAndDraw(0, 0, 1);
    expect(testGridData.get(0, 0)).to.be(1);
  });

  it('should process nextStep', function() {
    // from
    // - - -
    // 1 1 1
    // - - -
    // to
    // - 1 -
    // - 1 -
    // - 1 -
    var testGridData = new GridData(new MockGrid());

    testGridData.init();
    testGridData.setAndDraw(1, 0, 1);
    testGridData.setAndDraw(1, 1, 1);
    testGridData.setAndDraw(1, 2, 1);

    testGridData.nextStep();

    expect(testGridData.get(1, 0)).to.be(0);
    expect(testGridData.get(1, 2)).to.be(0);

    expect(testGridData.get(0, 1)).to.be(1);
    expect(testGridData.get(1, 1)).to.be(1);
    expect(testGridData.get(2, 1)).to.be(1);
  });

  it('should call finish callback', function() {
    var testGridData = new GridData(new MockGrid());
    testGridData.init();

    var cbCalls = 0;
    testGridData.nextStep(function() {
      cbCalls++;
    });

    expect(cbCalls).to.be(1);
  });
});

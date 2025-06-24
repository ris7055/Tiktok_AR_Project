const {BaseNode} = require('../Utils/BaseNode');
const APJS = require('../../../amazingpro');

class CGPeek extends BaseNode {
  constructor() {
    super();
  }

  getOutput(index) {
    return this.inputs[0]();
  }
}

exports.CGPeek = CGPeek;

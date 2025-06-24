const APJS = require('../../../amazingpro');
const {BaseNode} = require('../Utils/BaseNode');

class CGGetComponentNode extends BaseNode {
  constructor() {
    super();
  }

  getOutput(index) {
    return this.inputs[0]();
  }
}

exports.CGGetComponentNode = CGGetComponentNode;

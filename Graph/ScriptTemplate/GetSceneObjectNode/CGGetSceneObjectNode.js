const APJS = require('../../../amazingpro');
const {BaseNode} = require('../Utils/BaseNode');

class CGGetSceneObjectNode extends BaseNode {
  constructor() {
    super();
  }

  getOutput(index) {
    return this.inputs[0]();
  }
}

exports.CGGetSceneObjectNode = CGGetSceneObjectNode;

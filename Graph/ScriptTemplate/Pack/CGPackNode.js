const {BaseNode} = require('../Utils/BaseNode');
const {GraphUtils} = require('../Utils/GraphUtils');
const APJS = require('../../../amazingpro');

class CGPackNode extends BaseNode {
  constructor() {
    super();
    this.valueType = null;
  }

  getOutput(index) {
    const lastOutput = this.outputs[index];
    if (this.valueType === 'Vector2f') {
      const resultX = this.inputs[0]();
      const resultY = this.inputs[1]();
      this.outputs[index] = GraphUtils.getUpdatedValue('Vector2f', lastOutput, resultX, resultY);
    } else if (this.valueType === 'Vector3f') {
      const resultX = this.inputs[0]();
      const resultY = this.inputs[1]();
      const resultZ = this.inputs[2]();
      this.outputs[index] = GraphUtils.getUpdatedValue('Vector3f', lastOutput, resultX, resultY, resultZ);
    } else if (this.valueType === 'Vector4f') {
      const resultX = this.inputs[0]();
      const resultY = this.inputs[1]();
      const resultZ = this.inputs[2]();
      const resultW = this.inputs[3]();
      this.outputs[index] = GraphUtils.getUpdatedValue('Vector4f', lastOutput, resultX, resultY, resultZ, resultW);
    } else if (this.valueType === 'Quaternionf') {
      const resultX = this.inputs[0]();
      const resultY = this.inputs[1]();
      const resultZ = this.inputs[2]();
      const resultW = this.inputs[3]();
      this.outputs[index] = GraphUtils.getUpdatedValue('Quaternionf', lastOutput, resultX, resultY, resultZ, resultW);
    } else if (this.valueType === 'Rect') {
      const resultX = this.inputs[0]();
      const resultY = this.inputs[1]();
      const resultWidth = this.inputs[2]();
      const resultHeight = this.inputs[3]();
      this.outputs[index] = GraphUtils.getUpdatedValue('Rect', lastOutput, resultX, resultY, resultWidth, resultHeight);
    } else if (this.valueType === 'Color') {
      const resultR = this.inputs[0]();
      const resultG = this.inputs[1]();
      const resultB = this.inputs[2]();
      const resultA = this.inputs[3]();
      this.outputs[index] = GraphUtils.getUpdatedValue('Color', lastOutput, resultR, resultG, resultB, resultA);
    }
    return this.outputs[index];
  }
}

exports.CGPackNode = CGPackNode;

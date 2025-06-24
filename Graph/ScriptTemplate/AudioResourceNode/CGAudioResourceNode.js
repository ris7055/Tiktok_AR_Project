/**
 * @file CGAudioResourceNode.js
 * @author
 * @date 2022/1/28
 * @brief CGAudioResourceNode.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const APJS = require('../../../amazingpro');
const {BaseNode} = require('../Utils/BaseNode');

class CGAudioResourceNode extends BaseNode {
  constructor() {
    super();
    this.audioNode = null;
    this.audioNodeName = 'FileSourceNode';
    this.audioPath = '';
  }

  beforeStart(sys) {
    this.audioPath = this.inputs[0]();
    const path = sys.APJScene.assetManager.rootDir + this.audioPath;
    if (this.audioNode) {
      this.audioNode.setSource(path);
    }
  }

  getOutput(index) {
    return this.audioNode;
  }

  initAudio() {
    if (this.audioGraph) {
      this.audioNode = this.audioGraph.createAudioNode(this.audioNodeName, null);
    }
  }
}
exports.CGAudioResourceNode = CGAudioResourceNode;

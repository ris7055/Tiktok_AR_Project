/**
 * @file CGAudioSpeaker.js
 * @author
 * @date 2021/11/30
 * @brief CGAudioSpeaker.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const APJS = require('../../../amazingpro');
const {BaseNode} = require('../Utils/BaseNode');

class CGAudioSpeaker extends BaseNode {
  constructor() {
    super();
    this.audioNode = null;
    this.audioNodeName = 'SinkNode';
    this.onlineMusicSpeaker = false;
    this.params = {};
    this.mute = false;
  }

  setInput(index, func) {
    this.inputs[index] = func;
    this.params[index] = Number.MIN_VALUE;
  }

  beforeStart(sys) {
    this.updateParamsValue();
  }

  onUpdate(sys, dt) {
    this.updateParamsValue();
  }

  updateParamsValue() {
    if (!this.audioNode || this.mute) {
      return;
    }
    const oriGain = this.params[1];
    let curGain = this.inputs[1]();
    if (oriGain !== curGain) {
      if (curGain < 0) {
        curGain = 0;
      }
      if (curGain > 100) {
        curGain = 100;
      }
      if (curGain !== oriGain) {
        this.audioNode.gain = curGain / 100.0;
      }
      this.params[1] = curGain;
    }
  }

  initAudio(sys) {
    if (this.audioGraph) {
      const audioGainNode = sys.audioAssembler.getAudioGraph().createAudioNode('GainNode', null);
      audioGainNode.gain = 1;
      this.audioNode = audioGainNode;
      if (this.hasMicphone) {
        const micOutputNode = sys.audioAssembler.getAudioOutputForMic().outputNode;
        this.audioNode.connect(micOutputNode);
        this.mute = true;
        audioGainNode.gain = 0;
      } else if (this.onlineMusicSpeaker) {
        const musicOutputNode = sys.audioAssembler.getAudioOutputForMusic().outputNode;
        this.audioNode.connect(musicOutputNode);
        this.mute = true;
        audioGainNode.gain = 0;
      } else {
        const musicOutputNode = sys.audioAssembler.getAudioOutputForMp3().outputNode;
        this.audioNode.connect(musicOutputNode);
      }
    }
  }
}

exports.CGAudioSpeaker = CGAudioSpeaker;

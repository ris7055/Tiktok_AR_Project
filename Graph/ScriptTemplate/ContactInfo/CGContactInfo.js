/**
 * @file CGContactInfo.js
 * @author Jie Li
 * @date 2023/5/18
 * @brief CGContactInfo.js
 * @copyright Copyright (c) 2023, ByteDance Inc, All Rights Reserved
 */

const {BaseNode} = require('../Utils/BaseNode');
const APJS = require('../../../amazingpro');

class CGContactInfo extends BaseNode {
  constructor() {
    super();
  }

  getOutput(index) {
    const contactInfo = this.inputs[0]();
    if (!contactInfo) {
      return null;
    }
    switch (index) {
      case 0:
        return contactInfo.collidingObject !== null;
      case 1:
        return APJS.transferToAPJSObj(contactInfo.collisionPoint);
      case 2:
        return APJS.transferToAPJSObj(contactInfo.collisionNormal);
      case 3:
        return APJS.transferToAPJSObj(contactInfo.relativeVelocity);
      case 4:
        return APJS.transferToAPJSObj(contactInfo.collidingObject);
      default:
        return null;
    }
  }
}

exports.CGContactInfo = CGContactInfo;

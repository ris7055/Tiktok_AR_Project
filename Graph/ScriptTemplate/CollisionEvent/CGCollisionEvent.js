/**
 * @file CGCollisionEvent.js
 * @author Jie Li
 * @date 2023/5/18
 * @brief CGCollisionEvent.js
 * @copyright Copyright (c) 2023, ByteDance Inc, All Rights Reserved
 */
let GlobalParameters;
const {BaseNode} = require('../Utils/BaseNode');
const {ContactInfo} = require('../Utils/GraphHelper');
/* eslint-disable no-undef */
try {
  ({
    GlobalParameters,
    GlobalParameters: {colliderMap, collisionFinder, pbdSimulator},
  } = require('../../../GlobalParameters'));
} catch (error) {
  console.error('Module GlobalParameters not found:', error.message);
}
/* eslint-enable no-undef */
const APJS = require('../../../amazingpro');
//TODO: Physics system need be completely transferred to APJS
const Amaz = effect.Amaz;

class CGCollisionEvent extends BaseNode {
  constructor() {
    super();
    this.updating = false;
    this.colliderId = -1;
    this.colliderIds = new APJS.Int32Vector();
    this.isCompound = false;
    this.contactInfoArray = [];
    this.contactInfoMapCurrent = new Map();
    this.contactInfoMapPrev = this.contactInfoMapCurrent;
  }

  execute(index) {
    this.updating = true;
    this.eventType = this.inputs[2]();
  }

  updateContactInfo() {
    this.contactInfoArray = [];
    switch (this.eventType) {
      case 'onEnter':
        this.contactInfoMapCurrent.forEach((value, key) => {
          if (!this.contactInfoMapPrev.has(key)) {
            this.contactInfoArray.push(value);
          }
        });
        break;
      case 'onStay':
        this.contactInfoMapCurrent.forEach((value, key) => {
          if (this.contactInfoMapPrev.has(key)) {
            this.contactInfoArray.push(value);
          }
        });
        break;
      case 'onExit':
        this.contactInfoMapPrev.forEach((value, key) => {
          if (!this.contactInfoMapCurrent.has(key)) {
            this.contactInfoArray.push(value);
          }
        });
        break;
      default:
        break;
    }
  }

  onUpdate(sys, deltatime) {
    if (!this.updating) {
      return;
    }

    // Due to the running sequence of this CollisionEvent node and the PBDSystem:
    // CollisionEvent.onUpdate -> PBDSystem.onLateUpdate
    // This node always reports the collision info of the previous frame.
    if (this.colliderId >= 0) {
      // sanity check for the collider id of last frame
      const nContact = APJS.Physics3D.getCollisionFinder().colliderCurrentFrameContactsCount(this.colliderId);
      const contactInfoList = new effect.Amaz.Vector();
      for (let i = 0; i < nContact; i++) {
        contactInfoList.pushBack(new effect.Amaz.AMGContactInfo());
      }
      APJS.Physics3D.getCollisionFinder()
        .getNative()
        .getColliderCurrentFrameContactInfoList(this.colliderId, contactInfoList);

      this.contactInfoMapCurrent = new Map();
      for (let i = 0; i < nContact; i++) {
        const id0 = contactInfoList.get(i).colliderId0;
        const id1 = contactInfoList.get(i).colliderId1;
        const normal = contactInfoList.get(i).normal;

        const hitPoint = contactInfoList.get(i).hitPoint1;

        const collider0 = APJS.Physics3D.getInstance().colliderMap.get(id0);
        const collider1 = APJS.Physics3D.getInstance().colliderMap.get(id1);

        if (!collider0 || !collider1) {
          continue;
        }

        let vel0 = new effect.Amaz.Vector3f(0, 0, 0);
        if (collider0.rigidBody && collider0.rigidBody.bodyId >= 0) {
          vel0 = APJS.Physics3D.getPbdSimulator().getNative().getRigidBodyVelocity(collider0.bodyId);
        }
        let vel1 = new effect.Amaz.Vector3f(0, 0, 0);
        if (collider1.rigidBody && collider1.rigidBody.bodyId >= 0) {
          vel1 = APJS.Physics3D.getPbdSimulator().getNative().getRigidBodyVelocity(collider1.bodyId);
        }

        let collidingObj = collider1.entity;
        let collidingId = id1;
        if (this.colliderId === id1) {
          collidingObj = collider0.entity;
          collidingId = id0;
        }
        const contactInfo = new ContactInfo(hitPoint, normal, vel0.sub(vel1), collidingObj);
        this.contactInfoMapCurrent.set(collidingId, contactInfo);
      }

      this.updateContactInfo();
      this.contactInfoMapPrev = this.contactInfoMapCurrent;

      if (this.nexts[0] && this.contactInfoArray.length > 0) {
        this.nexts[0]();
      }
    } else if (this.isCompound) {
      this.contactInfoMapCurrent = new Map();
      for (let i = 0; i < this.colliderIds.size(); i++) {
        const id = this.colliderIds.get(i);

        // sanity check for the collider id of last frame
        const nContact = APJS.Physics3D.getCollisionFinder().colliderCurrentFrameContactsCount(id);
        const contactInfoList = new effect.Amaz.Vector();
        for (let i = 0; i < nContact; i++) {
          contactInfoList.pushBack(new effect.Amaz.AMGContactInfo());
        }
        APJS.Physics3D.getCollisionFinder()
          .getNative()
          .getColliderCurrentFrameContactInfoList(id, contactInfoList);

        for (let i = 0; i < nContact; i++) {
          const id0 = contactInfoList.get(i).colliderId0;
          const id1 = contactInfoList.get(i).colliderId1;
          const normal = contactInfoList.get(i).normal;

          const hitPoint = contactInfoList.get(i).hitPoint1;

          const collider0 = APJS.Physics3D.getInstance().colliderMap.get(id0);
          const collider1 = APJS.Physics3D.getInstance().colliderMap.get(id1);

          if (!collider0 || !collider1) {
            continue;
          }

          let vel0 = new effect.Amaz.Vector3f(0, 0, 0);
          if (collider0.rigidBody && collider0.rigidBody.bodyId >= 0) {
            vel0 = APJS.Physics3D.getPbdSimulator().getNative().getRigidBodyVelocity(collider0.bodyId);
          }
          let vel1 = new effect.Amaz.Vector3f(0, 0, 0);
          if (collider1.rigidBody && collider1.rigidBody.bodyId >= 0) {
            vel1 = APJS.Physics3D.getPbdSimulator().getNative().getRigidBodyVelocity(collider1.bodyId);
          }

          let collidingObj = collider1.entity;
          let collidingId = id1;
          if (id === id1) {
            collidingObj = collider0.entity;
            collidingId = id0;
          }
          const contactInfo = new ContactInfo(hitPoint, normal, vel0.sub(vel1), collidingObj);
          this.contactInfoMapCurrent.set(collidingId, contactInfo);
        }
      }

      this.updateContactInfo();
      this.contactInfoMapPrev = this.contactInfoMapCurrent;

      if (this.nexts[0] && this.contactInfoArray.length > 0) {
        this.nexts[0]();
      }
    }

    // Obtain the collider object again in case the corresponding input is changed.
    const object = this.inputs[1]();
    let newColliderId = -1;
    let newColliderIds = new APJS.Int32Vector();
    let newIsCompound = false;
    if (object && object.isInstanceOf('JSScriptComponent') && object.path.endsWith('Collider.js')) {
      const collider = object.getScript().ref;
      newColliderId = collider.colliderId;
      newIsCompound = collider.isCompound;
      newColliderIds = collider.colliderIds;
    }

    if (this.colliderId !== newColliderId) {
      // update the focus if new collider is different from the old one
      APJS.Physics3D.getCollisionFinder().addColliderCollisionEventFocus(newColliderId);
      APJS.Physics3D.getCollisionFinder().removeColliderCollisionEventFocus(this.colliderId);
    }
    if (newIsCompound !== this.isCompound) {
      for (let i = 0; i < newColliderIds.size(); i++) {
        APJS.Physics3D.getCollisionFinder().addColliderCollisionEventFocus(newColliderIds.get(i));
      }
      for (let i = 0; i < this.colliderIds.size(); i++) {
        APJS.Physics3D.getCollisionFinder().removeColliderCollisionEventFocus(this.colliderIds.get(i));
      }
    }

    this.colliderId = newColliderId;
    this.isCompound = newIsCompound;
    this.colliderIds = newColliderIds;
  }

  getOutput(index) {
    return this.contactInfoArray;
  }
}

exports.CGCollisionEvent = CGCollisionEvent;

import { Quaternion, Vector3 } from 'three';

import { KEYS } from '@/constants/keys';
import InputController from '@/utils/InputController';

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

class FirstPersonCamera {
  constructor(camera, domElement, configs) {
    this.camera = camera;
    this.input = new InputController(domElement);
    this.rotation = new Quaternion();
    this.translation = new Vector3(5, configs.playerHeight, 0);
    this.phi = 0;
    this.theta = 0;
    this.headBobActive = false;
    this.headBobTimer = 0;

    this.lookSpeed = configs.lookSpeed;
    this.moveSpeed = configs.moveSpeed;
    this.isBobbingEnabled = configs.bobbing;

    this.update = this.update.bind(this);
    this.updateRotation = this.updateRotation.bind(this);
    this.updateTranslation = this.updateTranslation.bind(this);
    this.updateCamera = this.updateCamera.bind(this);
  }

  update(timeElapsed) {
    this.updateRotation(timeElapsed);
    this.updateTranslation(timeElapsed);
    if (this.isBobbingEnabled) {
      this.updateHeadBob(timeElapsed);
    }
    this.updateCamera(timeElapsed);
    this.input.update(timeElapsed);
  }

  updateRotation(timeElapsed) {
    const xh = this.input.current.mouseXDelta / window.innerWidth;
    const yh = this.input.current.mouseYDelta / window.innerHeight;

    this.phi += -xh * this.lookSpeed;
    this.theta = clamp(
      this.theta + -yh * this.lookSpeed,
      -Math.PI / 3,
      Math.PI / 3
    );

    const qx = new Quaternion();
    qx.setFromAxisAngle(new Vector3(0, 1, 0), this.phi);

    const qz = new Quaternion();
    qz.setFromAxisAngle(new Vector3(1, 0, 0), this.theta);

    const q = new Quaternion();
    q.multiply(qx);
    q.multiply(qz);

    this.rotation.copy(q);
  }

  updateTranslation(timeElapsed) {
    const forwardVelocity = (this.input.key(KEYS.w) ? 1 : 0) + (this.input.key(KEYS.s) ? -1 : 0);
    const strafeVelocity =
      (this.input.key(KEYS.a) ? 1 : 0) + (this.input.key(KEYS.d) ? -1 : 0);

    const qx = new Quaternion();
    qx.setFromAxisAngle(new Vector3(0, 1, 0), this.phi);

    const forward = new Vector3(0, 0, -1);
    forward.applyQuaternion(qx);
    forward.multiplyScalar(forwardVelocity * timeElapsed * this.moveSpeed);

    const left = new Vector3(-1, 0, 0);
    left.applyQuaternion(qx);
    left.multiplyScalar(strafeVelocity * timeElapsed * this.moveSpeed);

    this.translation.add(forward);
    this.translation.add(left);

    if (forwardVelocity !== 0 || strafeVelocity !== 0) {
      this.headBobActive = true;
    }
  }

  updateHeadBob(timeElapsed) {
    if (this.headBobActive) {
      const wavelength = Math.PI;
      const nextStep = 1 + Math.floor(((this.headBobTimer + 0.000001) * 10) / wavelength);
      const nextStepTime = nextStep * wavelength / 10;
      // this.headBobTimer += timeElapsed;
      this.headBobTimer = Math.min(this.headBobTimer + timeElapsed, nextStepTime);

      if (this.headBobTimer === nextStepTime) {
        this.headBobActive = false;
      }
    }
  }

  updateCamera(timeElapsed) {
    this.camera.quaternion.copy(this.rotation);
    this.camera.position.copy(this.translation);
    this.camera.position.y += Math.sin(this.headBobTimer * 15) * 0.2;
  }
}

export default FirstPersonCamera;

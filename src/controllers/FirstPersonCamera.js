import { Quaternion, Vector3 } from 'three';

import { KEYS } from '@/constants/keys';
import InputController from '@/controllers/InputController';
import { clamp } from '@/utils/math';

class FirstPersonCamera {
  constructor(camera, weapon, domElement, configs) {
    this.camera = camera;
    this.weapon = weapon;
    this.input = new InputController(domElement);
    this.rotation = new Quaternion();
    this.translation = new Vector3(5, configs.playerHeight, 0);
    this.defaultFov = configs.fov;
    this.fov = configs.fov;
    this.phi = 0;
    this.theta = 0;
    this.headBobActive = false;
    this.headBobTimer = 0;
    this.headBobPosition = 0;
    this.headBobPositionX = 0;
    this.zoomActive = false;

    this.lookSpeed = configs.lookSpeed;
    this.moveSpeed = configs.moveSpeed;
    this.isBobbingEnabled = configs.bobbing;

    this.update = this.update.bind(this);
    this.updateRotation = this.updateRotation.bind(this);
    this.updateTranslation = this.updateTranslation.bind(this);
    this.updateCamera = this.updateCamera.bind(this);
  }

  update(timeElapsed) {
    this.updateZoom(timeElapsed);
    this.updateRotation(timeElapsed);
    this.updateTranslation(timeElapsed);
    this.updateHeadBob(timeElapsed);
    this.updateCamera(timeElapsed);
    this.input.update(timeElapsed);
  }

  updateZoom(timeElapsed) {
    this.zoomActive = this.input.current.rightButton;
    if (this.zoomActive) {
      this.fov -= timeElapsed * 250;
    } else {
      this.fov += timeElapsed * 250;
    }
    if (this.fov > this.defaultFov) {
      this.fov = this.defaultFov;
    }
    if (this.fov < this.defaultFov - 15) {
      this.fov = this.defaultFov - 15;
    }
  }

  updateRotation() {
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
    const forwardVelocity =
      (this.input.key(KEYS.w) ? 1 : 0) + (this.input.key(KEYS.s) ? -1 : 0);
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
      const nextStep =
        1 + Math.floor(((this.headBobTimer + 0.000001) * 10) / wavelength);
      const nextStepTime = (nextStep * wavelength) / 10;
      this.headBobTimer = Math.min(
        this.headBobTimer + timeElapsed,
        nextStepTime
      );

      if (this.headBobTimer === nextStepTime) {
        this.headBobActive = false;
      }
      this.headBobPosition += Math.sin(this.headBobTimer * 16);
      this.headBobPositionX -= Math.sin(this.headBobTimer * 8);
    }
  }

  updateCamera() {
    this.camera.fov = this.fov;
    this.camera.quaternion.copy(this.rotation);
    this.camera.position.copy(this.translation);
    this.weapon.$el.style.marginBottom = `${-(this.headBobPosition / 1)}px`;
    this.weapon.$el.style.marginLeft = `${-(this.headBobPositionX / 1)}px`;

    this.camera.updateProjectionMatrix();
  }
}

export default FirstPersonCamera;

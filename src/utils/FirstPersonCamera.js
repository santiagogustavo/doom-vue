import { Quaternion, Vector3 } from 'three';
import InputController from '@/utils/InputController';

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

class FirstPersonCamera {
  constructor(camera, domElement) {
    this.camera = camera;
    this.input = new InputController(domElement);
    this.rotation = new Quaternion();
    this.translation = new Vector3();
    this.phi = 0;
    this.theta = 0;
    this.lookSpeed = 1;

    this.update = this.update.bind(this);
    this.updateRotation = this.updateRotation.bind(this);
    this.updateCamera = this.updateCamera.bind(this);
  }

  update(timeElapsedS) {
    this.updateRotation(timeElapsedS);
    this.updateCamera(timeElapsedS);
    this.input.update(timeElapsedS);
  }

  updateRotation(timeElapsedS) {
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

  updateCamera(timeElapsedS) {
    this.camera.quaternion.copy(this.rotation);
  }
}

export default FirstPersonCamera;

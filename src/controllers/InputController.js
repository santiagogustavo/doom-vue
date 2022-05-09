class InputController {
  constructor(domElement) {
    this.initialize();

    domElement.addEventListener('click', () =>
      this.requestPointerLock(domElement)
    );
  }

  initialize() {
    this.current = {
      leftButton: false,
      rightButton: false,
      mouseX: 0,
      mouseY: 0,
      mouseXDelta: 0,
      mouseYDelta: 0,
    };
    this.previous = null;
    this.keys = {};
    this.previousKeys = {};

    this.onMouseDown = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseUp.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.key = this.key.bind(this);
    this.update = this.update.bind(this);
  }

  requestPointerLock(domElement) {
    domElement.requestPointerLock();
    document.addEventListener(
      'pointerlockchange',
      () => this.lockChangeAlert(domElement),
      false
    );
  }

  lockChangeAlert(domElement) {
    if (
      document.pointerLockElement === domElement ||
      document.mozPointerLockElement === domElement
    ) {
      this.addListeners(domElement);
    } else {
      this.removeListeners(domElement);
    }
  }

  addListeners(domElement) {
    domElement.addEventListener('mousedown', this.onMouseDown, false);
    domElement.addEventListener('mouseup', this.onMouseUp, false);
    domElement.addEventListener('mousemove', this.onMouseMove, false);
    domElement.addEventListener('keydown', this.onKeyDown, false);
    domElement.addEventListener('keyup', this.onKeyUp, false);
  }

  removeListeners(domElement) {
    domElement.removeEventListener('mousedown', this.onMouseDown);
    domElement.removeEventListener('mouseup', this.onMouseUp);
    domElement.removeEventListener('mousemove', this.onMouseMove);
    domElement.removeEventListener('keydown', this.onKeyDown);
    domElement.removeEventListener('keyup', this.onKeyUp);
  }

  onMouseDown(e) {
    switch (e.button) {
      case 0: {
        this.current.leftButton = false;
        break;
      }
      case 2: {
        this.current.rightButton = false;
        break;
      }
      default:
        break;
    }
  }

  onMouseUp(e) {
    switch (e.button) {
      case 0: {
        this.current.leftButton = true;
        break;
      }
      case 2: {
        this.current.rightButton = true;
        break;
      }
      default:
        break;
    }
  }

  onMouseMove(e) {
    this.current.mouseX += e.movementX;
    this.current.mouseY += e.movementY;

    if (this.previous === null) {
      this.previous = { ...this.current };
    }

    this.current.mouseXDelta = this.current.mouseX - this.previous.mouseX;
    this.current.mouseYDelta = this.current.mouseY - this.previous.mouseY;
  }

  onKeyDown(e) {
    this.keys[e.keyCode] = true;
  }

  onKeyUp(e) {
    this.keys[e.keyCode] = false;
  }

  key(keyCode) {
    return !!this.keys[keyCode];
  }

  update() {
    this.previous = { ...this.current };
    this.current.mouseXDelta = 0;
    this.current.mouseYDelta = 0;
  }
}

export default InputController;

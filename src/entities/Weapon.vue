<template>
  <div class="player-weapon">
    <img v-if="showMuzzle" class="muzzle" :src="Muzzle" />
    <img class="player-weapon__sprite" :src="Sprite" />
    <audio id="player-weapon__sfx--shoot" :src="ShootSfx"></audio>
  </div>
</template>

<script>
export default {
  name: 'PlayerWeapon',
};
</script>

<script setup>
import { ref, watch, defineExpose } from 'vue';

import PistolIdle from '@/assets/sprites/weapons/pistol/idle.png';
import PistolShoot1 from '@/assets/sprites/weapons/pistol/shoot_1.png';
import PistolShoot2 from '@/assets/sprites/weapons/pistol/shoot_2.png';
import PistolShoot3 from '@/assets/sprites/weapons/pistol/shoot_3.png';
import PistolShoot4 from '@/assets/sprites/weapons/pistol/shoot_4.png';
import Muzzle from '@/assets/sprites/weapons/pistol/muzzle.png';
import ShootSfx from '@/assets/sounds/weapons/pistol/shoot.wav';

import { timeout } from '@/utils/promise';

const animationSpeed = 75;

const setSprite = (frame) => {
  switch (frame) {
    case 0:
      return PistolIdle;
    case 1:
      return PistolShoot1;
    case 2:
      return PistolShoot2;
    case 3:
      return PistolShoot3;
    case 4:
      return PistolShoot4;
    default:
      return undefined;
  }
};

const AnimationState = ref(0);
const Sprite = ref(setSprite(AnimationState.value));
const isAnimationPlaying = ref(false);
const showMuzzle = ref(false);

watch(AnimationState, (next) => {
  Sprite.value = setSprite(next);
});

const shootPlaySfx = () => {
  document.getElementById('player-weapon__sfx--shoot').cloneNode().play();
};

const shootAnimationFrames = () => {
  isAnimationPlaying.value = true;
  timeout(() => {
    showMuzzle.value = true;
    AnimationState.value = 1;
  }, animationSpeed)
    .then(() =>
      timeout(() => {
        showMuzzle.value = false;
        AnimationState.value = 2;
      }, animationSpeed)
    )
    .then(() =>
      timeout(() => {
        AnimationState.value = 3;
      }, animationSpeed)
    )
    .then(() =>
      timeout(() => {
        AnimationState.value = 4;
      }, animationSpeed)
    )
    .then(() =>
      timeout(() => {
        AnimationState.value = 1;
      }, animationSpeed)
    )
    .then(() =>
      timeout(() => {
        isAnimationPlaying.value = false;
        AnimationState.value = 0;
      }, animationSpeed)
    );
};

const shoot = () => {
  if (!isAnimationPlaying.value) {
    shootAnimationFrames();
    shootPlaySfx();
  }
};

defineExpose({ shoot });
</script>

<style lang="scss">
.player-weapon {
  user-select: none;
  position: absolute;
  bottom: -16px;
  width: 400px;
  height: 400px;
  left: calc(50% - 210px - 8px);

  &__sprite {
    margin-top: auto;
    margin-right: auto;
    image-rendering: pixelated;
    height: 100%;
  }
}

.muzzle {
  position: absolute;
  left: calc(50% - 55px);
  width: 150px;
  height: 150px;
  image-rendering: pixelated;
}
</style>

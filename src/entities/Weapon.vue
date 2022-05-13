<template>
  <div :class="className">
    <img v-if="showMuzzle" class="muzzle" :src="Muzzle" />
    <img class="player-weapon__sprite" :src="Sprite" />
  </div>
</template>

<script>
export default {
  name: 'PlayerWeapon',
};
</script>

<script setup>
import { ref, computed, watch, defineExpose } from 'vue';

import PistolIdle from '@/assets/sprites/weapons/pistol/idle.png';
import PistolShoot1 from '@/assets/sprites/weapons/pistol/shoot_1.png';
import PistolShoot2 from '@/assets/sprites/weapons/pistol/shoot_2.png';
import PistolShoot3 from '@/assets/sprites/weapons/pistol/shoot_3.png';
import PistolShoot4 from '@/assets/sprites/weapons/pistol/shoot_4.png';
import Muzzle from '@/assets/sprites/weapons/pistol/muzzle.png';

import { timeout } from '@/utils/promise';

const animationSpeed = 80;

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

const className = computed(
  () => `player-weapon pistol--frame-${AnimationState.value}`
);

watch(AnimationState, (next) => {
  Sprite.value = setSprite(next);
});

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
        isAnimationPlaying.value = false;
        AnimationState.value = 0;
      }, animationSpeed)
    );
};

const shoot = () => {
  if (!isAnimationPlaying.value) {
    console.log('pew');
    shootAnimationFrames();
  }
};

defineExpose({ shoot });
</script>

<style lang="scss">
.player-weapon {
  user-select: none;
  position: absolute;
  bottom: -16px;

  &__sprite {
    margin-top: auto;
    margin-right: auto;
    image-rendering: pixelated;
    height: 100%;
  }
}

.muzzle {
  position: absolute;
  top: -80px;
  left: calc(50% - 14px);
  width: 150px;
  height: 150px;
  image-rendering: pixelated;
}

.pistol {
  &--frame-0 {
    width: 250px;
    height: 250px;
    left: calc(50% - 125px - 8px);
  }
  &--frame-1 {
    width: 325px;
    height: 325px;
    left: calc(50% - 210px - 8px);
  }
  &--frame-2 {
    width: 325px;
    height: 325px;
    left: calc(50% - 150px - 8px);
  }
  &--frame-3 {
    width: 325px;
    height: 325px;
    left: calc(50% - 130px - 8px);
  }
  &--frame-4 {
    width: 325px;
    height: 325px;
    left: calc(50% - 150px - 8px);
  }
}
</style>

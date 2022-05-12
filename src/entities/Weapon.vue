<template>
  <div class="player-weapon">
    <img class="player-weapon__sprite" :src="PistolIdle" />
  </div>
</template>

<script>
export default {
  name: 'PlayerWeapon',
};
</script>

<script setup>
import PistolIdle from '@/assets/sprites/weapons/pistol/idle.png';
</script>

<style lang="scss">
.player-weapon {
  user-select: none;
  position: absolute;
  width: 200px;
  height: 200px;
  bottom: 0;
  /* middle of the screen - sprite offset - bobbing offset */
  left: calc(50% - 110px - 4px);

  &__sprite {
    image-rendering: pixelated;
    height: 100%;
  }
}
</style>

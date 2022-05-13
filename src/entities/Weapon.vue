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
  width: 250px;
  height: 250px;
  bottom: -8px;
  /* middle of the screen - sprite offset - bobbing offset */
  left: calc(50% - 125px - 8px);

  &__sprite {
    image-rendering: pixelated;
    height: 100%;
  }
}
</style>

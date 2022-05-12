<template>
  <Renderer ref="rendererC" antialias resize="window">
    <Scene>
      <div class="crosshair" />
      <Player :renderer="rendererC" />
      <Box ref="meshC" :size="1" :rotation="{ y: Math.PI / 4, z: Math.PI / 4 }">
        <LambertMaterial />
      </Box>
      <PointLight
        :intensity="0.7"
        :position="{ x: 2, y: 10, z: 5 }"
        :shadow-map-size="{ width: 1024, height: 1024 }"
        cast-shadow
      />
      <Plane
        :width="10"
        :height="10"
        :position="{ x: 0, y: 0, z: 0 }"
        :rotation="{ x: -Math.PI / 2, y: 0, z: 0 }"
        receive-shadow
      >
        <PhongMaterial color="#ffffff" />
      </Plane>
    </Scene>
  </Renderer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Box, LambertMaterial, PointLight, Renderer, Scene } from 'troisjs';
import Player from '@/entities/Player.vue';

const rendererC = ref();
const meshC = ref();

onMounted(() => {
  const renderer = rendererC.value;

  const mesh = meshC.value.mesh;
  renderer.onBeforeRender(() => {
    mesh.rotation.x += 0.01;
  });
});
</script>

<style>
body {
  margin: 0;
  overflow: hidden;
}
canvas {
  display: block;
}

.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;

  background: red;
  border-radius: 50%;
}
</style>

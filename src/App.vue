<template>
  <Renderer
    ref="rendererC"
    antialias
    resize="window"
  >
    <Camera ref="cameraC"  :position="{ x: -5, y: playerHeight }" :aspect="aspect" :fov="90" />
    <Scene>
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
import { ref, onBeforeMount, onMounted, onUnmounted, computed } from 'vue';
import { useStore } from 'vuex';
import {
  Box,
  Camera,
  LambertMaterial,
  PointLight,
  Renderer,
  Scene,
} from 'troisjs';
import { Clock } from 'three';
import FirstPersonCamera from '@/utils/FirstPersonCamera';

const clock = new Clock(true);
const store = useStore();

const rendererC = ref();
const cameraC = ref();
const meshC = ref();

const aspect = ref(window.innerWidth / window.innerHeight);
const playerHeight = computed(() => store.getters['Player/getHeight']);
const lookSpeed = computed(() => store.getters['Player/getLookSpeed']);

const updateAspectRatio = () => {
  aspect.value = window.innerWidth / window.innerHeight;
};

onBeforeMount(() => {
  window.addEventListener('resize', updateAspectRatio);
});

onMounted(() => {
  const camera = cameraC.value.camera;
  const renderer = rendererC.value;

  const controls = new FirstPersonCamera(camera, document.body);
  controls.lookSpeed = lookSpeed.value;

  const mesh = meshC.value.mesh;
  renderer.onBeforeRender(() => {
    mesh.rotation.x += 0.01;
    controls.update(clock.getDelta() / 1000)
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', updateAspectRatio);
});
</script>

<style>
body {
  margin: 0;
}
canvas {
  display: block;
}
</style>

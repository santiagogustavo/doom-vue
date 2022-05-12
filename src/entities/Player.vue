<template>
  <Weapon ref="weaponC" />
  <Camera ref="cameraC" :aspect="aspect" />
</template>

<script>
export default {
  name: 'Player',
};
</script>

<script setup>
import {
  ref,
  onBeforeMount,
  onUnmounted,
  computed,
  watch,
  defineProps,
} from 'vue';
import { useStore } from 'vuex';
import { Clock } from 'three';

import FirstPersonCamera from '@/controllers/FirstPersonCamera';
import Weapon from '@/entities/Weapon.vue';

const clock = new Clock(true);
const store = useStore();

const props = defineProps({
  renderer: { type: null, default: undefined },
});

watch(
  () => props.renderer,
  (renderer) => {
    const camera = cameraC.value.camera;
    const weapon = weaponC.value;

    const controls = new FirstPersonCamera(camera, weapon, document.body, {
      fov: fov.value,
      playerHeight: playerHeight.value,
      lookSpeed: lookSpeed.value,
      moveSpeed: moveSpeed.value,
      bobbing: false,
    });

    renderer.onBeforeRender(() => {
      controls.update(clock.getDelta());
    });
  }
);

const cameraC = ref();
const weaponC = ref();

const aspect = ref(window.innerWidth / window.innerHeight);

const fov = computed(() => store.getters['Player/getFov']);
const playerHeight = computed(() => store.getters['Player/getHeight']);
const lookSpeed = computed(() => store.getters['Player/getLookSpeed']);
const moveSpeed = computed(() => store.getters['Player/getMoveSpeed']);

const updateAspectRatio = () => {
  aspect.value = window.innerWidth / window.innerHeight;
};

onBeforeMount(() => {
  window.addEventListener('resize', updateAspectRatio);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateAspectRatio);
});
</script>

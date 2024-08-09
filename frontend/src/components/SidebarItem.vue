<template>
  <RouterLink
    :to="props.route"
    class="p-3 rounded-md transition-colors duration-150"
    :class="{ 'bg-primary text-white font-extrabold': active }"
  >
    {{ props.title }}
  </RouterLink>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";

const route = useRoute();
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
});

const active = computed(() => {
  return route.path === props.route;
});
</script>

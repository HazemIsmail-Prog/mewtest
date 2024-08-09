<template>
  <button :type="type" class="flex items-center justify-center gap-1 h-9 py-1 w-28 rounded-lg text-primary">
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
  },
});
</script>

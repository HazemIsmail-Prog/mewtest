<template>
  <div class="w-full">
    <input
      :id="id"
      :placeholder="placeholder"
      v-model="inputValue"
      :type="type"
      class="mt-1 block w-full px-3 py-1 border border-primary rounded-md shadow-sm focus:outline-none focus:ring"
      :class="{
        'border-gray-300 focus:border-blue-300': !error,
        'border-red-500 focus:border-red-300': error,
      }"
      :required="required"
    />
    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  error: {
    type: String,
  },
  id: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update:modelValue"]);

const inputValue = ref(props.modelValue);

watch(inputValue, (newValue) => {
  emits("update:modelValue", newValue);
});

watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue;
  }
);
</script>

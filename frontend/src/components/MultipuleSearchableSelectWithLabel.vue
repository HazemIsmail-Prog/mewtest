<template>
  <div class="mb-3 w-full">
    <label :for="id" class="block text-sm font-medium text-primary">
      {{ label }}
    </label>
    <div class="relative">
      <button
        :tabindex="isOpen ? -1 : ''"
        @click="handleButtonEvent"
        @focus="handleButtonEvent"
        @mousedown.prevent
        type="button"
        class="mt-1 flex items-center justify-between bg-white w-full px-3 py-2 border border-primary rounded-md shadow-sm focus:outline-none focus:ring"
        :class="{
          'border-gray-300 focus:border-blue-300': !error,
          'border-red-500 focus:border-red-300': error,
        }"
      >
        <div class="truncate">
          <template v-if="selectedOptions.length">
            <span
              v-for="option in selectedOptions"
              :key="option.id"
              class="inline-block bg-primary text-white text-xs px-2 py-1 rounded-full mr-1"
            >
              {{ option.name }}
              <button
                @click.stop="removeOption(option)"
                class="ms-2 text-white focus:outline-none"
              >
                &times;
              </button>
            </span>
          </template>
          <template v-else> --- </template>
        </div>
        <ChevronDown
          class="transition-transform text-primary"
          :class="{ 'rotate-180': isOpen }"
        />
      </button>
      <div
        v-if="isOpen"
        class="absolute z-10 mt-1 w-full p-1 bg-white border rounded-md shadow-lg"
      >
        <input
          v-model="search"
          ref="searchInputRef"
          @keydown.esc="isOpen = false"
          @focus="isOpen = true"
          @blur="closeDropdown"
          @input="handleInput"
          @keydown.down.prevent="onArrowDown"
          @keydown.up.prevent="onArrowUp"
          @keydown.enter.prevent="onEnter"
          class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring"
          :placeholder="$t('Search...')"
        />
        <ul class="max-h-[20rem] overflow-y-auto">
          <li
            @click="toggleOption({ id: null, name: '---' })"
            @mousedown.prevent
            class="cursor-pointer px-3 py-2 flex justify-between"
            :class="{
              'bg-gray-200': focusedIndex.value === -1,
            }"
          >
            ---
          </li>
          <li
            v-for="(option, index) in filteredOptions"
            :key="option.id"
            @click="toggleOption(option)"
            @mousedown.prevent
            class="cursor-pointer px-3 py-2 flex justify-between"
            :class="{
              'bg-gray-200': index === focusedIndex,
              'bg-blue-100': selectedOptionIds.includes(option.id),
            }"
          >
            {{ option.name }}
          </li>
          <li
            v-if="filteredOptions.length === 0"
            class="px-3 py-2 text-gray-500"
          >
            No results found
          </li>
        </ul>
      </div>
    </div>
    <select
      class="hidden"
      :id="id"
      v-model="internalValue"
      ref="selectElement"
      multiple
    >
      <option v-for="option in list" :key="option.id" :value="option.id">
        {{ option.name }}
      </option>
    </select>
    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, watchEffect } from "vue";
import ChevronDown from "vue-material-design-icons/ChevronDown.vue";

const props = defineProps({
  list: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  error: {
    type: String,
  },
  id: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const search = ref("");
const searchInputRef = ref(null);
const selectElement = ref(null);
const filteredOptions = ref(props.list);
const isOpen = ref(false);
const focusedIndex = ref(-1);
const selectedOptionIds = ref([]);
const selectedOptions = ref([]);

const emits = defineEmits(["update:modelValue"]);

const internalValue = ref(props.modelValue);

// Watch for changes in internalValue and emit the update
watch(internalValue, (newValue) => {
  emits("update:modelValue", newValue);
});

// Watch for changes in the modelValue prop and update internalValue
watchEffect(() => {
  internalValue.value = props.modelValue;
  selectedOptionIds.value = props.modelValue;
  selectedOptions.value = props.list.filter((option) =>
    props.modelValue.includes(option.id)
  );
});

const showList = () => {
  search.value = "";
  isOpen.value = true;
  nextTick(() => {
    searchInputRef.value.focus();
  });
};

const handleButtonEvent = (e) => {
  if (e.type === "focus") {
    showList();
  }

  if (e.type === "click") {
    if (isOpen.value) {
      isOpen.value = false;
    } else {
      showList();
    }
  }
};

const handleInput = () => {
  filteredOptions.value = props.list.filter((option) =>
    option.name.toLowerCase().includes(search.value.toLowerCase())
  );
  focusedIndex.value = -1;
};

const toggleOption = (option) => {
  if (selectedOptionIds.value.includes(option.id)) {
    selectedOptionIds.value = selectedOptionIds.value.filter(
      (id) => id !== option.id
    );
  } else {
    selectedOptionIds.value.push(option.id);
  }
  selectedOptions.value = props.list.filter((option) =>
    selectedOptionIds.value.includes(option.id)
  );
  internalValue.value = [...selectedOptionIds.value];
  search.value = "";
//   isOpen.value = false;
  filteredOptions.value = props.list;
};

const removeOption = (option) => {
  selectedOptionIds.value = selectedOptionIds.value.filter(
    (id) => id !== option.id
  );
  selectedOptions.value = props.list.filter((option) =>
    selectedOptionIds.value.includes(option.id)
  );
  internalValue.value = [...selectedOptionIds.value];
};

const onArrowDown = () => {
  if (!isOpen.value) {
    isOpen.value = true;
    return;
  }
  if (focusedIndex.value < filteredOptions.value.length - 1) {
    focusedIndex.value++;
    scrollToFocusedOption();
  }
};

const onArrowUp = () => {
  if (focusedIndex.value > 0) {
    focusedIndex.value--;
    scrollToFocusedOption();
  }
};

const onEnter = () => {
  if (
    focusedIndex.value >= 0 &&
    focusedIndex.value < filteredOptions.value.length
  ) {
    toggleOption(filteredOptions.value[focusedIndex.value]);
  } else if (focusedIndex.value === -1) {
    toggleOption({ id: null, name: "---" });
  }
};

const scrollToFocusedOption = () => {
  nextTick(() => {
    const option = document.querySelectorAll("ul > li")[focusedIndex.value];
    if (option) {
      option.scrollIntoView({ block: "nearest" });
    }
  });
};

watch(
  () => props.list,
  () => {
    filteredOptions.value = props.list;
  }
);

const closeDropdown = () => {
  isOpen.value = false;
};
</script>

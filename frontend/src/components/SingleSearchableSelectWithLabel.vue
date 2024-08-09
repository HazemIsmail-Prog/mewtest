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
          {{ selectedOptionTitle ?? "---" }}
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
            @click="selectOption({ id: null, name: '---' })"
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
            @click="selectOption(option)"
            @mousedown.prevent
            class="cursor-pointer px-3 py-2 flex justify-between"
            :class="{
              'bg-gray-200': index === focusedIndex,
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
    <select class="hidden" :id="id" v-model="internalValue" ref="selectElement">
      <option value="">---</option>
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
    type: [String, Number, null],
    default: null,
  },
});

const search = ref("");
const searchInputRef = ref(null);
const selectElement = ref(null);
const filteredOptions = ref(props.list);
const isOpen = ref(false);
const focusedIndex = ref(-1);
const selectedOptionId = ref(null);
const selectedOptionTitle = ref("---");

const emits = defineEmits(["update:modelValue"]);

const internalValue = ref(props.modelValue);

// Watch for changes in internalValue and emit the update
watch(internalValue, (newValue) => {
  emits("update:modelValue", newValue);
});

// Watch for changes in the modelValue prop and update internalValue
watchEffect(() => {
  internalValue.value = props.modelValue;
  selectedOptionId.value = props.modelValue;
  const selectedOption = props.list.find(
    (option) => option.id === props.modelValue
  );
  selectedOptionTitle.value = selectedOption ? selectedOption.name : "---";
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

const selectOption = (option) => {
  selectedOptionId.value = option.id;
  selectedOptionTitle.value = option.name || "---";
  search.value = "";
  isOpen.value = false;
  filteredOptions.value = props.list;
  internalValue.value = option.id || "";
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
    selectOption(filteredOptions.value[focusedIndex.value]);
  } else if (focusedIndex.value === -1) {
    selectOption({ id: null, name: "---" });
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

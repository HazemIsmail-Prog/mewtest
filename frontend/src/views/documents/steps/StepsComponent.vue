<template>
  <div
    class="flex flex-col gap-0.5 p-2 border border-dashed mb-3 text-primary text-sm border-primary rounded-lg"
  >
    <label class="block font-bold mb-3"> {{ $t("Steps") }} </label>

    <div v-if="steps.length">
      <div
        v-for="(step, index) in steps"
        :key="step.id"
        class="flex items-center gap-2 justify-between p-1 border-b border-primary"
      >
        <label
          v-if="editingStepId !== step.id"
          class="relative flex items-center"
        >
          <input
            @change="updateCompletion(step.id, $event.target.checked)"
            type="checkbox"
            class="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded border border-primary transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary checked:before:bg-primary"
            :checked="step.is_completed"
          />
          <span
            class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100"
          >
            <CheckIcon :size="16" />
          </span>
        </label>
        <form
          v-if="editingStepId === step.id"
          class="flex items-center gap-3 flex-grow"
        >
          <textarea
            v-model="step.action"
            class="p-1 w-full"
            rows="1"
          ></textarea>
          <div class="flex items-center gap-2">
            <FloppyIcon
              @click="saveEdit(step.id)"
              :size="18"
              class="text-primary"
            />
            <CancelIcon @click="cancelEdit" :size="18" class="text-danger" />
          </div>
        </form>
        <div v-else class="flex-grow whitespace-pre-wrap">
          {{ step.action }}
        </div>
        <div v-if="editingStepId !== step.id" class="flex items-center gap-2">
          <PencilIcon
            v-if="confirmingDeleteId !== step.id"
            :size="18"
            @click="startEdit(step.id)"
            class="text-primary"
          />
          <div
            v-if="confirmingDeleteId === step.id"
            class="flex items-center gap-2"
          >
            <CheckIcon
              @click="confirmDelete(index)"
              :size="18"
              class="text-success"
            />
            <CancelIcon @click="cancelDelete" :size="18" class="text-danger" />
          </div>
          <DeleteIcon
            v-else-if="editingStepId !== step.id"
            @click="startDeleteConfirmation(step.id)"
            class="text-red-500"
            :size="18"
          />
        </div>
      </div>
      <textarea
        v-model="newAction"
        @keyup="handleAddKeyup"
        class="p-1 w-full mt-2"
        :placeholder="$t('Add a new action')"
        rows="2"
      ></textarea>
      <p class="text-start">Ctrl+Enter to save</p>
    </div>
    <div v-else class=" text-center p-10">{{ $t('Loading...') }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/axios";
import DeleteIcon from "vue-material-design-icons/Delete.vue";
import CheckIcon from "vue-material-design-icons/Check.vue";
import CancelIcon from "vue-material-design-icons/Cancel.vue";
import PencilIcon from "vue-material-design-icons/Pencil.vue";
import FloppyIcon from "vue-material-design-icons/Floppy.vue";
import { useDocumentStore } from "../store";

const store = useDocumentStore();

const props = defineProps({
  selectedRecordId: {
    type: Number,
    required: true,
  },
});

const steps = ref([]);
const editingStepId = ref(null);
const confirmingDeleteId = ref(null);
const newAction = ref("");
const originalStep = ref(null); // Store original step data

// Fetch steps on component mount
onMounted(() => {
  axios.get(`api/steps/${props.selectedRecordId}`).then((response) => {
    steps.value = response.data.data;
  });
});

const startEdit = (id) => {
  editingStepId.value = id;
  // Store the original data before editing
  const step = steps.value.find((s) => s.id === id);
  originalStep.value = { ...step };
};

const stopEdit = () => {
  editingStepId.value = null;
  originalStep.value = null;
};

const saveEdit = (id) => {
  const stepIndex = steps.value.findIndex((s) => s.id === id);
  if (stepIndex !== -1) {
    const step = steps.value[stepIndex];
    axios
      .put(`api/steps/${step.id}`, {
        action: step.action,
        is_completed: step.is_completed,
      })
      .then((response) => {
        // Replace the old step data with the new data
        steps.value[stepIndex] = response.data.data;
        store.getRecord(props.selectedRecordId);
        stopEdit();
      })
      .catch((error) => {
        console.error("Failed to save edit:", error);
      });
  }
};

const cancelEdit = () => {
  const index = steps.value.findIndex((s) => s.id === editingStepId.value);
  if (index !== -1 && originalStep.value) {
    // Revert to original data
    steps.value[index] = originalStep.value;
    stopEdit();
  }
};

const handleAddKeyup = (event) => {
  if (event.ctrlKey && event.key === "Enter") {
    addAction();
  }
};

const addAction = () => {
  if (newAction.value.trim()) {
    axios
      .post(`api/steps/${props.selectedRecordId}`, {
        action: newAction.value,
      })
      .then((response) => {
        steps.value.push(response.data.data);
        store.getRecord(props.selectedRecordId);
        newAction.value = "";
      })
      .catch((error) => {
        console.error("Failed to add action:", error);
      });
  }
};

const startDeleteConfirmation = (id) => {
  confirmingDeleteId.value = id;
};

const confirmDelete = (index) => {
  const stepId = steps.value[index].id;
  axios
    .delete(`api/steps/${stepId}`)
    .then(() => {
      steps.value.splice(index, 1);
      confirmingDeleteId.value = null;
      store.getRecord(props.selectedRecordId);
    })
    .catch((error) => {
      console.error("Failed to delete step:", error);
    });
};

const cancelDelete = () => {
  confirmingDeleteId.value = null;
};

const updateCompletion = (id, isCompleted) => {
  const step = steps.value.find((s) => s.id === id);
  if (step) {
    axios
      .put(`api/steps/${step.id}`, {
        action: step.action,
        is_completed: isCompleted,
      })
      .then(() => {
        store.getRecord(props.selectedRecordId);
      })
      .catch((error) => {
        console.error("Failed to update completion status:", error);
      });
  }
};
</script>

<style scoped>
/* Scoped styles for this component */
input,
textarea {
  outline: none;
}
</style>

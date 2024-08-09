import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import { debounce } from "lodash";
import axios from "@/axios";

export const useDocumentStore = defineStore("documentStore", () => {
  // changable across models #################################################################################################
  const endPoint = "api/documents";
  const modelName = "Document";
  const modelPluralName = "Documents";

  const allContractsList = ref([]);
  const getContractList = () => {
    axios.get("api/allContracts").then((response) => {
      allContractsList.value = response.data.data;
    });
  };
  const allStakeholdersList = ref([]);
  const getStakeholderList = () => {
    axios.get("api/allStakeholders").then((response) => {
      allStakeholdersList.value = response.data.data;
    });
  };

  const defaultForm = {
    contract_id: null,
    from_id: null,
    to_id: null,
    type: null,
    title: "",
    content: "",
    notes: "",
  };
  const filters = ref({});

  const updateCompletion = (id) => {
    axios
      .put(`${endPoint}/toggleIsCompleted/${id}`)
      .then(() => {
        fetchResults();
      })
      .catch((error) => {
        console.error("Failed to update completion status:", error);
      });
  };

  // constants across models #################################################################################################

  // Refs #################################################################################################
  const results = ref([]);
  const errors = ref(null);
  const showModal = ref(false);
  const isFetching = ref(false);
  const isShowing = ref(false);
  const isCreating = ref(false);
  const isUpdating = ref(false);
  const isDeleting = ref(false);
  const selectedRecord = ref(null);
  const form = ref({ ...defaultForm });
  const meta = ref({
    current_page: 1,
    last_page: 1,
    per_page: 50,
    links: [],
    total: 0,
  });

  // Getters #################################################################################################
  const modalTitle = computed(() => {
    return selectedRecord.value ? `Edit ${modelName}` : `Add New ${modelName}`;
  });

  const debouncedFetchResults = debounce(() => {
    resetCurrentPage();
  }, 300);

  // Functions #################################################################################################
  const fetchResults = () => {
    isFetching.value = true;
    axios
      .get(endPoint, {
        params: {
          filters: filters.value,
          page: meta.value.current_page,
          per_page: meta.value.per_page,
        },
      })
      .then((response) => {
        results.value = response.data.data;
        meta.value = {
          current_page: response.data.meta.current_page,
          last_page: response.data.meta.last_page,
          per_page: response.data.meta.per_page,
          links: response.data.meta.links,
          total: response.data.meta.total,
        };
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          errors.value = error.response.data.errors;
        } else {
          console.error(error);
        }
      })
      .finally(() => {
        isFetching.value = false;
      });
  };

  const addRecord = () => {
    isCreating.value = true;
    axios
      .post(endPoint, form.value)
      .then((response) => {
        fetchResults();
        const record = response.data.data;

        openModal(record, record.type);
        // closeModal();
        errors.value = null;
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          errors.value = error.response.data.errors;
        } else {
          console.error(error);
        }
      })
      .finally(() => {
        isCreating.value = false;
      });
  };

  const updateRecord = () => {
    isUpdating.value = true;
    axios
      .put(`${endPoint}/${selectedRecord.value.id}`, form.value)
      .then((response) => {
        const index = results.value.findIndex(
          (record) => record.id === selectedRecord.value.id
        );
        results.value[index] = response.data;
        closeModal();
        errors.value = null;
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          errors.value = error.response.data.errors;
        } else {
          console.error(error);
        }
      })
      .finally(() => {
        isUpdating.value = false;
      });
  };

  const getRecord = (id) => {
    isFetching.value = true;
    axios
      .get(`${endPoint}/${id}`)
      .then((response) => {
        const index = results.value.findIndex((record) => record.id === id);
        results.value[index] = response.data.data;
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          errors.value = error.response.data.errors;
        } else {
          console.error(error);
        }
      })
      .finally(() => {
        isFetching.value = false;
      });
  };

  const deleteRecord = (record) => {
    isDeleting.value = true;
    axios
      .delete(`${endPoint}/${record.id}`)
      .then(() => {
        if (
          results.value.length === 1 &&
          meta.value.current_page === meta.value.last_page
        ) {
          meta.value.current_page--; // this line will fetchResults because of watch
        } else {
          fetchResults();
        }
        closeModal();
        errors.value = null;
        selectedRecord.value = null;
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          errors.value = error.response.data.errors;
        } else {
          console.error(error);
        }
      })
      .finally(() => {
        isDeleting.value = false;
      });
  };

  const openModal = async (record = null, type) => {
    if (
      record &&
      selectedRecord.value &&
      selectedRecord.value.id == record.id
    ) {
      closeModal();
    } else {
      errors.value = null;
      if (record) {
        // Edit Mode
        selectedRecord.value = record;
        form.value = JSON.parse(JSON.stringify(selectedRecord.value));
      } else {
        // Create Mode
        selectedRecord.value = null;
        form.value = { ...defaultForm };
        form.value.type = type;
        form.value.to_id = type == "incoming" ? 1 : null;
        form.value.from_id = type == "outgoing" ? 1 : null;
      }

      showModal.value = true;
    }
  };

  const closeModal = () => {
    form.value = { ...defaultForm };
    selectedRecord.value = null;
    showModal.value = false;
  };

  const handleSubmit = () => {
    if (selectedRecord.value) {
      updateRecord();
    } else {
      addRecord();
    }
  };

  const resetCurrentPage = () => {
    if (meta.value.current_page === 1) {
      fetchResults();
    } else {
      meta.value.current_page = 1;
    }
  };

  // Watchers #################################################################################################
  watch(
    () => meta.value.current_page,
    (newPage) => {
      closeModal();
      fetchResults();
    }
  );

  watch(
    () => meta.value.per_page,
    (newPerPage) => {
      resetCurrentPage();
    }
  );

  watch(
    () => filters.value,
    () => {
      debouncedFetchResults();
    },
    { deep: true }
  );

  return {
    results,
    form,
    meta,
    showModal,
    modalTitle,
    modelPluralName,
    selectedRecord,
    errors,
    isFetching,
    isCreating,
    isShowing,
    isUpdating,
    isDeleting,
    filters,
    fetchResults,
    addRecord,
    updateRecord,
    getRecord,
    deleteRecord,
    openModal,
    closeModal,
    handleSubmit,
    allContractsList,
    getContractList,
    allStakeholdersList,
    getStakeholderList,
    updateCompletion,
  };
});

import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import { debounce } from "lodash";
import axios from "@/axios";

export const useContractStore = defineStore("contractStore", () => {
  // changable across models #################################################################################################
  const endPoint = "api/contracts";
  const modelName = "Contract";
  const modelPluralName = "Contracts";
  const allContractsList = ref([]);
  const getContractList = () => {
    axios.get("api/contractsWithNoParent").then((response) => {
      allContractsList.value = response.data.data;
    });
  };

  const defaultForm = {
    name: "",
    contract_id: "",
    created_by: 1,
    is_active: 1,
  };
  const filters = ref({
    search: "",
  });


  // constants across models #################################################################################################

  // Refs #################################################################################################
  const results = ref([]);
  const errors = ref(null);
  const showModal = ref(false);
  const isFetching = ref(false);
  const isCreating = ref(false);
  const isUpdating = ref(false);
  const isDeleting = ref(false);
  const selectedRecord = ref(null);
  const form = ref({ ...defaultForm });
  const meta = ref({
    current_page: 1,
    last_page: 1,
    per_page: 5,
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
      .then(() => {
        fetchResults();
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
        getContractList();
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
        getContractList();
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

  const openModal = (record = null) => {
    if (
      record &&
      selectedRecord.value &&
      selectedRecord.value.id == record.id
    ) {
      closeModal();
    } else {
      errors.value = null;
      if (record) {
        selectedRecord.value = record;
        form.value = JSON.parse(JSON.stringify(selectedRecord.value));
      } else {
        selectedRecord.value = null;
        form.value = defaultForm;
      }

      showModal.value = true;
    }
  };

  const closeModal = () => {
    form.value = defaultForm;
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
    () => filters.value.search,
    () => {
      debouncedFetchResults();
    }
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
    isUpdating,
    isDeleting,
    filters,
    allContractsList,
    fetchResults,
    addRecord,
    updateRecord,
    deleteRecord,
    openModal,
    closeModal,
    handleSubmit,
    getContractList,
  };
});

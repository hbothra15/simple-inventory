<template>
  <div class="q-pa-md">
    <q-table
      title="Inventory"
      :data="data"
      :columns="columns"
      :loading="loading"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { name: "item", align: "center", label: "Item Name", field: "item" },
        { name: "code", align: "center", label: "HSU Code", field: "code" },
        { name: "qnty", align: "center", label: "Current Qnty", field: "qnty" },
        { name: "unit", align: "center", label: "Unit", field: "unit" },
        { name: "rate", align: "center", label: "Rate", field: "rate" }
      ]
    };
  },
  computed: {
    data() {
      return this.$store.getters["inventory/getRecords"].map(record => ({...record}));
    },
    loading() {
      return this.$store.getters['inventory/loading']
    }
  },
  mounted() {
    this.$store.commit("inventory/cleanup");
    this.$store.dispatch("inventory/read");
  }
};
</script>

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
        { name: "unit", align: "center", label: "Unit", field: "count" },
        { name: "code", align: "center", label: "HSU Code", field: "code" },
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

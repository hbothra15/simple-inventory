<template>
  <div class="q-pa-md">
    <q-table
      title="Purchases"
      :data="data"
      :columns="columns"
      row-key="id"
      selection="single"
      @row-click="selected"
      :loading="loading"
    />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" @click="selected('', emptyData)" />
    </q-page-sticky>
  </div>
</template>

<script>
import { getFormatDate, setFormatDate } from "../services/DateUtil";
import _ from "lodash";
export default {
  data() {
    return {
      columns: [
        {
          name: "date",
          required: true,
          field: "date",
          label: "Bill Date",
          sortable: true
        },
        { name: "gstin", label: "GSTIN", field: "gstin", sortable: true },
        { name: "invoice", label: "Bill #", field: "invoice", sortable: true },
        { name: "source", label: "Bill From", field: "source", sortable: true },
        { name: "total", align: "center", label: "Total", field: "total" },
        { name: "tax", align: "center", label: "Total Tax", field: "tax" },
        {
          name: "taxTotal",
          align: "center",
          label: "Total(incl. tax)",
          field: "taxTotal"
        }
      ],
      emptyData: {
        invoice: "",
        gstin: "",
        date: new Date(),
        source: "",
        igst: 0,
        cgst: 0,
        sgst: 0,
        items: [],
        total: 0.0,
        tax: 0.0,
        taxTotal: 0.0
      }
    };
  },
  computed: {
    data() {
      return this.$store.getters["purchase/getRecords"].map(record => {
        var data = { ...record };
        data.date = getFormatDate(record.date.toDate());
        return data;
      });
    },
    loading() {
      return this.$store.getters['purchase/loading']
    }
  },
  mounted() {
    if (!this.$store.getters["purchase/redirected"]) {
      this.$store.commit("purchase/cleanup");
      this.$store.dispatch("purchase/read");
      this.$store.commit("purchase/redirected", true );
    }
  },
  methods: {
    selected(event, row) {
      const record = _.clone(row);
      record.date = setFormatDate(record.date);
      this.$store.commit("purchase/setCurrent", record);
      this.$router.push({ name: "Purchase" });
    }
  }
};
</script>

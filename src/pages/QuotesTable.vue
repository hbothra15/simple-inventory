<template>
  <div class="q-pa-md">
    <q-table
      title="Quotations"
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
import _ from 'lodash'
import { getFormatDate, setFormatDate } from "../services/DateUtil";
export default {
  data() {
    return {
      columns: [
        {
          name: "date",
          required: true,
          field: "date",
          label: "Quotation Date",
          sortable: true,
          align: "left"
        },
        { name: "destin", label: "Quote To", field: "destin", sortable: true },
        {
          name: "address",
          label: "Billing Address",
          field: "address",
          sortable: true
        },
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
        date: new Date(),
        destin: "",
        address: "",
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
      return this.$store.getters["quote/getRecords"].map(record => {
        var data = { ...record };
        data.date = getFormatDate(record.date.toDate());
        return data;
      });
    },
    loading() {
      return this.$store.getters['quote/loading']
    }
  },
  mounted() {
    if (!this.$store.getters["quote/redirected"]) {
      this.$store.commit("quote/cleanup");
      this.$store.dispatch("quote/read");
      this.$store.commit("quote/redirected", true );
    }
  },
  methods: {
    selected(event, row) {
      const record = _.clone(row);
      record.date = setFormatDate(record.date);
      this.$store.commit("quote/setCurrent", record);
      this.$router.push({ name: "Quote" });
    }
  }
};
</script>

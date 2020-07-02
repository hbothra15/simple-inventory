<template>
  <div class="q-pa-md">
    <q-table title="Purchases" :data="data" :columns="columns" row-key="id" selection="single" @row-click="selected"/>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" />
    </q-page-sticky>
  </div>
</template>

<script>
import { getFormatDate } from "../services/DateUtil"
export default {
  data () {
    return {
      columns: [
        {
          name: 'date',
          required: true,
          field: 'date',
          label: 'Bill Date',
          sortable: true
        },
        { name: 'source', label: 'Bill From', field: 'source', sortable: true },
        { name: 'total', align: 'center', label: 'Total', field: 'total' },
        { name: 'tax', align: 'center', label: 'Total Tax', field: 'tax' },
        { name: 'taxTotal', align: 'center', label: 'Total(incl. tax)', field: 'taxTotal' }
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
    }
  },
  computed: {
    data() {
      return this.$store.getters['purchase/getRecords'].map(record => ({
        id: record.id,
        date: getFormatDate(record.date.toDate()),
        source: record.source,
        total: record.total,
        tax: record.tax,
        taxTotal: record.taxTotal
      }))
    }
  },
  mounted() {
    this.$store.commit('purchase/cleanup')
    this.$store.dispatch('purchase/read')
  },
  methods: {
    selected(event, row) {
      console.log(`${row.id} record has been selected`)
    }
  }
};
</script>

<style></style>

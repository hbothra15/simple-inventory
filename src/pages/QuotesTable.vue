<template>
  <div class="q-pa-md">
    <q-table title="Quotations" :data="data" :columns="columns" row-key="id" selection="single" @row-click="selected"/>
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
          label: 'Sales Date',
          sortable: true,
          align: 'left'
        },
        { name: 'destin', label: 'Bill To', field: 'destin', sortable: true },
        { name: 'address', label: 'Billing Address', field: 'adress', sortable: true },
        { name: 'total', align: 'center', label: 'Total', field: 'total' },
        { name: 'tax', align: 'center', label: 'Total Tax', field: 'tax' },
        { name: 'taxTotal', align: 'center', label: 'Total(incl. tax)', field: 'taxTotal' }
      ],
      emptyData: {
        date: new Date(),
        destin: "",
        igst: 0,
        cgst: 0,
        sgst: 0,
        items: [],
        total: 0.00,
        tax: 0.00,
        taxTotal: 0.00
      }
    }
  },
  computed: {
    data() {
      return this.$store.getters['quote/getRecords'].map(record => ({
        id: record.id,
        date: getFormatDate(record.date.toDate()),
        source: record.destin,
        address: record.address,
        total: record.total,
        tax: record.tax,
        taxTotal: record.taxTotal,
        items: record.items
      }))
    }
  },
  mounted() {
    this.$store.commit('quote/cleanup')
    this.$store.dispatch('quote/read')
  },
  methods: {
    selected(event, row) {
      console.log(`${row.id} record has been selected`)
    }
  }
};
</script>

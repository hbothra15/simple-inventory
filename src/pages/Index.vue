<template>
  <q-page class="flex flex-center">
    <div class="full-width row wrap justify-center items-center content-center">
      <q-btn
        push
        rounded
        size="xl"
        class="col-5 col-xs-5 q-ma-xs"
        v-for="(value, index) in menu"
        :color="value.color"
        :label="value.label"
        :key="index"
        @click="value.callback"
      />
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageIndex",
  data() {
    return {
      menu: {
        purchase: {
          label: "Purchase",
          color: "primary",
          callback: () => {this.route('purchases')}
        },
        sales: {
          label: "Sales",
          color: "primary",
          callback: () => {this.route('sales')}
        },
        quote: {
          label: "Quotation",
          color: "primary",
          callback: () => {this.route('quotes')}
        },
        stock: {
          label: "Stock",
          color: "primary",
          callback: () => {this.route('stock')}
        }
      }
    };
  },
  methods: {
    route(key){
      this.$router.push('/'+key)
    }
  },
  mounted() {
    this.$store.dispatch('inventory/read')
  }
};
</script>

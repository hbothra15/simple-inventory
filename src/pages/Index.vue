<template>
  <q-page class="flex flex-center">
    Welcome to the RS Enterprises Inventory App.

    For any technical issues reach out to&nbsp;<a href="mailto:hemant.bothra15@gmail.com?subject=Queries for Simple Inventory">Hemant</a>
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

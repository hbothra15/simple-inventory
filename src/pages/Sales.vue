<template>
  <article class="q-pa-md">
    <div class="text-h4 q-mb-md">Sales
      <p class="float-right no-margin" v-if="isDisabled">
        <q-btn color="positive" label="Print" size="md"/>
      </p>
    </div>
    <q-input
      v-model="saleDate"
      filled
      :disable="isDisabled"
      label="Bill Date"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            ref="qDateProxy"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="saleDate"
              @input="() => $refs.qDateProxy.hide()"
              mask="YYYY-MM-DD"
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input v-model="sales.destin" label="Bill To" class="q-mb-sm" :disable="isDisabled"/>
    <q-input v-model="sales.address" label="Place of Supply(Multi line)" class="q-mb-sm" autogrow :disable="isDisabled"/>
    <div class="row q-mb-md q-gutter-x-md">
      <q-btn-dropdown dense color="primary" label="Int. Sate GST Taxes" class="col" :disable="isDisabled">
        <q-list>
          <q-item clickable v-close-popup @click="setIGST(value)" v-for="(value) in gstValues" :key="value">
            <q-item-section>
              <q-item-label>{{value}}%</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn-dropdown dense color="primary" label="State GST Taxes" class="col" :disable="isDisabled">
        <q-list>
          <q-item clickable v-close-popup @click="setGST(value)" v-for="(value) in gstValues" :key="value">
            <q-item-section>
              <q-item-label>{{value}}%</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <div class="row q-mb-md q-gutter-x-md">
      <q-input disable dense class="col" label="IGST Tax %" :value="sales.igst"/>
      <q-input disable dense class="col" label="CGST Tax %" :value="sales.cgst"/>
      <q-input disable dense class="col" label="SGST Tax %" :value="sales.sgst"/>
    </div>
    <q-input class="q-mb-sm" label="Total" disable :value="getTotal()" />
    <q-input class="q-mb-sm" label="Taxable Value" disable :value="sales.tax" />
    <q-input class="q-mb-sm" label="Total (incl. tax)" disable v-model="sales.taxTotal" />
    <Items
      :actionName="!!this.sales.id ? 'Update Sales Order' : 'Create Sales Order'"
      :items="sales.items"
      :actionCallback="!!this.sales.id ? updateSale: saveSale"
      :disable="isDisabled"
    />
  </article>
</template>

<script>
import {getFormatDate, setFormatDate} from "../services/DateUtil"
import Items from "components/Items";
export default {
  data() {
    return {
      sales: {},
      gstValues: [5, 8, 12, 18, 28],
      flag: true
    };
  },
  computed: {
    saleDate: {
      get() {
        return getFormatDate(this.sales.date)
      },
      set(value) {
        this.sales.date = setFormatDate(value)
      }
    },
    isDisabled() {
      return !!this.sales.id && this.flag;
    }
  },
  components: {
    Items
  },
  methods: {
    saveSale() {
      this.$store.dispatch('sales/add', this.sales)
      this.$router.push("/sales")
    },
    getTotal() {
      const tax = (parseFloat(this.sales.igst) + parseFloat(this.sales.cgst) + parseFloat(this.sales.sgst)) / 100
      var total = this.sales.items.reduce((currTotal, item) => {
        return currTotal + item.amnt;
      }, 0.0);
      this.sales.tax = total * (tax) | 0.0;
      this.sales.total = total;
      this.sales.taxTotal = total + this.sales.tax | 0.0;
      return total;
    },
    setGST(value) {
      this.sales.cgst = value/2;
      this.sales.sgst = value/2;
      this.sales.igst = 0;
    },
    setIGST (value) {
      this.sales.igst = value;
      this.sales.cgst = 0;
      this.sales.sgst = 0;
    },
    updateSale() {
      this.$store.commit("sales/redirected", true)
      this.$store.dispatch("sales/update", this.sales);
      this.$router.push("/sales")
    }
  },
  created() {
    this.sales = _.cloneDeep(this.$store.getters["sales/getCurrentRecord"])
    console.log(this.sales)
  }
};
</script>

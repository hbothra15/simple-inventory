<template>
  <article class="q-pa-md">
    <p class="text-h4">Sales</p>
    <q-input
      v-model="saleDate"
      filled
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
    <q-input v-model="sales.destin" label="Bill To" class="q-mb-sm" />
    <q-input v-model="sales.address" label="Place of Supply(Multi line)" class="q-mb-sm" autogrow/>
    <div class="row q-mb-md q-gutter-x-md">
      <q-btn-dropdown dense color="primary" label="Int. Sate GST Taxes" class="col">
        <q-list>
          <q-item clickable v-close-popup @click="setIGST(value)" v-for="(value) in gstValues" :key="value">
            <q-item-section>
              <q-item-label>{{value}}%</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn-dropdown dense color="primary" label="State GST Taxes" class="col">
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
      <q-input filled dense class="col" label="IGST Tax %" disable :value="sales.igst"/>
      <q-input filled dense class="col" label="CGST Tax %" disable :value="sales.cgst"/>
      <q-input filled dense class="col" label="SGST Tax %" disable :value="sales.sgst"/>
    </div>
    <q-input class="q-mb-sm" label="Total" disable :value="getTotal()" />
    <q-input class="q-mb-sm" label="Taxable Value" disable :value="sales.tax" />
    <q-input class="q-mb-sm" label="Total (incl. tax)" disable v-model="sales.taxTotal" />
    <Items
      actionName="Create Sales Order"
      :items="sales.items"
      :sgst="parseFloat(sales.sgst)"
      :cgst="parseFloat(sales.cgst)"
      :igst="parseFloat(sales.igst)"
      :actionCallback="saveSale"
    />
  </article>
</template>

<script>
import {getFormatDate, setFormatDate} from "../services/DateUtil"
import Items from "components/Items";
export default {
  data() {
    return {
      sales: {
        date: new Date(),
        destin: "",
        address: "",
        igst: 0,
        cgst: 0,
        sgst: 0,
        items: [],
        total: 0.0,
        tax: 0.00,
        taxTotal: 0.00
      },
      gstValues: [0, 5, 8, 12, 18, 28]
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
    }
  },
  components: {
    Items
  },
  methods: {
    saveSale() {
      this.$store.dispatch('sales/add', this.sales)
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
    print() {
      this.$router.push({name: 'Print', params: {sales: this.sales}})
    }
  }
};
</script>

<template>
  <article class="q-pa-md">
    <p class="text-h4">Quotation</p>
    <q-input
      v-model="quoteDate"
      filled
      label="Quotation Date"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            ref="qDateProxy"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="quoteDate"
              @input="() => $refs.qDateProxy.hide()"
              mask="YYYY-MM-DD"
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input v-model="quotes.destin" label="Quotation To" class="q-mb-sm" />
    <q-input v-model="quotes.address" label="Place of Supply(Multi line)" class="q-mb-sm" autogrow/>
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
    <q-input class="q-mb-sm" label="Taxable Value" disable :value="quotes.tax" />
    <q-input class="q-mb-sm" label="Total (incl. tax)" disable v-model="quotes.taxTotal" />
    <Items
      actionName="Create Quotation"
      :items="quotes.items"
      :sgst="parseFloat(quotes.sgst)"
      :cgst="parseFloat(quotes.cgst)"
      :igst="parseFloat(quotes.igst)"
      :actionCallback="saveQuotation"
    />
  </article>
</template>

<script>
import {getFormatDate, setFormatDate} from "../services/DateUtil"
import Items from "components/Items";
export default {
  data() {
    return {
      quotes: {
        date: new Date(),
        destin: "",
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
    quoteDate: {
      get() {
        return getFormatDate(this.quotes.date)
      },
      set(value) {
        this.quotes.date = setFormatDate(value)
      }
    }
  },
  components: {
    Items
  },
  methods: {
    saveQuotation() {
      this.$store.dispatch('quote/add', this.quotes)
    },
    getTotal() {
      const tax = (parseFloat(this.quotes.igst) + parseFloat(this.quotes.cgst) + parseFloat(this.quotes.sgst)) / 100
      var total = this.quotes.items.reduce((currTotal, item) => {
        return currTotal + item.amnt;
      }, 0.0);
      this.quotes.tax = total * (tax) | 0.0;
      this.quotes.total = total;
      this.quotes.taxTotal = total + this.quotes.tax | 0.0;
      return total;
    },
    setGst(value) {
      this.quotes.cgst = value/2;
      this.quotes.sgst = value/2;
    },
    setIGST (value) {
      this.quotes.igst = value;
    },
    print() {
      this.$router.push({name: 'Print', params: {quotes: this.quotes}})
    }
  }
};
</script>

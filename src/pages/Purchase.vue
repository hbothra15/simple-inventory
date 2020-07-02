<template>
  <article class="q-pa-md">
    <p class="text-h4">Purchase</p>
    <q-input
      v-model="purchase.invoice"
      label="Invoice No."
      class="q-mb-sm"
      :rules="[val => !!val || 'Field is required']"
    />
    <q-input
      v-model="purchase.gstin"
      label="GSTIN"
      class="q-mb-sm"
      :rules="[val => !!val || 'Field is required']"
    />
    <q-input
      v-model="purchaseDate"
      filled
      label="YYYY-MM-DD"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            ref="qDateProxy"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="purchaseDate"
              @input="() => $refs.qDateProxy.hide()"
              mask="YYYY-MM-DD"
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input
      v-model="purchase.source"
      label="Supplier"
      class="q-mb-sm"
      :rules="[val => !!val || 'Field is required']"
    />
    <div class="row q-mb-sm q-gutter-sm">
      <q-btn-dropdown color="primary" label="GST Taxes">
        <q-list>
          <q-item
            clickable
            v-close-popup
            @click="setGst(value)"
            v-for="value in gstValues"
            :key="value"
          >
            <q-item-section>
              <q-item-label>{{ value }}%</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-input
        disable
        v-model="purchase.igst"
        label="IGST %"
        class="col"
        type="number"
      />
      <q-input
        disable
        v-model="purchase.cgst"
        label="CGST %"
        class="col"
        type="number"
      />
      <q-input
        disable
        v-model="purchase.sgst"
        label="SGST %"
        class="col"
        type="number"
      />
    </div>
    <q-input class="q-mb-sm" label="Total" disable :value="getTotal()" />
    <q-input
      class="q-mb-sm"
      label="Taxable Value"
      disable
      :value="purchase.tax"
    />
    <q-input
      class="q-mb-sm"
      label="Total (incl. tax)"
      disable
      v-model="purchase.taxTotal"
    />
    <Items
      actionName="Add Purchase Order"
      :items="purchase.items"
      :actionCallback="savePurchase"
    />
  </article>
</template>

<script>
import Items from "components/Items";
import {getFormatDate, setFormatDate} from "../services/DateUtil"
export default {
  data() {
    return {
      purchase: {
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
      },
      gstValues: [5, 8, 12, 18, 28]
    };
  },
  computed: {
    purchaseDate: {
      get() {
        return getFormatDate(this.purchase.date)
      },
      set(value) {
        this.purchase.date = setFormatDate(value)
      }
    }
  },
  components: {
    Items
  },
  methods: {
    savePurchase() {
      this.$store.dispatch("purchase/add", this.purchase);
    },
    getTotal() {
      const tax =
        (parseFloat(this.purchase.igst) +
          parseFloat(this.purchase.cgst) +
          parseFloat(this.purchase.sgst)) /
        100;
      var total = this.purchase.items.reduce((currTotal, item) => {
        return currTotal + item.amnt;
      }, 0.0);
      this.purchase.tax = (total * tax) | 0.0;
      this.purchase.total = total;
      this.purchase.taxTotal = (total + this.purchase.tax) | 0.0;
      return total;
    },
    setGst(value) {
      if (this.purchase.gstin.startsWith("21")) {
        this.purchase.cgst = value / 2;
        this.purchase.sgst = value / 2;
        this.purchase.igst = 0;
      } else {
        this.purchase.igst = value;
        this.purchase.cgst = 0;
        this.purchase.sgst = 0;
      }
    }
  }
};
</script>

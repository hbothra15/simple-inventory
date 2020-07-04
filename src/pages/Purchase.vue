<template>
  <article class="q-pa-md">
    <div class="text-h4 q-mb-md">
      Purchase
      <p class="float-right no-margin" v-if="isDisabled">
        <q-btn
          color="positive"
          label="Edit"
          size="md"
          @click="flag = false"
          class="q-mr-md"
        />
        <q-btn color="positive" label="Print" size="md"/>
      </p>
    </div>
    <q-input
      v-model="purchase.invoice"
      label="Invoice No."
      class="q-mb-sm"
      :disable="isDisabled"
      :rules="[val => !!val || 'Field is required']"
    />
    <q-input
      v-model="purchase.gstin"
      label="GSTIN"
      class="q-mb-sm"
      :disable="isDisabled"
      :rules="[val => !!val || 'Field is required']"
    />
    <q-input
      v-model="purchaseDate"
      filled
      label="YYYY-MM-DD"
      :disable="isDisabled"
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
      :disable="isDisabled"
      :rules="[val => !!val || 'Field is required']"
    />
    <div class="row q-mb-sm q-gutter-sm">
      <q-btn-dropdown color="primary" label="GST Taxes" :disable="isDisabled">
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
      :actionName="!!this.purchase.id ? 'Update Purchase Order' : 'Add Purchase Order'"
      :items="purchase.items"
      :actionCallback="!!this.purchase.id ? updatePurchase: savePurchase"
      :disable="isDisabled"
    />
  </article>
</template>

<script>
import _ from 'lodash'
import Items from "components/Items";
import { getFormatDate, setFormatDate } from "../services/DateUtil";
export default {
  data() {
    return {
      gstValues: [5, 8, 12, 18, 28],
      flag: true,
      purchase: {}
    };
  },
  computed: {
    purchaseDate: {
      get() {
        return getFormatDate(this.purchase.date);
      },
      set(value) {
        this.purchase.date = setFormatDate(value);
      }
    },
    isDisabled() {
      return !!this.purchase.id && this.flag;
    }
  },
  created() {
    this.purchase = _.cloneDeep(this.$store.getters["purchase/getCurrentRecord"]);
  },
  components: {
    Items
  },
  methods: {
    savePurchase() {
      this.$store.dispatch("purchase/add", this.purchase);
      this.$router.push("/purchases")
    },
    updatePurchase() {
      this.$store.commit("purchase/redirected", true)
      this.$store.dispatch("purchase/update", this.purchase);
      this.$router.push("/purchases")
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

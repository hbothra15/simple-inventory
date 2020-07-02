<template>
  <section>
    <div
      v-for="(row, index) in items"
      :key="index"
      class="row si-item-row q-pb-sm q-gutter-sm q-mt-sm"
      :class="index === 0 ? 'si-item-row-first' : ''"
    >
      <q-input outlined dense class="col-3" label="Sr.No" disable :value="index + 1"  :rules="[val => !!val || 'Field is required']"/>
      <q-input outlined dense class="col q-pr-sm" label="HSN Code" v-model="row.code" type="text" :rules="[val => !!val || 'Field is required']"/>
      <q-input outlined dense class="col-12 q-pr-md" label="Item Name" v-model="row.item" type="text" :rules="[val => !!val || 'Field is required']"/>
      
      <q-input outlined dense class="col-3" label="Quantity" v-model="row.qnty"
        type="number" :rules="[val => !!val || 'Field is required']"
      />
      <q-input outlined dense class="col-3" label="Unit" v-model="row.unit" type="text" :rules="[val => !!val || 'Field is required']"/>
      <q-input outlined dense class="col q-pr-md" label="Rate" v-model="row.rate" type="number" prefix="INR. " :rules="[val => !!val || 'Field is required']"/>
      <q-input outlined dense
        filled
        class="col-10 q-pr-md"
        label="Amount"
        type="number"
        :value="calcAmnt(row)"
        prefix="INR. "
      />
      <q-btn round color="negative" label="-" push @click="remove(index)" dense/>
    </div>
    <div class="row q-mt-sm fit justify-between">
      <q-btn class="col-5" color="positive" :label="actionName" size="md"
        @click="actionCallback" :class="items.length === 0 ? 'hideButton': ''"/>
      <q-btn class="col-5" color="primary" label="Add Item" size="md"
        @click="addItem"/>
    </div>
  </section>
</template>

<script>
const row = {
  item: "Item",
  code: "Code",
  qnty: 0,
  unit: "",
  rate: 0,
  amnt: 0
};

export default {
  props:{
    items: {
      type: Array,
      required: true
    },
    actionName: {
      type: String,
      required: true
    },
    actionCallback: {
      type: Function,
      required: true
    }
  },
  methods: {
    calcAmnt(eachRow) {
      const num = (eachRow.qnty * eachRow.rate); 
      eachRow.amnt = Math.round((num + Number.EPSILON) * 100) / 100
      return eachRow.amnt
    },
    addItem() {
      this.items.push({...row})
    },
    remove(index) {
      this.items.splice(index, 1)
    }
  }
};
</script>

<style scoped>
.si-item-row {
  border-bottom: 1px dotted black;
}
.si-item-row-first {
  border-top: 1px dotted black;
}
.hideButton {
  visibility: hidden;
}
</style>

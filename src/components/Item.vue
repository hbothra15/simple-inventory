<template>
  <q-select
    dense
    v-model="prdCode"
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    :options="options"
    :disable="disable"
    @filter="filterFn"
    @input="valueAdded"
    new-value-mode="add"
    options-selected-class="text-deep-orange"
  >
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
        <q-item-section>
          <q-item-label v-html="scope.opt.label" />
          <q-item-label caption>
            <span>{{ scope.opt.item }}</span> -
            <span
              :class="scope.opt.count > 0 ? 'text-positive' : 'text-warning'"
            >
              {{ scope.opt.qnty }}</span
            >
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      prdCode: this.code
    }
  },
  props: {
    index: {
      type: Number,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    disable: {
      type: Boolean,
      required: false
    }
  },
  mounted() {
    this.$store.getters["inventory/getRecords"].forEach(element => {
      var data = {
        label: element.code,
        value: element.id
      }
      Object.assign(data, {...element})
      this.options.push(data);
    });
  },
  methods: {
    filterFn(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.options = this.options.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    valueAdded(value) {
      console.log('Input', value)
      var data = {
        key: this.index,
        value: value.label ? {
          item: value.item,
          code: value.code,
          qnty: 0,
          unit: value.unit,
          rate: value.rate,
          amnt: 0
        } : {code: value}
      }
      this.$emit('input', data)
    }
  }
};
</script>

<style></style>

<template>
  <article class="page">
    {{sales}}
  </article>
</template>

<script>
export default {
  props: {
    sales: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.page {
  display: table;
  border: 1px solid black;
}
@page {
  size: A4;
  margin: 0;
}
@media print {
  html, body {
    width: 210mm;
    height: 297mm;
  }
  .page {
    margin: 0;
  }
}
</style>

<template>
  <q-layout view="lHh Lpr lFf" style="background-color:rgba(99,99,99,.1)">
    <q-header elevated>
      <q-toolbar>
        <q-avatar rounded>
          <Logo style="width:38px;"/>
        </q-avatar>
        <q-toolbar-title>
          Simple Inventory
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Logo from 'components/Logo'
export default {
  name: 'MainLayout',
  components: {
    Logo
  }
}
</script>

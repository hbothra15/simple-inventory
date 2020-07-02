const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'sales', component: () => import('pages/SalesTable.vue') },
      { path: 'sale', component: () => import('pages/Sales.vue'), props: true },
      { path: 'purchase', component: () => import('pages/Purchase.vue'), props: true },
      { path: 'purchases', component: () => import('pages/PurchaseTable.vue') },
      { path: 'quote', component: () => import('pages/Quote.vue'), props: true },
      { path: 'quotes', component: () => import('pages/QuotesTable.vue') },
      { path: 'stock', component: () => import('pages/Stock.vue') },
      { path: 'print', name: 'Print', props: true, component: () => import('pages/Print.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

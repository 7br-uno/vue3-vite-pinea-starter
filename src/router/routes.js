export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/components/viewForSubPath/index.vue'),
    children: [
      {
        path: '',
        name: 'Homepage',
        component: () => import('../views/homePage/index.vue'),
        meta: {
          title: `Homepage`,
          requiresAuth: true,
          parent: `vue3starter`,
        },
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('../views/settings/index.vue'),
        meta: {
          title: `words.settings`,
          requiresAuth: true,
          parent: `vue3starter`,
        },
      },
      {
        path: '/account',
        name: 'Account',
        component: () => import('../views/account/index.vue'),
        meta: {
          title: `words.account`,
          requiresAuth: true,
          parent: `vue3starter`,
        },
      },
    ],
  },
  {
    path: '/sign-in',
    name: 'Signin',
    component: () => import('@/views/signIn/index.vue'),
    meta: {
      title: `words.sign_in`,
      requiresAuth: false,
      parent: `vue3starter`,
    },
  },
  {
    path: '/sign-up',
    name: 'Signup',
    component: () => import('@/views/signUp/index.vue'),
    meta: {
      title: `words.sign_up`,
      requiresAuth: false,
      parent: `vue3starter`,
    },
  },
  {
    path: '/error/:code',
    name: 'Error',
    component: () => import('@/views/error/index.vue'),
    meta: {
      title: `words.error`,
      requiresAuth: false,
      parent: `vue3starter`,
    },
  },
]

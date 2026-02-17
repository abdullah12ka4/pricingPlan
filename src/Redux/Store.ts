import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userApi } from './services/user'
import { tiersApi } from './services/tiersApi'
import { AddOnsApi } from './services/AddOns'
import { networkApi } from './services/NetworkModal'
import { salesAgentApi } from './services/SalesAgent'
import { activeQuotesApi } from './services/ActiveQuotes'
import { FeaturesApi } from './services/Features'
import { OrganizationApi } from './services/Organization'
import { notificationApi } from './services/Notifications'

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [userApi.reducerPath]: userApi.reducer,
    [tiersApi.reducerPath]: tiersApi.reducer,
    [AddOnsApi.reducerPath]: AddOnsApi.reducer,
    [networkApi.reducerPath]: networkApi.reducer,
    [salesAgentApi.reducerPath]: salesAgentApi.reducer,
    [activeQuotesApi.reducerPath]: activeQuotesApi.reducer,
    [FeaturesApi.reducerPath]: FeaturesApi.reducer,
    [OrganizationApi.reducerPath]: OrganizationApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, tiersApi.middleware, AddOnsApi.middleware, networkApi.middleware, salesAgentApi.middleware, activeQuotesApi.middleware, FeaturesApi.middleware, OrganizationApi.middleware, notificationApi.middleware),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)
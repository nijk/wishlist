'use strict'

export const apiRoute = '/v1/api'

export const ROUTES = {
  LOGIN: `${apiRoute}/login`,
  USERS: `${apiRoute}/users`,
  LOOKUP: `${apiRoute}/lookup/:url`,
  WISHLISTS: `${apiRoute}/wishlists/:id?`,
  WISHLISTS_PRODUCT: `${apiRoute}/wishlists/:resourceID/:collection/:collectionID?`,
};

export default {
  queryLimit: 10,
  resources: ['product', 'wishlists', 'users'],
  routes: ROUTES,
}

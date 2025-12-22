export default {
  auth: {
    domain: "norwoj.us.auth0.com",
    clientId: "fID6T0yQ0MEeOZSNrz8AEm3oZprU2FOF",
    authorizationParams: {
      redirect_uri: "http://localhost:4200",
      audience: "http://localhost:8080",
    },
  },
  httpInterceptor: {
    allowedList: [
      'http://localhost:8080/api/orders/**',
      'http://localhost:8080/api/checkout/purchase'
    ],
  },
}
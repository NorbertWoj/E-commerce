export default {
  auth: {
    domain: "norwoj.us.auth0.com",
    clientId: "njX8CMxC6O8yuWHbM8gv2yHrC0LNW7IH",
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
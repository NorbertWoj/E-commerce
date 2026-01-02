export const environment = {
  production: true,

  api: {
    baseUrl: 'https://localhost:8443'
  },
  auth: {
    domain: 'norwoj.us.auth0.com',
    clientId: 'fID6T0yQ0MEeOZSNrz8AEm3oZprU2FOF',
    authorizationParams: {
      redirect_uri: 'https://localhost:4200',
      audience: 'https://localhost:8443',
      scope: 'openid profile email'
    }
  }
};
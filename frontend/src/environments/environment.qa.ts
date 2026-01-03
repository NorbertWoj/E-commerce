export const environment = {
  production: false,

  api: {
    baseUrl: 'https://localhost:9898'
  },
  auth: {
    domain: 'norwoj.us.auth0.com',
    clientId: 'fID6T0yQ0MEeOZSNrz8AEm3oZprU2FOF',
    authorizationParams: {
      redirect_uri: 'https://localhost:4200',
      audience: 'https://localhost:9898',
      scope: 'openid profile email'
    }
  } 
};
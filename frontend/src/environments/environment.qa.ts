export const environment = {
  production: false,
  stripePublishableKey: "pk_test_51SlCsRRW56mNoem40kJ4xVNMfiHqBXYnbusYApSKOgh50wDiPuk9Em94JF0uJ0zPzwY7iJXuEeAKRoVk8JhbMjeB00r1EDGuib", 

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
import { test as base, expect, request } from '@playwright/test'
import { Order } from '../services/Order.service' // Import the Order service

let loginPayload = {
  userEmail: 'pashish12345@gmail.com',
  userPassword: 'Mpvpi@26',
}

export const test = base.extend({
  authToken: async ({}, use) => {
    // Create new API context for authenticated requests
    const apiContext = await request.newContext({
      baseURL: 'https://rahulshettyacademy.com',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    })

    const response = await apiContext.post('api/ecom/auth/login', {
      data: loginPayload,
    })
    expect(response.ok()).toBeTruthy()

    const data = await response.json()
    const token = data.token

    if (!token) throw new Error('Login did not return a token')

    // Pass both the token and apiContext as an object to other fixtures
    await use({ token, apiContext })

    await apiContext.dispose()
  },
  // Fixture for orderService (using both authToken and apiContext)
  orderService: async ({ authToken }, use) => {
    // Create orderService
    const orderService = new Order(authToken.apiContext, authToken.token)
    await use(orderService)
  },
})

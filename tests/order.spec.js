import { test, expect } from '@playwright/test'
import { Order } from '../services/Order.service'

test.describe('create order via api', () => {
  test('validate order in ui', async ({ page, request }) => {
    let response = await request.post(
      'https://rahulshettyacademy.com/api/ecom/auth/login/',
      {
        data: {
          userEmail: 'pashish12345@gmail.com',
          userPassword: 'Mpvpi@26',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    await expect(response.ok()).toBeTruthy()
    let data = await response.json()
    let token = data.token
    console.log('token', token)
    // Inject the token before page loads
    await page.addInitScript((token) => {
      window.localStorage.setItem('token', token)
    }, token)

    // Navigate after token is injected
    await page.goto(
      'https://rahulshettyacademy.com/client/#/dashboard/myorders',
    )

    const productId = '6581ca979fd99c85e8ee7faf'
    let orderService = new Order(token)
    // Create order via API
    const order = orderService.createOrder('brazil', productId)

    // Fetch order details via API
    const details = await orderService.getOrderById(order._id)

    const uiId = (await page.locator('table tr th').first().innerText()).trim()

    console.log('API ID:', order._id, 'UI ID:', uiId)

    expect(order._id).toBe(uiId)
  })
})

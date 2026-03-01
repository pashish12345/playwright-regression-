import { test, expect } from '@playwright/test'

let orderPayload = {
  orders: [{ country: 'Cuba', productOrderedId: '6960eac0c941646b7a8b3e68' }],
}

test.describe('API', () => {
  let token
  let orderId

  test.beforeEach(async ({ page, request }) => {
    const orders = [
      { country: 'Gibraltar', productOrderedId: '6960eac0c941646b7a8b3e68' },
    ]

    let response = await request.post(
      'https://rahulshettyacademy.com/api/ecom/auth/login',
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

    let data = await response.json()
    if (!data.token) {
      throw new Error('Login failed or invalid token received.')
    }

    token = data.token // Capture the token
    console.log('token', token)

    let re = await request.post(
      'https://rahulshettyacademy.com/api/ecom/order/create-order',
      {
        data: orders,
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      },
    )

    let ordergot = await re.json()
    console.log('API Response:', ordergot)

    if (ordergot.orders && ordergot.orders.length > 0) {
      orderId = ordergot.orders[0] // Store the order ID
      console.log('Created Order ID:', orderId)
    } else {
      throw new Error('No orders found in the API response')
    }

    await page.goto(
      'https://rahulshettyacademy.com/client/#/dashboard/myorders',
    )
  })

  test('API call', async ({ page }) => {
    const uiId = await page.locator('table tr th').first().innerText()

    await expect(uiId).toContain(orderId)
  })
})

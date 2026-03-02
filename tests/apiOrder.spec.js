import { test } from '../fixture/auth.fixture' // Use the custom test with extended fixtures
import { expect } from 'playwright/test' // Importing Playwright's expect method
import { Order } from '../services/Order.service' // Import the Order service

let orderPayload = {
  orders: [{ country: 'Cuba', productOrderedId: '6960eac0c941646b7a8b3e68' }],
}

test.describe.configure({ mode: 'serial' })

test.describe('smoke test', () => {
  let orderId
  test.beforeAll('Order setup', async ({ orderService, authToken }) => {
    const orderResponse = await orderService.createOrder(orderPayload)
    orderId = orderResponse
  })

  test('Read ', async ({ page, orderService }) => {
    let orderResponse = await orderService.getOrderById(orderId, page)
    expect(orderResponse).toBeDefined()
    expect(orderResponse._id).toBe(orderId)
  })

  test('Verify Order in UI', async ({ page, authToken }) => {
    await page.addInitScript(
      (val) => window.localStorage.setItem('token', val),
      authToken.token,
    )
    await page.goto(
      'https://rahulshettyacademy.com/client/#/dashboard/myorders',
      {
        waitUntil: 'domcontentloaded',
      },
    )
    let heading = page.getByRole('heading', { name: 'Your Orders' })
    await heading.waitFor({ state: 'visible', timeout: 60000 })
    let row = page.locator('table tbody tr')
    let uiOrderId
    let rowCount = await row.count()
    for (let i = 0; i < rowCount; i++) {
      let rowOrderId = await row.nth(i).locator('th').textContent()
      if (orderId.includes(rowOrderId)) {
        uiOrderId = rowOrderId
        await row.nth(i).locator('button').first().click()
        break
      }
    }

    expect(uiOrderId).toBeDefined()
    expect(uiOrderId).toBe(orderId)
    await expect(uiOrderId).toContain(orderId) // Match the order ID
    let orderDetails = await page.locator('.col-text.-main').textContent()
    await expect(orderId.includes(orderDetails)).toBeTruthy()
  })

  test('get order all', async ({ orderService }) => {
    let response = await orderService.getAllOrders()
    let found = response.some((el) => el._id === orderId)
    expect(found).toBeTruthy()
  })

  test('de', async ({ orderService }) => {
    let response = await orderService.deleteOrder(orderId)
    await expect(response.status()).toBe(200)
    const ordersAfterDelete = await orderService.getAllOrders()

    const stillExists = ordersAfterDelete.some(
      (o) => o._id === orderId || o.id === orderId,
    )
    expect(stillExists).toBeFalsy()
  })
})

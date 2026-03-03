import { expect, request } from '@playwright/test'
export class Order {
  constructor(apiContext, token, userId) {
    this.apiContext = apiContext
    this.token = token
    this.userId = userId
    this.baseURL = 'https://rahulshettyacademy.com/'
  }
  
  async createOrder(orderPayload) {
    const res = await this.apiContext.post('api/ecom/order/create-order', {
      data: orderPayload,
      headers: {
        Authorization: this.token, //raw token
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()

    if (!res.ok()) {
      console.error('Create order failed:', data.message)
      if (res.status() === 401) {
        throw new Error('Session expired. Please log in again.')
      }
      throw new Error(`${data.message}`)
    }

    await expect(res.ok()).toBeTruthy()

    return data.orders[0]
  }
  async deleteOrder(id) {
    let res = await this.apiContext.delete(
      `api/ecom/order/delete-order/${id}`,
      {
        headers: {
          Authorization: this.token,
          'Content-Type': 'application/json',
        },
      },
    )
    await expect(res.status()).toBe(200)

    return res
  }

  async getOrderById(id) {
    let res = await this.apiContext.get(
      `api/ecom/order/get-orders-details?id=${id}`,
      {
        headers: {
          Authorization: this.token,
          'Content-Type': 'application/json',
        },
      },
    )
    let data = await res.json()
    await expect(res.status()).toBe(200)

    return data.data
  }

  async getAllOrders() {
    const res = await this.apiContext.get(
      `api/ecom/order/get-orders-for-customer/${this.userId}`,
      {
        headers: {
          Authorization: this.token, // Correct format
          'Content-Type': 'application/json',
        },
      },
    )

    await expect(res.status()).toBe(200) // assertion stays

    const data = await res.json()
    return data.data
  }
}

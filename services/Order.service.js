
import{expect, request} from "@playwright/test"
export class Order{
    constructor(apiContext,token){
      this.apiContext = apiContext;
        this.token= token;
        this.baseURL= 'https://rahulshettyacademy.com/'
    }
//     async createContext() {
//         console.log("Token being passed:", this.token);  
//   // Always use fresh token from fixture
//   // return await this.request.newContext({
//   //   baseURL: this.baseURL,
//   //   extraHTTPHeaders: {
//   //     Authorization: `Bearer ${this.token}`,
//   //     "Content-Type": "application/json",
//   //   },
//   });
// }
async createOrder(orderPayload) {
  //const apiContext = await this.createContext();
  const res = await this.apiContext.post("api/ecom/order/create-order", {
    data: orderPayload,
    headers:{
      Authorization:this.token,
      "Content-Type": "application/json",
    }
  });
if (!res.ok()) {
      const error = await res.json();
      console.error("Create order failed:", error.message);  // Log error message
      if (res.status() === 401) {
        // Handle token expiration
        throw new Error("Session expired. Please log in again.");
      }
      throw new Error("Create order failed: " + error);  // Throw error to stop the test
    }
  await expect(res.ok()).toBeTruthy();
  const data = await res.json();
  await this.apiContext.dispose();
  return data.orders[0];
}

   
 async deleteOrder(id){
        let res= await this.apiContext.delete(`api/ecom/order/delete-order/${id}`,{
          headers:{
      Authorization:this.token,
      "Content-Type": "application/json",
    }
        });
        await expect(res.status()).toBe(200)
        await this.apiContext.dispose();
        return res
       }

       async getOrderById(id,page){
      let res = await this.apiContext.get(`api/ecom/order/get-orders-details?id=${id}`,{
        headers:{
      Authorization:this.token,
      "Content-Type": "application/json",
    }
      });
      let data = await res.json();
        await expect(res.status()).toBe(200)
      await this.apiContext.dispose();
         return data.data;
       }
       
       async getAllOrders(){
      let res = await this.apiContext.get(`api/ecom/order/get-orders-for-customer`,{
        headers:{
      Authorization:this.token,
      "Content-Type": "application/json",
    }
      });
      await expect(res.status()).toBe(200)
      let data = await res.json();
      //await this.apiContext.dispose();
         return data.data;
       }

       
}
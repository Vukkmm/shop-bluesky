import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  url = "http://localhost:8080/api/orders";

  urlOrderDetail = "http://localhost:8080/api/orderDetail";

  constructor(private httpClient: HttpClient) { }

  get() {
    return this.httpClient.get(this.url);
  }

  getById(id:number) {
    return this.httpClient.get(this.url+'/'+id);
  }

  getByOrder(id:number) {
    return this.httpClient.get(this.urlOrderDetail+'/order/'+id);
  }
  //hủy đơn hàng

  cancel(id: number) {
    return this.httpClient.get(this.url+'/cancel/'+id);
  }
  // xác nhận đơn hàng
  deliver(id: number) {
    return this.httpClient.get(this.url+'/deliver/'+id);
  }
  //Thanh toán thành công
  success(id: number) {
    return this.httpClient.get(this.url+'/success/'+id);
  }
}

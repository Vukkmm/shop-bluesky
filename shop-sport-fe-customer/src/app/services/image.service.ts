import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  url = 'http://localhost:8080/api/image';

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get(this.url);
  }

  getById(id:number) {
    return this.httpClient.get(this.url+'/'+id);
  }
  
  getByProduct(productId:number) {
    return this.httpClient.get(this.url+'/product/'+productId);
  }
}

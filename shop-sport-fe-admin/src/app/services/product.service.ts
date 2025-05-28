import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Product } from '../common/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = "http://localhost:8080/api/products";

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get(this.url);
  }

  getOne(id: number) {
    return this.httpClient.get(this.url + '/' + id);
  }

  getBestSeller() {
    return this.httpClient.get(this.url + '/bestseller-admin');
  }

  save(product: Product) {
    return this.httpClient.post(this.url, product);
  }

  update(product: Product, id: number) {
    return this.httpClient.put(this.url + '/' + id, product);
  }

  delete(id: number) {
    return this.httpClient.delete(this.url + '/' + id);
  }

  upload(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<any>(this.url + 'upload-file', formData);
  }

  uploadImage(product: Product): Observable<any> {
    return this.httpClient.put(this.url + '/uploadImage', product);
  }
}

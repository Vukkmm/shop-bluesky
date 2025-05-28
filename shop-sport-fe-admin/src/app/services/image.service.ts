import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ImageDTO } from '../common/ImageDTO';
@Injectable({
  providedIn: 'root'
})
export class ImageService {
  url = 'http://localhost:8080/api/image';

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get(this.url);
  }

  getById(id: number) {
    return this.httpClient.get(this.url + '/' + id);
  }

  getByProduct(productId: number) {
    return this.httpClient.get(this.url + '/product/' + productId);
  }
  
  updateImage(id: number, imageDTO: ImageDTO) {
    return this.httpClient.put(this.url + '/' + id, imageDTO);

  }
  post(imageDTO: ImageDTO) {
    return this.httpClient.post(this.url, imageDTO);
  }
  uploads(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<any>(this.url + 'upload-file', formData);
  }

  uploadImages(image: ImageDTO): Observable<any> {
    return this.httpClient.put(this.url + '/uploadImage', image);
  }
}

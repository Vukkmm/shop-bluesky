import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClient) {}

  uploadProduct(file: File): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'demo-upload');
    data.append('cloud_name', 'dyk3ugiam');
    data.append('folder', 'product');
    return this.http.post(
      'https://api.cloudinary.com/v1_1/dyk3ugiam/image/upload',

      data
    );
  }

  uploadCustomer(file: File): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'demo-upload');
    data.append('cloud_name', 'dyk3ugiam');
    data.append('folder', 'users');
    return this.http.post(
      'https://api.cloudinary.com/v1_1/dyk3ugiam/image/upload',

      data
    );
  }

  uploadProducts(file: File): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'demo-upload');
    data.append('cloud_name', 'dyk3ugiam');
    data.append('folder', 'product-admin');
    return this.http.post(
      'https://api.cloudinary.com/v1_1/dyk3ugiam/image/upload',

      data
    );
  }
}

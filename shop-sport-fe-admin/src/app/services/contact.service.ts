import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from '../common/Contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  url = "http://localhost:8080/api/contact";
  constructor(private httpClient: HttpClient) { }
  
  getAll() {
    return this.httpClient.get(this.url);
  }

  getOne(id: number) {
    return this.httpClient.get(this.url + '/' + id);
  }

  post(contact: Contact) {
    return this.httpClient.post(this.url, contact);
  }

  delete(id: number) {
    return this.httpClient.delete(this.url + '/' + id);
  }
}

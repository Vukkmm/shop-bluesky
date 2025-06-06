
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProvinceService {

  provinces = 'http://localhost:8081/api/v1/provinces?size=100&page=0&all=true';
  districts = 'http://localhost:8081/api/v1/districts?size=100&page=0&all=false';
  wards = 'http://localhost:8081/api/v1/wards?size=100&page=0&all=true';

  province = 'http://localhost:8081/api/v1/provinces/';
  district = 'http://localhost:8081/api/v1/districts/';
  ward = 'http://localhost:8081/api/v1/wards/';

  constructor(private http: HttpClient) {}

  getAllProvinces(): Observable<any> {
    return this.http.get(this.provinces);
  }

  getDistricts(province_code: string): Observable<any> {
    const body = { province_code: province_code };
    return this.http.post<any>(this.districts, body, {});
  }

  getWards(code: string): Observable<any> {
    const body = { district_code: code };
    return this.http.post<any>(this.wards, body, {});
  }

  getProvince(id: number) {
    return this.http.get(this.province + id);
  }

  getDistrict(id: number) {
    return this.http.get(this.district + id);
  }

  getWard(id: number) {
    return this.http.get(this.ward + id);
  }
}

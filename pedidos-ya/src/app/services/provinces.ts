// src/app/services/provinces.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Province } from '../models/province.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProvincesService {

  private readonly apiUrl = 'http://localhost:3001';
  private readonly endpoint = '/provinces';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene una lista de todas las provincias.
   */
  getProvinces(): Observable<Province[]> {
    return this.http.get<Province[]>(`${this.apiUrl}${this.endpoint}`);
  }

  /**
   * Obtiene una única provincia por su ID.
   * @param id El ID de la provincia a buscar.
   */
  getProvinceById(id: number): Observable<Province> {
    return this.http.get<Province>(`${this.apiUrl}${this.endpoint}/${id}`);
  }

  /**
   * MÉTODO EXTRA: Obtiene todas las provincias que pertenecen a un país específico.
   * ¡Este es muy útil para los selectores anidados!
   * @param countryId El ID del país del cual se quieren obtener las provincias.
   */
  getProvincesByCountry(countryId: number): Observable<PaginatedResponse<Province>> {
    const url = `${this.apiUrl}${this.endpoint}/by-country/${countryId}`;
    return this.http.get<PaginatedResponse<Province>>(url);
  }

  /**
   * Crea una nueva provincia en la base de datos.
   * @param provinceData Los datos de la provincia a crear.
   */
  createProvince(provinceData: Omit<Province, 'id' | 'country' | 'cities'>): Observable<Province> {
    return this.http.post<Province>(`${this.apiUrl}${this.endpoint}`, provinceData);
  }

  /**
   * Actualiza una provincia existente.
   * @param id El ID de la provincia a actualizar.
   * @param provinceData Los campos de la provincia a actualizar.
   */
  updateProvince(id: number, provinceData: Partial<Omit<Province, 'id' | 'country' | 'cities'>>): Observable<Province> {
    return this.http.put<Province>(`${this.apiUrl}${this.endpoint}/${id}`, provinceData);
  }

  /**
   * Elimina una provincia de la base de datos.
   * @param id El ID de la provincia a eliminar.
   */
  deleteProvince(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.endpoint}/${id}`);
  }
}

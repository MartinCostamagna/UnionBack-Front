// src/app/services/city.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { City } from '../models/city.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
    providedIn: 'root'
})
export class CitiesService {

    private readonly apiUrl = 'http://localhost:3001';
    private readonly endpoint = '/cities';

    constructor(private http: HttpClient) { }

    /**
     * Obtiene una lista de todas las ciudades.
     */
    getCities(): Observable<City[]> {
        return this.http.get<City[]>(`${this.apiUrl}${this.endpoint}`);
    }

    /**
     * Obtiene una única ciudad por su ID.
     * @param id El ID de la ciudad a buscar.
     */
    getCityById(id: number): Observable<City> {
        return this.http.get<City>(`${this.apiUrl}${this.endpoint}/${id}`);
    }

    /**
     * MÉTODO EXTRA: Obtiene todas las ciudades que pertenecen a una provincia específica.
     * Perfecto para selectores anidados (País -> Provincia -> Ciudad).
     * @param provinceId El ID de la provincia de la cual se quieren obtener las ciudades.
     */
    getCitiesByProvince(provinceId: number): Observable<PaginatedResponse<City>> {
        const url = `${this.apiUrl}${this.endpoint}/by-province/${provinceId}`;
        return this.http.get<PaginatedResponse<City>>(url);
    }

    /**
     * Crea una nueva ciudad en la base de datos.
     * @param cityData Los datos de la ciudad a crear.
     */
    createCity(cityData: Omit<City, 'id' | 'province' | 'persons'>): Observable<City> {
        return this.http.post<City>(`${this.apiUrl}${this.endpoint}`, cityData);
    }

    /**
     * Actualiza una ciudad existente.
     * @param id El ID de la ciudad a actualizar.
     * @param cityData Los campos de la ciudad a actualizar.
     */
    updateCity(id: number, cityData: Partial<Omit<City, 'id' | 'province' | 'persons'>>): Observable<City> {
        return this.http.put<City>(`${this.apiUrl}${this.endpoint}/${id}`, cityData);
    }

    /**
     * Elimina una ciudad de la base de datos.
     * @param id El ID de la ciudad a eliminar.
     */
    deleteCity(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${this.endpoint}/${id}`);
    }
}
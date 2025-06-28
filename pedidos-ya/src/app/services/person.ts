// src/app/services/persons.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonsService {

  private readonly apiUrl = 'http://localhost:3001';
  private readonly endpoint = '/persons';

  constructor(private http: HttpClient) { }

  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}${this.endpoint}`);
  }

  /**
   * Obtiene una única persona por su ID.
   * @param id El ID de la persona a buscar.
   */
  getPersonById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}${this.endpoint}/${id}`);
  }

  /**
   * Crea una nueva persona.
   * Nota: Usamos Omit para crear un tipo que es igual a Person pero sin 'id' y 'city',
   * ya que esos no se envían directamente al crear.
   * @param personData Los datos de la persona a crear.
   */
  createPerson(personData: Omit<Person, 'id' | 'city'>): Observable<Person> {
    return this.http.post<Person>(`${this.apiUrl}${this.endpoint}`, personData);
  }

  /**
   * Actualiza una persona existente.
   * Nota: Usamos Partial<> porque podrías querer actualizar solo algunos campos.
   * @param id El ID de la persona a actualizar.
   * @param personData Los campos de la persona a actualizar.
   */
  updatePerson(id: number, personData: Partial<Omit<Person, 'id' | 'city'>>): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}${this.endpoint}/${id}`, personData);
  }

  /**
   * Elimina una persona de la base de datos.
   * @param id El ID de la persona a eliminar.
   */
  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.endpoint}/${id}`);
  }
}

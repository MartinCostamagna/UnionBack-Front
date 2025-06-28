// src/app/models/city.model.ts
import { Province } from './province.model';
import { Person } from './person.model';

export interface City {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    provinceId: number;

    // Propiedades opcionales para las relaciones. La API puede o no
    // incluirlas en cada respuesta.
    province?: Province;
    persons?: Person[];
}
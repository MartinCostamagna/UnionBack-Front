// src/app/models/person.model.ts
import { PersonRole } from './person-role.enum';
import { City } from './city.model';
export interface Person {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    birthDate: Date | null;
    role: PersonRole;
    cityId: number | null;
    city?: City;
}
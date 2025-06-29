// src/person/interfaces/person.interfaces.ts

// Interfaces anidadas para una respuesta limpia
export interface CountryResponse {
  id: number;
  name: string;
}

export interface ProvinceResponse {
  id: number;
  name: string;
  country?: CountryResponse | null;
}

export interface CityResponse {
  id: number;
  name: string;
  province?: ProvinceResponse | null;
}

// Interfaz principal que se enviará al frontend
export interface PersonResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date | null;
  role: string;
  city?: CityResponse | null;
  cityId: number | null;
}
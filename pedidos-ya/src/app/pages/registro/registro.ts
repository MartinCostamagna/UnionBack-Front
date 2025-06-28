import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// --> Se recomienda importar 'Router' si quieres redirigir al usuario después del registro
import { Router } from '@angular/router';

// Importamos todos los modelos y servicios que usaremos
import { Country } from '../../models/country.model';
import { Province } from '../../models/province.model';
import { City } from '../../models/city.model';
import { PersonRole } from '../../models/person-role.enum';

import { CountriesService } from '../../services/countries';
import { ProvincesService } from '../../services/provinces';
import { CitiesService } from '../../services/cities';
// --> Asumo que el servicio de registro está en 'AuthService' según nuestra conversación
import { AuthService } from '../../services/auth.service';

// --> Importamos 'tap' y 'catchError' para un mejor manejo de observables
import { catchError, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro implements OnInit {

  registroForm!: FormGroup;

  // Arrays para almacenar los datos de los selectores
  countries: Country[] = [];
  provinces: Province[] = [];
  cities: City[] = [];

  // --> Banderas para mostrar spinners de carga y mejorar la UX
  isLoadingCountries = false;
  isLoadingProvinces = false;
  isLoadingCities = false;

  constructor(
    private fb: FormBuilder,
    private router: Router, // --> Inyectamos el Router
    private countriesService: CountriesService,
    private provincesService: ProvincesService,
    private citiesService: CitiesService,
    private authService: AuthService // --> Usamos AuthService para el registro
  ) { }

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      // --> Podrías añadir validación con una expresión regular para la contraseña si quieres
      password: ['', [Validators.required, Validators.minLength(8)]],
      birthDate: [null],
      countryId: [{ value: null, disabled: true }, Validators.required], // --> Deshabilitado hasta que carguen los países
      provinceId: [{ value: null, disabled: true }, Validators.required],
      cityId: [{ value: null, disabled: true }, Validators.required]
    });

    this.loadCountries();

    // --> Escuchamos los cambios en los selectores de una forma más reactiva
    this.onCountryChanges();
    this.onProvinceChanges();
  }

  loadCountries(): void {
    this.isLoadingCountries = true;
    this.countriesService.getCountries().pipe(
      tap(data => {
        // Si tu API devuelve { data: [...] }, usa: this.countries = data.data;
        this.countries = data.data;
        this.registroForm.get('countryId')?.enable();
      }),
      catchError(error => {
        console.error('Error al cargar países', error);
        alert('No se pudieron cargar los países. Intente recargar la página.');
        return of([]);
      }),
      finalize(() => { // <-- USA FINALIZE AQUÍ DENTRO DEL PIPE
        this.isLoadingCountries = false;
      })
    ).subscribe(); // <-- Y es importante suscribirse para que la cadena se ejecute
  }

  onCountryChanges(): void {
    this.registroForm.get('countryId')?.valueChanges.subscribe(countryId => {
      this.provinces = [];
      this.cities = [];
      this.registroForm.get('provinceId')?.reset({ value: null, disabled: true });
      this.registroForm.get('cityId')?.reset({ value: null, disabled: true });

      if (countryId) {
        this.isLoadingProvinces = true;
        this.provincesService.getProvincesByCountry(countryId).pipe(
          tap(data => {
            this.provinces = data.data;
            this.registroForm.get('provinceId')?.enable();
          }),
          catchError(error => {
            console.error('Error al cargar provincias', error);
            return of([]);
          }),
          finalize(() => { // <-- CORRECCIÓN AQUÍ
            this.isLoadingProvinces = false;
          })
        ).subscribe();
      }
    });
  }

  onProvinceChanges(): void {
    this.registroForm.get('provinceId')?.valueChanges.subscribe(provinceId => {
      this.cities = [];
      this.registroForm.get('cityId')?.reset({ value: null, disabled: true });

      if (provinceId) {
        this.isLoadingCities = true;
        this.citiesService.getCitiesByProvince(provinceId).pipe(
          tap(data => {
            this.cities = data.data;
            this.registroForm.get('cityId')?.enable();
          }),
          catchError(error => {
            console.error('Error al cargar ciudades', error);
            return of([]);
          }),
          finalize(() => { // <-- CORRECCIÓN AQUÍ
            this.isLoadingCities = false;
          })
        ).subscribe();
      }
    });
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    const formValue = this.registroForm.getRawValue();

    // 1. Buscamos los objetos completos para poder obtener sus nombres.
    const selectedProvince = this.provinces.find(p => p.id === formValue.provinceId);
    const selectedCity = this.cities.find(c => c.id === formValue.cityId);

    // 2. Construimos el objeto de datos EXACTAMENTE como lo espera el backend.
    const newPersonData = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password,
      birthDate: formValue.birthDate,

      // Enviamos los NOMBRES, no los IDs.
      cityName: selectedCity?.name,     // Usamos el nombre de la ciudad seleccionada
      provinceName: selectedProvince?.name, // Usamos el nombre de la provincia seleccionada
    };

    // 3. Verificamos que no estemos enviando datos nulos si algo falló
    if (!newPersonData.cityName || !newPersonData.provinceName) {
      alert('Hubo un error al seleccionar la ciudad o provincia. Por favor, inténtalo de nuevo.');
      return;
    }

    this.authService.register(newPersonData).subscribe({
      next: (response) => {
        console.log('Usuario registrado con éxito!', response);
        alert('¡Registro exitoso! Ahora serás redirigido al login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error durante el registro:', err);
        alert(`Hubo un error en el registro: ${err.error?.message || 'Por favor, intenta de nuevo.'}`);
      }
    });
  }
}
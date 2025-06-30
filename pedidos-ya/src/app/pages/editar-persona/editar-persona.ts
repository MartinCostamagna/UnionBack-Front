import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonsService } from '../../services/person';
import { Person } from '../../models/person.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-editar-persona',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-persona.html',
  styleUrls: ['./editar-persona.css']
})
export class EditarPersonaComponent implements OnInit {
  editForm!: FormGroup;
  personId!: number;
  isLoading = true;
  errorMessage: string | null = null;

  roles = [
    { value: 'user', label: 'Usuario' },
    { value: 'moderator', label: 'Moderador' },
    { value: 'admin', label: 'Admin' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private personsService: PersonsService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.errorMessage = 'No se proporcionó un ID de persona.';
      this.isLoading = false;
      return;
    }
    this.personId = +idParam;

    this.initializeForm();

    this.personsService.getPersonById(this.personId).subscribe({
      next: (person: Person) => {
        const birthDate = person.birthDate ? new Date(person.birthDate).toISOString().split('T')[0] : null;
        this.editForm.patchValue({ ...person, birthDate });
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'No se pudo cargar la información de la persona.';
        this.isLoading = false;
        console.error('Error al obtener la persona:', err);
      }
    });
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      role: ['user', Validators.required],
      birthDate: [''],
      cityId: [null],
    });
  }

  get f() { return this.editForm.controls; }

  onSubmit(): void {
    this.editForm.markAllAsTouched();

    if (this.editForm.invalid) {
      alert("El formulario es inválido. Por favor, revise los errores.");
      return;
    }

    const formData = { ...this.editForm.value };
    if (!formData.password) {
      delete formData.password;
    }

    this.personsService.updatePerson(this.personId, formData).subscribe({
      next: () => {
        alert('¡Persona actualizada con éxito!');
        this.router.navigate(['/TablaDeDatos']);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Error al actualizar la persona.';
        console.error('Error al actualizar:', err);
        alert(`Error: ${err.error?.message || 'Ocurrió un error inesperado.'}`);
      }
    });
  }
}
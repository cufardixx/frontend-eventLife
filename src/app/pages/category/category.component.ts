import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryServiceService } from '../../services/category.service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Categoria } from '../../interfaces/categoria';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})


export class CategoryComponent {

  // Injecting services
  private CategoryService = inject(CategoryServiceService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  // Defining the form group
  public formCategory: FormGroup = this.formBuild.group({
    name: ['', [Validators.required]],
  });
  errorMessages: any;

  categorias: Categoria[] = []; 


  ngOnInit(): void {
    this.CategoryService.getCategories().subscribe((categorias) => {
      console.log(categorias); // Verifica que los datos se reciban correctamente
      this.categorias = categorias;
    });
  }


  eliminarCategoria(id: number): void {
    this.CategoryService.deleteCategory(id).subscribe(
      (response) => {
        console.log('Categoría eliminada:', response);
        this.categorias = this.categorias.filter(categoria => categoria.id !== id);
      },
      (error) => {
        console.error('Error al eliminar categoría:', error);
      }
    );
  }

  
  CargarCategoria() {
    if (this.formCategory.invalid) return;

    const objeto : any = {
      name: this.formCategory.value.name
    };
    console.log(objeto);

    this.CategoryService.cargarCategoria(objeto!).subscribe({
      next: (response) => {
        console.log('Categoria registrada:', response);
        this.ngOnInit()
      },
      error: (error) => {
        this.errorMessages = error;
      }
    });
  }
}
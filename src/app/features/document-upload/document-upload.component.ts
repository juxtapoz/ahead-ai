import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  template: `
    <mat-card class="upload-card">
      <h2>Upload Financial Documents</h2>
      <div class="upload-dropzone"
           (dragover)="onDragOver($event)"
           (drop)="onDrop($event)">
        <mat-icon>cloud_upload</mat-icon>
        <span>Drag & drop files here, or</span>
        <button mat-button (click)="fileInput.click()">Browse</button>
        <input #fileInput type="file" multiple (change)="onFileSelect($event)" [accept]="acceptTypes" hidden>
      </div>
      <div *ngIf="files.length > 0" class="file-list">
        <div *ngFor="let file of files; let i = index" class="file-item">
          <mat-icon>description</mat-icon>
          <span>{{ file.file.name }}</span>
          <mat-form-field appearance="outline" class="desc-field">
            <mat-label>Description</mat-label>
            <input matInput [formControl]="descriptionControls.at(i)" placeholder="Add a description">
          </mat-form-field>
          <button mat-icon-button color="warn" (click)="removeFile(i)"><mat-icon>delete</mat-icon></button>
          <mat-progress-bar *ngIf="file.progress !== undefined" mode="determinate" [value]="file.progress"></mat-progress-bar>
        </div>
      </div>
      <button mat-raised-button color="primary" (click)="uploadFiles()" [disabled]="files.length === 0">Upload</button>
    </mat-card>
  `,
  styles: [`
    .upload-card {
      max-width: 600px;
      margin: 40px auto;
      padding: 32px 24px;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(50, 115, 220, 0.07);
      background: #fff;
    }
    h2 {
      text-align: center;
      color: #3273DC;
      margin-bottom: 24px;
    }
    .upload-dropzone {
      border: 2px dashed #3273DC;
      border-radius: 12px;
      padding: 32px;
      text-align: center;
      color: #2C3E50;
      background: #F8F9FA;
      margin-bottom: 24px;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    .upload-dropzone:hover, .upload-dropzone.dragover {
      border-color: #00D1B2;
    }
    .upload-dropzone mat-icon {
      font-size: 3rem;
      color: #3273DC;
      margin-bottom: 8px;
    }
    .file-list {
      margin-bottom: 24px;
    }
    .file-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      background: #F8F9FA;
      border-radius: 8px;
      padding: 8px 12px;
    }
    .file-item mat-icon {
      color: #00D1B2;
    }
    .desc-field {
      flex: 1;
      min-width: 180px;
    }
    mat-progress-bar {
      width: 120px;
      margin-left: 16px;
    }
    button[mat-raised-button] {
      display: block;
      margin: 0 auto;
      min-width: 160px;
    }
  `]
})
export class DocumentUploadComponent {
  acceptTypes = '.jpg,.jpeg,.png,.pdf,.xls,.xlsx,.csv';
  files: any[] = [];
  descriptionControls = new FormArray<FormControl<string | null>>([]);
  isUploading = false;

  constructor(
    private supabase: SupabaseService,
    private snackBar: MatSnackBar
  ) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files) {
      this.addFiles(event.dataTransfer.files);
    }
  }

  onFileSelect(event: any) {
    if (event.target.files) {
      this.addFiles(event.target.files);
    }
  }

  addFiles(fileList: FileList) {
    Array.from(fileList).forEach(file => {
      if (this.isValidType(file) && !this.isDuplicate(file)) {
        this.files.push({ file, progress: 0 });
        this.descriptionControls.push(new FormControl<string | null>(''));
      }
    });
  }

  isValidType(file: File): boolean {
    const allowed = this.acceptTypes.split(',').map(t => t.trim().replace('.', ''));
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ext ? allowed.includes(ext) : false;
  }

  isDuplicate(file: File): boolean {
    return this.files.some(f => f.file.name === file.name && f.file.size === file.size);
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
    this.descriptionControls.removeAt(index);
  }

  async uploadFiles() {
    if (this.files.length === 0) return;
    
    this.isUploading = true;
    const user = await this.supabase.getCurrentUser();
    if (!user) {
      this.snackBar.open('Please log in to upload documents', 'Close', { duration: 3000 });
      return;
    }

    for (let i = 0; i < this.files.length; i++) {
      const fileObj = this.files[i];
      const file = fileObj.file;
      const description = this.descriptionControls.at(i).value;
      
      try {
        // Create a unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data, error } = await this.supabase.client.storage
          .from('documents')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;

        // Save document metadata to database
        const { error: dbError } = await this.supabase.client
          .from('documents')
          .insert({
            user_id: user.id,
            file_name: file.name,
            storage_path: fileName,
            file_type: fileExt,
            description: description,
            file_size: file.size,
            status: 'pending_analysis'
          });

        if (dbError) throw dbError;

        fileObj.progress = 100;
        this.snackBar.open(`${file.name} uploaded successfully`, 'Close', { duration: 3000 });
      } catch (error) {
        console.error('Upload error:', error);
        fileObj.progress = 0;
        this.snackBar.open(`Error uploading ${file.name}`, 'Close', { duration: 3000 });
      }
    }

    this.isUploading = false;
    if (this.files.every(f => f.progress === 100)) {
      this.files = [];
      this.descriptionControls.clear();
    }
  }
} 
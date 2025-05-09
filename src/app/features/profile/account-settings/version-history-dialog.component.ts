import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileService, ProfileVersion } from '../../../core/services/profile.service';

@Component({
  selector: 'app-version-history-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule
  ],
  template: `
    <div class="version-history-dialog">
      <h2 mat-dialog-title>Version History</h2>
      <mat-dialog-content>
        <mat-list>
          <mat-list-item *ngFor="let version of versions">
            <div matListItemTitle>
              {{ version.type === 'personal' ? 'Personal Information' : 'Financial Goals' }}
            </div>
            <div matListItemLine>
              {{ version.createdAt | date:'medium' }}
            </div>
            <button mat-icon-button color="primary" (click)="restoreVersion(version)" matTooltip="Restore this version">
              <mat-icon>restore</mat-icon>
            </button>
          </mat-list-item>
        </mat-list>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onClose()">Close</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .version-history-dialog {
      padding: 24px;
      max-width: 600px;
    }

    mat-list {
      max-height: 400px;
      overflow-y: auto;
    }

    mat-list-item {
      margin-bottom: 8px;
    }

    ::ng-deep {
      .mat-mdc-list-item {
        height: auto !important;
        padding: 16px 0;
      }

      .mat-mdc-list-item-content {
        padding: 0 !important;
      }
    }
  `]
})
export class VersionHistoryDialogComponent implements OnInit {
  versions: ProfileVersion[] = [];

  constructor(
    private dialogRef: MatDialogRef<VersionHistoryDialogComponent>,
    private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadVersions();
  }

  async loadVersions() {
    try {
      this.versions = await this.profileService.getVersionHistory();
    } catch (error) {
      this.snackBar.open('Failed to load version history', 'Close', {
        duration: 3000,
        horizontalPosition: 'end'
      });
    }
  }

  async restoreVersion(version: ProfileVersion) {
    try {
      if (version.type === 'personal') {
        await this.profileService.updatePersonalInfo(version.data);
      } else {
        await this.profileService.updateFinancialGoals(version.data);
      }
      this.snackBar.open('Version restored successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'end'
      });
      this.dialogRef.close(true);
    } catch (error) {
      this.snackBar.open('Failed to restore version', 'Close', {
        duration: 3000,
        horizontalPosition: 'end'
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }
} 
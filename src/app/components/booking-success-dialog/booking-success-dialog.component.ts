import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-success-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  template: `
    <div class="success-dialog">
      <h2 mat-dialog-title>Booking Successful!</h2>
      <div mat-dialog-content>
        <p>Your tickets have been booked successfully.</p>
      </div>
      <div mat-dialog-actions>
        <button mat-button (click)="dialogRef.close('home')">Go to Home</button>
        <button mat-button color="primary" (click)="dialogRef.close('bookings')">View My Bookings</button>
      </div>
    </div>
  `,
  styles: [`
    .success-dialog {
      text-align: center;
      padding: 20px;
    }
    h2 {
      color: #4CAF50;
    }
    mat-dialog-actions {
      justify-content: center;
      gap: 10px;
    }
  `]
})
export class BookingSuccessDialogComponent {
  constructor(public dialogRef: MatDialogRef<BookingSuccessDialogComponent>) {}
}

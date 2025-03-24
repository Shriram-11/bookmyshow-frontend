import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-booking-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Confirm Booking</h2>
    <mat-dialog-content>
      <p>Please confirm your booking details:</p>
      <p>Movie: {{data.movieTitle}}</p>
      <p>Selected Seats: {{data.seats.join(', ')}}</p>
      <p>Total Amount: ₹{{data.totalAmount}}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onConfirm()">Confirm Booking</button>
    </mat-dialog-actions>
  `,
  styles:`button[mat-button] {
    padding: 10px 20px; /* Space inside the button */
    border-radius: 5px; /* Slight rounding of corners */
    border: none; /* Removes any default border */
    margin: 5px; /* Spaces between buttons */
    font-family: Arial, sans-serif; /* Sets the font style */
    cursor: pointer; /* Changes cursor to pointer on hover */
    display: inline-block; /* Ensures buttons are inline */
    transition: background-color 0.3s, color 0.3s; /* Smooth transition effects */
    color: #ffffff; /* Text color */
    background-color: #E11931; /* BookMyShow-like pinkish red color */
}

button[mat-button]:hover {
    background-color: #c01529; /* Darker shade on hover */
}

button[mat-button]:disabled {
    background-color: #a9a9a9; /* Grey out the button when disabled */
    cursor: not-allowed; /* Change cursor to denote disabled state */
}

/* Optional: Specific styles for primary buttons within your color theme */
button[mat-button][color="primary"] {
    background-color: #E11931; /* Ensure primary button matches your theme */
}

button[mat-button][color="primary"]:hover {
    background-color: #c01529; /* Consistent hover effect for primary button */
}`
})
export class BookingConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BookingConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      movieTitle: string;
      seats: string[];
      totalAmount: number;
    }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}

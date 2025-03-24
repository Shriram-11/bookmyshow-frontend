import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UserBookingDetails } from '../../models/booking.model';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-my-bookings',
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit {
  bookings: UserBookingDetails[] = [];
  selectedBooking: UserBookingDetails | null = null;
  isTicketView = false;
  elementType = 'canvas';
  qrCodeValue = '';
  apiUrl = environment.apiBaseUrl;
  displayCount = 3;  // Initial number of movies to display
  @ViewChild('ticketElement') ticketElement!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (!this.authService.getCurrentAuthStatus()) {
      alert('Please login to view your bookings');
      this.router.navigate(['movie-list']);
      return;
    }
    this.getBookings();
  }

  getBookings(): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<UserBookingDetails[]>(`${this.apiUrl}/api/user/bookings`, { headers })
      .subscribe({
        next: (response) => {
          this.bookings = response;
        },
        error: (error) => {
          console.error('Error fetching bookings:', error);
          alert('Failed to fetch bookings. Please try again later.');
        }
      });
  }

  showTicketView(booking: UserBookingDetails): void {
    this.selectedBooking = booking;
    this.isTicketView = true;
    this.qrCodeValue = booking.bookingId;
  }

  closeTicketView(): void {
    this.selectedBooking = null;
    this.isTicketView = false;
  }

  cancelBooking(bookingId: string): void {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      // This would typically make an API call to cancel the booking
      this.bookings = this.bookings.filter(b => b.bookingId !== bookingId);
      if (this.selectedBooking?.bookingId === bookingId) {
        this.closeTicketView();
      }
    }
  }

  // Add this getter method to get displayed bookings
  get displayedBookings(): UserBookingDetails[] {
    return this.bookings.slice(0, this.displayCount);
  }

  // Modify loadMore method
  loadMore(): void {
    this.displayCount += 3;
  }

  // Check if more bookings can be loaded
  hasMoreBookings(): boolean {
    return this.displayCount < this.bookings.length;
  }

  async downloadTicket(): Promise<void> {
    if (this.selectedBooking && this.ticketElement) {
      try {
        // Set specific styles for printing
        const originalPadding = this.ticketElement.nativeElement.style.padding;
        this.ticketElement.nativeElement.style.padding = '15px';
        
        // Generate canvas from the ticket element
        const canvas = await html2canvas(this.ticketElement.nativeElement, {
          scale: 2, // Higher quality
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#f8f8f8"
        });
        
        // Restore original padding
        this.ticketElement.nativeElement.style.padding = originalPadding;
        
        // Create PDF with appropriate size
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        
        // PDF size with margins
        const pdfWidth = Math.min(imgWidth, 800);
        const pdfHeight = pdfWidth / ratio;
        
        const pdf = new jsPDF({
          orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
          unit: 'px',
          format: [pdfWidth + 40, pdfHeight + 40]
        });
        
        // Add image centered on the page
        const x = 20;
        const y = 20;
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', x, y, pdfWidth, pdfHeight);
        
        // Save PDF
        pdf.save(`movie-ticket-${this.selectedBooking.bookingId}.pdf`);
      } catch (error) {
        console.error('Error creating PDF:', error);
      }
    }
  }

  goBack()
  {
    this.router.navigate(['']);
  }
}

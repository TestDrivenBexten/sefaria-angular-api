import { Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private http = inject(HttpClient);

  query = signal('');
  result = signal<unknown>(null);
  error = signal<string | null>(null);
  loading = signal(false);

  search(): void {
    const tref = this.query().trim();
    if (!tref) return;

    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    this.http.get(`https://www.sefaria.org/api/v3/texts/${encodeURIComponent(tref)}`).subscribe({
      next: (data) => {
        this.result.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message ?? 'Request failed');
        this.loading.set(false);
      }
    });
  }
}

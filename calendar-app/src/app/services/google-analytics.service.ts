import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  private initialised = false;

  init(): void {
    const measurementId = environment.googleAnalyticsId;

    if (this.initialised || !measurementId) {
      return;
    }
    this.initialised = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
  }
}

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
} 

class Analytics {
  private enabled: boolean;
  private gaId: string | undefined;

  constructor() {
    this.gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
    this.enabled = !!this.gaId && import.meta.env.PROD;
  }

  track(event: AnalyticsEvent): void {
    if (!this.enabled) {
      console.log('Analytics (dev):', event);
      return;
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      } as Record<string, unknown>);
    }
  }

  pageView(path: string): void {
    if (!this.enabled) return;

    if (typeof window.gtag === 'function' && this.gaId) {
      window.gtag('config', this.gaId, {
        page_path: path,
      } as Record<string, unknown>);
    }
  }
}

export const analytics = new Analytics();

export const trackEvent = {
  profileCreated: () => analytics.track({ category: 'Profile', action: 'created' }),
  eligibilityChecked: (schemeCount: number) =>
    analytics.track({ category: 'Eligibility', action: 'checked', value: schemeCount }),
  schemeViewed: (schemeId: string) =>
    analytics.track({ category: 'Scheme', action: 'viewed', label: schemeId }),
  schemeSaved: (schemeId: string) =>
    analytics.track({ category: 'Scheme', action: 'saved', label: schemeId }),
  voiceUsed: () => analytics.track({ category: 'Input', action: 'voice_used' }),
  formUsed: () => analytics.track({ category: 'Input', action: 'form_used' }),
};
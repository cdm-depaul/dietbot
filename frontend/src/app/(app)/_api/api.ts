'use client';

export class API {
  private api: string = 'http://localhost:8001'; // Default fallback
  private decoder: TextDecoder;

  constructor(decoder: TextDecoder = new TextDecoder()) {
    this.decoder = decoder;

    if (typeof window !== 'undefined') {
      try {
        const runtimeEnv =
          (window as any).__ENV__?.NEXT_PUBLIC_BACKEND_URL ||
          process.env.NEXT_PUBLIC_BACKEND_URL;
        console.log('🧪 Runtime env from window:', runtimeEnv);
        console.log('🧪 window.location.href:', window.location.href);

        if (runtimeEnv) {
          this.api = runtimeEnv;
        }
      } catch (err) {
        console.warn('⚠️ Failed to resolve backend URL at runtime:', err);
      }
    }

    console.log('🧪 Final API URL:', this.api);
  }

  /** Safely join base + path (prevents double slashes) */
  private join(path: string) {
    const base = this.api.replace(/\/+$/, '');
    const clean = String(path).replace(/^\/+/, '');
    return `${base}/${clean}`;
  }

  private buildHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const isLocalhost =
      typeof window !== 'undefined' && window.location.hostname === 'localhost';

    const idToken = process.env.NEXT_PUBLIC_ID_TOKEN;

    if (isLocalhost && idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
      console.log('🧪 Using ID token for auth (local)');
    }

    return headers;
  }

  public async postData(
    url: string,
    body: string,
    callback: (response: string) => void
  ): Promise<void> {
    const fullUrl = this.join(url);
    console.log('🧪 POSTing to:', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: this.buildHeaders(),
      body,
    });

    if (response.body) {
      const reader = response.body.getReader();
      let finish = false;
      while (!finish) {
        const { done: doneReading, value } = await reader.read();
        finish = doneReading;
        if (value !== undefined) {
          const { done, response } = JSON.parse(
            this.decoder.decode(value, { stream: true })
          );
          if (!doneReading) {
            callback(response);
          }
        }
      }
    }
  }

  public async postJsonData<T = any>(url: string, body: object): Promise<T> {
    const fullUrl = this.join(url);
    console.log('🧪 POSTing JSON to:', fullUrl);
    console.log('🧪 Payload:', body);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData}`
      );
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return (await response.json()) as T;
    } else {
      console.warn('Received non-JSON response or empty response body');
      return null as T;
    }
  }

  /** GET JSON helper */
  public async getJsonData<T = any>(url: string): Promise<T> {
    const fullUrl = this.join(url);
    console.log('🧪 GETting JSON from:', fullUrl);

    const res = await fetch(fullUrl, {
      method: 'GET',
      headers: this.buildHeaders(),
      // credentials: 'include', // uncomment if your backend needs cookies
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      throw new Error(`GET ${fullUrl} failed: ${res.status} ${msg}`);
    }
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? ((await res.json()) as T) : (null as T);
  }

  /** Convenience wrapper specifically for user profile */
  public async getUserProfile<T = any>(userId: number): Promise<T> {
    // call WITHOUT a leading slash — join() handles it either way
    return this.getJsonData<T>(`users/${userId}/profile`);
  }

  /** Chat: fetch recent history (newest-first from API, you can reverse in UI) */
  public async getRecentChat(
    userId: number,
    limit = 12
  ): Promise<{ sender: 'user' | 'assistant'; message: string; created_at: string }[]> {
    return this.getJsonData(`chat/${userId}/recent?limit=${limit}`);
  }

  /** Chat: append a single turn (optional—/ask already persists both sides) */
  public async appendChatTurn(
    userId: number,
    turn: { sender: 'user' | 'assistant'; message: string }
  ): Promise<{ ok: true }> {
    return this.postJsonData(`chat/${userId}/append`, turn);
  }

  /** Chat: ask the assistant (persists user+assistant messages server-side) */
  public async askChat(
    userId: number,
    query: string
  ): Promise<{ response: string }> {
    return this.postJsonData(`chat/${userId}/ask`, { query });
  }
}


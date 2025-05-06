export class API {
  constructor(
    private decoder: TextDecoder = new TextDecoder(),
    private api: string = 'http://localhost:8001'
  ) {}

  public async postData(
    url: string,
    body: string,
    callback: (response: string) => void
  ): Promise<void> {
    const response = await fetch(`${this.api}/${url}`, {
      method: 'Post',
      headers: {
        'content-type': 'application/json',
      },
      body,
    });
    if (response.body) {
      const reader = response.body?.getReader();
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

  public async postJsonData<T = any>(
    url: string,
    body: object
  ): Promise<T> {
    const response = await fetch(`${this.api}/${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return await response.json() as T;
    } else {
        console.warn('Received non-JSON response or empty response body');
        return null as T;
    }
  }
}

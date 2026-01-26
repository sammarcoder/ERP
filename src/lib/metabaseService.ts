class MetabaseService {
  private baseURL = 'http://localhost:2650/api';
  private sessionToken: string | null = null;

  async authenticate() {
    const response = await fetch(`${this.baseURL}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'samarabbas114433@gmail.com',
        password: 'metabase/metabase12'
      })
    });

    if (!response.ok) throw new Error('Login failed');
    
    const { id } = await response.json();
    this.sessionToken = id;
    return id;
  }

  async getQuestionData(questionId: number) {
    if (!this.sessionToken) await this.authenticate();

    const response = await fetch(`${this.baseURL}/card/${questionId}/query`, {
      method: 'POST',
      headers: {
        'X-Metabase-Session': this.sessionToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parameters: [] })
    });

    if (!response.ok) throw new Error(`Query failed: ${response.status}`);
    
    return await response.json();
  }
}

export default new MetabaseService();

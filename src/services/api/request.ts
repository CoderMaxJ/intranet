import { getUserToken } from "../UserToken/authUserToken";
class ApiService {
 
  private baseUrl = process.env.NEXT_PUBLIC_BACKEND;
  private token = getUserToken();


 async get(endpoint: string): Promise<any> {
  const response = await fetch(`${this.baseUrl}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
    },
  });

  console.log("========>", this.baseUrl);

  if (response.ok) {
    return await response.json();
  } else {
    const errorText = await response.text();
    throw new Error(`Fetch failed: ${response.status} - ${errorText}`);
  }
}

  async post(endpoint:string, data:string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to post");
    return await response.json();
  }
}

export default ApiService;

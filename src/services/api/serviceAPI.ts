import { getUserToken } from "../UserToken/authUserToken";

class ApiService {
 
  private baseUrl = process.env.NEXT_PUBLIC_BACKEND;
  private token = getUserToken();

 async get<T = unknown>(endpoint: string): Promise<T | number>{
  const response = await fetch(`${this.baseUrl}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.token}`,
    },
  });
  if (response.ok) {
    return await response.json();
  }else if(response.status === 401){
    return response.status;
  }
  throw new Error(`GET ${endpoint} failed`);
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

async patch(endpoint: string, empno: string | number) {
     const data = { empno: empno };
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization":`Bearer ${this.token}`
      },
      body: JSON.stringify(data),
    });
    if (response.status !== 204){
     return 400;
    }
    else if(response.status === 204){
     return 204;
    }  
  }
}

export default ApiService;

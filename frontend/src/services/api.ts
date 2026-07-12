import { DashboardStats, ScanReport, User } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("appsec_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(res);
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Scans
  async runScan(url: string): Promise<ScanReport> {
    const res = await fetch(`${API_URL}/scans/run`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ url }),
    });
    return handleResponse(res);
  },

  async getHistory(): Promise<ScanReport[]> {
    const res = await fetch(`${API_URL}/scans/history`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async deleteScan(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_URL}/scans/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_URL}/dashboard/stats`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getHealth(): Promise<{ status: string }> {
    const res = await fetch(`${API_URL}/health`, { method: "GET" });
    return handleResponse(res);
  }
};

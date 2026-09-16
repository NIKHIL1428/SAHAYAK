import { apiUrl } from "./config";

export class ApiError extends Error {
  status: number;
  errorType?: string;

  constructor(message: string, status: number, errorType?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorType = errorType;
  }
}

async function parseError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as { detail?: string; error_type?: string };
    return new ApiError(
      body.detail ?? `Request failed with status ${response.status}`,
      response.status,
      body.error_type
    );
  } catch {
    return new ApiError(`Request failed with status ${response.status}`, response.status);
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(apiUrl(path));

  if (!response.ok) {
    throw await parseError(response);
  }

  return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(apiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return response.json() as Promise<T>;
}

export async function apiPostForm<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(apiUrl(path), {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return response.json() as Promise<T>;
}

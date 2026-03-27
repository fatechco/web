import { BASE_URL } from "@/config/global";
import { deleteCookie, getCookie } from "cookies-next";
import { ErrorResponse } from "@/types/global";
import NetworkError from "@/utils/network-error";
import { notFound, redirect } from "next/navigation";
import { userActionOutsideOfComponent } from "@/global-store/user";

interface CustomRequestInit extends RequestInit {
  redirectOnError?: boolean;
}

const fetcher = async <T>(input: string | string[], init?: CustomRequestInit): Promise<T> => {
  const url = `${BASE_URL}${Array.isArray(input) ? input[0] : input}`;
  
  console.log("🌐 [fetcher] Request:", {
    url,
    method: init?.method || "GET",
    hasBody: !!init?.body,
    isFormData: init?.body instanceof FormData,
  });
  
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: getCookie("token") as string,
      ...init?.headers,
    },
  });
  
  console.log("📥 [fetcher] Response:", {
    url,
    status: res.status,
    ok: res.ok,
  });
  
  if (!res.ok) {
    const errorResponse = (await res.json()) as ErrorResponse;
    let errorMessage = errorResponse.message;
    if (errorResponse?.params) {
      errorMessage = Object.values(errorResponse.params)?.[0]?.[0];
    }
    if (res.status === 401) {
      userActionOutsideOfComponent({ user: null });
      deleteCookie("token");
      return redirect("/");
    }
    if (init?.redirectOnError && res.status === 404) {
      return notFound();
    }
    throw new NetworkError(errorMessage, res.status, errorResponse?.params);
  }
  return res.json();
};

export default fetcher;

interface MutationRequestInit extends Omit<RequestInit, "body" | "method"> {
  body?: unknown;
}

// POST method - hỗ trợ FormData
fetcher.post = async <T>(input: string, init?: MutationRequestInit): Promise<T> => {
  const isFormData = init?.body instanceof FormData;
  
  // Xử lý body: nếu là FormData thì giữ nguyên, không thì stringify
  let body: BodyInit | null | undefined = undefined;
  if (init?.body !== undefined) {
    if (isFormData) {
      body = init.body as FormData;
    } else {
      body = JSON.stringify(init.body);
    }
  }
  
  return fetcher(input, {
    ...init,
    method: "POST",
    body,
    headers: {
      // Không set Content-Type khi là FormData (browser tự set với boundary)
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });
};

// PUT method - hỗ trợ FormData
fetcher.put = async <T>(input: string, init?: MutationRequestInit): Promise<T> => {
  const isFormData = init?.body instanceof FormData;
  
  let body: BodyInit | null | undefined = undefined;
  if (init?.body !== undefined) {
    if (isFormData) {
      body = init.body as FormData;
    } else {
      body = JSON.stringify(init.body);
    }
  }
  
  return fetcher(input, {
    ...init,
    method: "PUT",
    body,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });
};

// DELETE method
fetcher.delete = async <T>(input: string, init?: MutationRequestInit): Promise<T> => {
  let body: BodyInit | null | undefined = undefined;
  if (init?.body !== undefined) {
    body = JSON.stringify(init.body);
  }
  
  return fetcher(input, {
    ...init,
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...init?.headers },
    body,
  });
};

// PATCH method - hỗ trợ FormData
fetcher.patch = async <T>(input: string, init?: MutationRequestInit): Promise<T> => {
  const isFormData = init?.body instanceof FormData;
  
  let body: BodyInit | null | undefined = undefined;
  if (init?.body !== undefined) {
    if (isFormData) {
      body = init.body as FormData;
    } else {
      body = JSON.stringify(init.body);
    }
  }
  
  return fetcher(input, {
    ...init,
    method: "PATCH",
    body,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });
};
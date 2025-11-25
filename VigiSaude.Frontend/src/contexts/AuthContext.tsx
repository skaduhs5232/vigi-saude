import { ReactNode, createContext, useCallback, useMemo, useState } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "admin";
};

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthSession {
  user: AuthUser;
  token: string | null;
  refreshToken: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => void;
}

const SESSION_STORAGE_KEY = "vigiSaudeAuthSession";
const AUTH_BASE_URL = "https://vigisaude.cleitonween.com.br";
const LOGIN_URL = `${AUTH_BASE_URL}/login?useCookies=false&useSessionCookies=false`;
const REGISTER_URL = `${AUTH_BASE_URL}/register`;

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type JsonValue = Record<string, unknown> | string | null;

const readFromStorage = <T,>(key: string): T | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const writeToStorage = (key: string, value: unknown) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* silently ignore storage errors */
  }
};

const removeFromStorage = (key: string) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* silently ignore storage errors */
  }
};

const pickFirst = (source: Record<string, unknown> | undefined, keys: string[]): unknown => {
  if (!source) {
    return undefined;
  }
  for (const key of keys) {
    if (key in source) {
      const value = source[key];
      if (value !== undefined && value !== null && value !== "") {
        return value;
      }
    }
  }
  return undefined;
};

const inferNameFromEmail = (email: string): string => {
  const normalized = email.trim();
  const atIndex = normalized.indexOf("@");
  if (atIndex > 0) {
    return normalized.slice(0, atIndex);
  }
  return normalized || "Administrador";
};

const readResponsePayload = async (response: Response): Promise<JsonValue> => {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      return (await response.json()) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return text;
  }
};

const extractErrorMessage = (payload: JsonValue, fallback: string): string => {
  if (!payload) {
    return fallback;
  }

  if (typeof payload === "string") {
    return payload;
  }

  const message =
    (pickFirst(payload, ["detail", "title", "message", "error", "Message", "Detail"]) as string | undefined) ??
    fallback;

  return message;
};

const normalizeSession = (
  payload: JsonValue,
  email: string,
  displayName?: string
): AuthSession => {
  const fallbackEmail = email.trim().toLowerCase();
  const fallbackName = displayName?.trim() || inferNameFromEmail(fallbackEmail);

  const payloadRecord = typeof payload === "object" && payload !== null && !Array.isArray(payload)
    ? (payload as Record<string, unknown>)
    : undefined;

  const userSourceRaw = payloadRecord && typeof payloadRecord.user === "object" && payloadRecord.user
    ? (payloadRecord.user as Record<string, unknown>)
    : payloadRecord;

  const emailFromPayload = pickFirst(userSourceRaw, ["email", "Email"]) ?? pickFirst(payloadRecord, ["email", "Email"]);
  const idFromPayload = pickFirst(userSourceRaw, ["id", "Id", "userId", "UserId"]) ?? pickFirst(payloadRecord, ["id", "Id", "userId", "UserId"]);
  const nameFromPayload = pickFirst(userSourceRaw, ["name", "Name", "fullName", "FullName", "userName", "UserName"]);

  const tokenFromPayload = pickFirst(payloadRecord, [
    "token",
    "accessToken",
    "access_token",
    "jwt",
    "jwtToken",
    "idToken",
  ]) as string | undefined;

  const refreshToken = pickFirst(payloadRecord, ["refreshToken", "refresh_token"]) as string | undefined;

  const resolvedEmail = String(emailFromPayload ?? fallbackEmail).toLowerCase();
  const nameFromPayloadNormalized = typeof nameFromPayload === "string" ? nameFromPayload.trim() : "";
  const resolvedName = displayName?.trim() || nameFromPayloadNormalized || fallbackName;
  const resolvedId = String(idFromPayload ?? resolvedEmail);

  const user: AuthUser = {
    id: resolvedId,
    name: resolvedName,
    email: resolvedEmail,
    role: "admin",
  };

  return {
    user,
    token: tokenFromPayload ? tokenFromPayload.toString() : null,
    refreshToken: refreshToken ? refreshToken.toString() : null,
  };
};

const postJson = async (url: string, body: Record<string, unknown>) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify(body),
    });

    const payload = await readResponsePayload(response);

    if (!response.ok) {
      const message = extractErrorMessage(payload, "Não foi possível concluir a autenticação.");
      throw new Error(message);
    }

    return payload;
  } catch (error) {
    if (error instanceof Error) {
      const isNetworkFailure = error.name === "TypeError" || /NetworkError/i.test(error.message) || /Failed to fetch/i.test(error.message);
      if (isNetworkFailure) {
        throw new Error("Não foi possível conectar ao servidor de autenticação.");
      }
      throw error;
    }
    throw new Error("Não foi possível conectar ao servidor de autenticação.");
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(() => readFromStorage<AuthSession>(SESSION_STORAGE_KEY));

  const persistSession = useCallback((authSession: AuthSession | null) => {
    if (authSession) {
      writeToStorage(SESSION_STORAGE_KEY, authSession);
    } else {
      removeFromStorage(SESSION_STORAGE_KEY);
    }
  }, []);

  const applySession = useCallback((authSession: AuthSession | null) => {
    setSession(authSession);
    persistSession(authSession);
  }, [persistSession]);

  const performLogin = useCallback(
    async (email: string, password: string, overrides?: Partial<AuthUser>) => {
      const payload = await postJson(LOGIN_URL, {
        email: email.trim(),
        password,
        twoFactorCode: "",
        twoFactorRecoveryCode: "",
      });

      const nextSession = normalizeSession(payload, email, overrides?.name);
      const mergedSession: AuthSession = overrides
        ? {
            ...nextSession,
            user: {
              ...nextSession.user,
              ...overrides,
            },
          }
        : nextSession;

      applySession(mergedSession);
      return mergedSession.user;
    },
    [applySession]
  );

  const login = useCallback(async (email: string, password: string) => {
    if (!email.trim() || !password) {
      throw new Error("Informe e-mail e senha válidos.");
    }
    return performLogin(email, password);
  }, [performLogin]);

  const register = useCallback(async ({ name, email, password }: RegisterPayload) => {
    const normalizedEmail = email.trim();
    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new Error("Informe o nome completo.");
    }
    if (!normalizedEmail) {
      throw new Error("Informe um e-mail válido.");
    }
    if (!password) {
      throw new Error("Informe uma senha válida.");
    }

    await postJson(REGISTER_URL, {
      email: normalizedEmail,
      password,
    });

    return performLogin(normalizedEmail, password, { name: normalizedName });
  }, [performLogin]);

  const logout = useCallback(() => {
    applySession(null);
  }, [applySession]);

  const value = useMemo<AuthContextValue>(() => ({
    user: session?.user ?? null,
    token: session?.token ?? null,
    isAuthenticated: Boolean(session?.user),
    login,
    register,
    logout,
  }), [session, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

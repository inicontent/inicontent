import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";

interface PasskeyBeginOptions {
  challenge: string;
  challengeRef?: string;
  [key: string]: unknown;
}

type PasskeyBeginResponse = apiResponse<PasskeyBeginOptions>;
type LoginPayload = User & { sessionID: string };
type LoginResponse = apiResponse<LoginPayload>;
type PasskeyRegisterResponse = apiResponse<Record<string, unknown>>;

export function usePasskeyAuth() {
  const config = useRuntimeConfig();
  const database = useState<Database>("database");
  const language = useCookie<LanguagesType>("language", { sameSite: true });

  const isPasskeySupported = computed(
    () => import.meta.client && typeof window.PublicKeyCredential !== "undefined",
  );

  function mapPasskeyError(error: unknown, fallback: string) {
    if (!(error instanceof Error)) return fallback;

    if (error.name === "AbortError") {
      return "Passkey prompt was closed before completion.";
    }

    if (error.name === "NotAllowedError") {
      return "Passkey verification was cancelled or not allowed.";
    }

    if (error.name === "InvalidStateError") {
      return "This device is already registered with a passkey for this account.";
    }

    return error.message || fallback;
  }

  async function beginPasskeySignIn(identifier: string) {
    const beginResponse = await $fetch<PasskeyBeginResponse>(
      `${config.public.apiBase}${database.value.slug}/auth/passkey/authenticate/begin`,
      {
        method: "PUT",
        credentials: "include",
        body: {
          identifier,
        },
        params: {
          locale: language.value,
        },
      },
    );

    if (!beginResponse.result?.challenge) {
      throw new Error(beginResponse.message || "Passkey sign-in could not start");
    }

    let credential: unknown;
    try {
      credential = await startAuthentication({
        optionsJSON: beginResponse.result,
      });
    } catch (error) {
      throw new Error(
        mapPasskeyError(error, "Passkey sign-in could not be completed"),
      );
    }

    return $fetch<LoginResponse>(
      `${config.public.apiBase}${database.value.slug}/auth/passkey/authenticate/complete`,
      {
        method: "PUT",
        credentials: "include",
        body: {
          identifier,
          challenge: beginResponse.result.challenge,
          challengeRef: beginResponse.result.challengeRef,
          credential,
        },
        params: {
          locale: language.value,
        },
      },
    );
  }

  async function registerCurrentUserPasskey() {
    const beginResponse = await $fetch<PasskeyBeginResponse>(
      `${config.public.apiBase}${database.value.slug}/auth/passkey/register/begin`,
      {
        method: "PUT",
        credentials: "include",
        body: {
          source: "auth",
        },
        params: {
          locale: language.value,
        },
      },
    );

    if (!beginResponse.result?.challenge) {
      throw new Error(beginResponse.message || "Passkey registration could not start");
    }

    let credential: unknown;
    try {
      credential = await startRegistration({
        optionsJSON: beginResponse.result,
      });
    } catch (error) {
      throw new Error(
        mapPasskeyError(error, "Passkey registration could not be completed"),
      );
    }

    return $fetch<PasskeyRegisterResponse>(
      `${config.public.apiBase}${database.value.slug}/auth/passkey/register/complete`,
      {
        method: "PUT",
        credentials: "include",
        body: {
          challenge: beginResponse.result.challenge,
          challengeRef: beginResponse.result.challengeRef,
          credential,
        },
        params: {
          locale: language.value,
        },
      },
    );
  }

  return {
    isPasskeySupported,
    beginPasskeySignIn,
    registerCurrentUserPasskey,
  };
}

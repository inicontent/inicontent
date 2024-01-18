export const useGlobalCookie = <T>(cookieName: string) => {
  const cookie = useState<T>(cookieName, () => useCookie<T>(cookieName).value);

  watch(cookie, (newValue) => (useCookie<T>(cookieName).value = newValue), {
    deep: true,
  });

  return cookie;
};

export const useGlobalCookie = (cookieName) => {
  const cookie = useState(
    cookieName,
    () =>
      useCookie(cookieName, {
        default: () => null,
      }).value
  );

  watch(
    cookie,
    (newValue) => {
      useCookie(cookieName).value = newValue;
    },
    { deep: true }
  );

  return cookie;
};

export const useGlobalCookie = (cookieName) => {
  const cookie = useState(cookieName, () => {
    return useCookie(cookieName, {
      default: () => ({}),
    });
  });

  watch(
    cookie,
    (newValue) => {
      useCookie(cookieName).value = newValue;
    },
    { deep: true }
  );

  return cookie;
};

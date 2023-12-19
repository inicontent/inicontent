export default defineNuxtPlugin(() => {
  const event = useRequestEvent(),
    ip = <any>useState("ip", () => null),
    userAgent = <any>useState("userAgent", () => null);

  ip.value = event.node.req.headers["x-forwarded-for"];
  userAgent.value = event.node.req.headers["user-agent"];
});

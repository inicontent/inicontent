export default defineWrappedResponseHandler((event: any) => {
  if (!event.context.user) throw new Error("login_first");
  return [event.context.user, 202];
});

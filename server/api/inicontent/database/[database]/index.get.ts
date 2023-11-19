export default defineWrappedResponseHandler((event: any) => {
  if (event.context.child_database === null) return [null, 404];
  return [event.context.child_database ?? event.context.database, 202];
});

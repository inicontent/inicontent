export default defineWrappedResponseHandler((event: any) => {
  if (!event.context.table) throw new Error("404");
  return [event.context.child_table ?? event.context.table, 202];
});

export function ErrorState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-red-200">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-red-100/80">{message}</p>
    </div>
  );
}

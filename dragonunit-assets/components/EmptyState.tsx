export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#252A35] bg-[#10131A] p-10 text-center">
      <h3 className="text-2xl font-semibold text-[#F5F7FA]">{title}</h3>
      <p className="mt-3 text-[#9AA1AE]">{description}</p>
    </div>
  );
}

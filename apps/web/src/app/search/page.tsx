import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;

  return (
    <AppLayout query={q}>
      <Main posts={[]} />
    </AppLayout>
  );
}

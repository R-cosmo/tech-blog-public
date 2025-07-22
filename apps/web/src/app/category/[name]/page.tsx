import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  return (
    <AppLayout>
      <Main posts={[]} />
    </AppLayout>
  );
}

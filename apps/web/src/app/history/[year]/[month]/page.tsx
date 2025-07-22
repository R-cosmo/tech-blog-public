import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  return (
    <AppLayout>
      <Main posts={[]} />
    </AppLayout>
  );
}

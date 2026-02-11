import { Article } from "@/components/article/article";

export default function PrivacyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Article>{children}</Article>;
}

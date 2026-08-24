import { Article } from "@/components/article/article";

export default function ContactPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Article>{children}</Article>;
}

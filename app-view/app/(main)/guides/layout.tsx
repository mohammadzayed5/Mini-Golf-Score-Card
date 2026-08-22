import { Article } from "@/components/article/article";

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Article>{children}</Article>;
}

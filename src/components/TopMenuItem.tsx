import Link from "next/link";

export default function TopMenuItem({
  title,
  pageRef,
}: {
  title: string;
  pageRef: string;
}) {
  return (
    <Link
      href={pageRef}
      className="text-base font-bold !text-gray-900 hover:!text-cyan-600"
    >
      {title}
    </Link>
  );
}
import Link from "next/link";
import React from "react";
type DashBoardCardPropsType = {
  title: string;
  data: number;
  Icon: React.ElementType;
  link: string;
};

export default function DashBoardCard({
  title,
  data,
  Icon,
  link,
}: DashBoardCardPropsType) {
  return (
    <Link
      href={link}
      className="rounded-2xl shadow-md p-6 flex items-center justify-between transition"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {title}
        </p>
        <h2 className="text-3xl font-semibold">{data}</h2>
      </div>
      <Icon className="text-4xl" style={{ color: "var(--accent)" }} />
    </Link>
  );
}

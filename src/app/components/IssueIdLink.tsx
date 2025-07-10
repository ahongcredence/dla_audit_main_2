"use client";

import Link from "next/link";

interface IssueIdLinkProps {
  value: string | number;
}

export default function IssueIdLink({ value }: IssueIdLinkProps) {
  return (
    <Link
      href={`/transaction-chain?recordId=${value}`}
      className="text-auditinsight-primary hover:underline"
    >
      {String(value)}
    </Link>
  );
}

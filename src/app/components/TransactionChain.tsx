import React from "react";

import { ArrowRight } from "lucide-react";

import { TransactionChainProps } from "../types";
import TransactionCard from "./TransactionCard";

export default function TransactionChain({
  cards,
  showArrows = true,
}: TransactionChainProps) {
  return (
    <div className="mb-4 flex w-full items-center justify-between px-4">
      {cards.map((card, index) => (
        <React.Fragment key={card.id}>
          <div className="flex-shrink-0">
            <TransactionCard card={card} />
          </div>
          {showArrows && index < cards.length - 1 && (
            <ArrowRight size={40} className="text-auditinsight-gray-80 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

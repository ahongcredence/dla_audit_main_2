import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  header?: {
    title: string | React.ReactNode;
    actions?: React.ReactNode;
  };
  footer?: {
    actions: React.ReactNode;
  };
  className?: string;
}

export default function Card({
  children,
  header,
  footer,
  className = "",
}: CardProps) {
  return (
    <div
      className={clsx(
        "border-auditinsight-gray-40 border",
        "bg-white px-3 py-2",
        "flex flex-col shadow-sm",
        "overflow-hidden rounded-sm",
        "h-full",
        className
      )}
    >
      {/* Optional Header */}
      {header && (
        <div className="-mx-3 -mt-2 mb-3 rounded-t-sm border-b border-gray-200 bg-gray-50 px-3 py-2 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-auditinsight-primary text-base leading-tight font-bold">
              {header.title}
            </h3>
            {header.actions && (
              <div className="flex items-center gap-1">{header.actions}</div>
            )}
          </div>
        </div>
      )}
      {/* Main Content Area */}
      <div className={`flex-1 text-xs leading-tight ${footer ? "pb-1" : ""}`}>
        {children}
      </div>
      {/* Optional Footer */}
      {footer && <div className="flex justify-end">{footer.actions}</div>}
    </div>
  );
}

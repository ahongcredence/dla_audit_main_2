"use client";

import { useRouter } from "next/navigation";

import clsx from "clsx";

// Define the AOI data structure
interface AreaOfInterest {
  id: string;
  title: string;
  description: string;
  color: string;
  hoverColor: string;
  disabled: boolean;
}

// Create AOI data array with Tailwind colors
const areasOfInterest: AreaOfInterest[] = [
  {
    id: "5.1",
    title: "Unresolved Accounting Issues",
    description:
      "Accounting issues and material weaknesses in internal controls that cause DoD to be unable to provide sufficient evidential support for financial statements.",
    color: "bg-gradient-to-br from-blue-900 to-blue-700",
    hoverColor: "hover:from-blue-800 hover:to-blue-600",
    disabled: true,
  },
  {
    id: "5.2",
    title: "Modernize Policies & Procedures",
    description:
      "Modernize policies, procedures and internal controls for procurement documentation, shipment tracking, and inventory systems.",
    color: "bg-gradient-to-br from-green-900 to-green-700",
    hoverColor: "hover:from-green-800 hover:to-green-600",
    disabled: true,
  },
  {
    id: "5.3",
    title: "Fund Balance with Treasury",
    description:
      "Reconcile the activity that impact the Fund Balance with Treasury (FBwT) between the general ledger and the US treasury.",
    color: "bg-gradient-to-br from-yellow-900 to-yellow-700",
    hoverColor: "hover:from-yellow-800 hover:to-yellow-600",
    disabled: true,
  },
  {
    id: "5.4",
    title: "Financial Systems Compliance",
    description:
      "Update financial systems to substantially comply with The Federal Financial Management Improvement Act of 1996 (FFMIA).",
    color: "bg-gradient-to-br from-purple-900 to-purple-700",
    hoverColor: "hover:from-purple-800 hover:to-purple-600",
    disabled: true,
  },
  {
    id: "5.5",
    title: "Internal Controls Implementation",
    description:
      "Design and implement internal controls related to access controls, configuration management, segregation of duties, security, IT operations, and interfaces.",
    color: "bg-gradient-to-br from-indigo-900 to-indigo-700",
    hoverColor: "hover:from-indigo-800 hover:to-indigo-600",
    disabled: true,
  },
  {
    id: "5.6",
    title: "Property, Plant & Equipment",
    description:
      "Support the valuation, existence and completeness of general property plant equipment (PP&E).",
    color: "bg-gradient-to-br from-pink-900 to-pink-700",
    hoverColor: "hover:from-pink-800 hover:to-pink-600",
    disabled: true,
  },
  {
    id: "5.7",
    title: "Lease Compliance",
    description:
      "Implement processes to comply with the Statement of Federal Financial Accounting Standards 54 (Leases).",
    color: "bg-gradient-to-br from-red-900 to-red-700",
    hoverColor: "hover:from-red-800 hover:to-red-600",
    disabled: true,
  },
  {
    id: "5.8",
    title: "Joint Strike Fighter Program",
    description:
      "Account for, manage, or report Joint Strike Fighter Program government property, composed of Global Spares Pool assets.",
    color: "bg-gradient-to-br from-orange-900 to-orange-700",
    hoverColor: "hover:from-orange-800 hover:to-orange-600",
    disabled: true,
  },
  {
    id: "5.9",
    title: "Environmental Liabilities",
    description:
      "Support the completeness and accuracy of environmental liabilities recorded in the financial statements.",
    color: "bg-gradient-to-br from-amber-900 to-amber-700",
    hoverColor: "hover:from-amber-800 hover:to-amber-600",
    disabled: true,
  },
  {
    id: "5.10",
    title: "Beginning Balances",
    description:
      "Establish balances and implement a DoD-wide procedure to monitor, report, and ensure DoD Components have complete and accurate beginning balances.",
    color: "bg-gradient-to-br from-lime-900 to-lime-700",
    hoverColor: "hover:from-lime-800 hover:to-lime-600",
    disabled: true,
  },
  {
    id: "5.11",
    title: "Unsupported Journal Vouchers",
    description:
      "Develop a method to research and correct the underlying problems that result in unsupported journal vouchers.",
    color: "bg-gradient-to-br from-emerald-900 to-emerald-700",
    hoverColor: "hover:from-emerald-800 hover:to-emerald-600",
    disabled: true,
  },
  {
    id: "5.12",
    title: "Trading Partner Reconciliation",
    description:
      "Obtain from accounting systems the support necessary to reconcile trading partner differences in accounting (Revenue and expenses, accounts payable, accounts receivable, etc.)",
    color: "bg-gradient-to-br from-teal-900 to-teal-700",
    hoverColor: "hover:from-teal-800 hover:to-teal-600",
    disabled: false,
  },
  {
    id: "5.13",
    title: "Automated Financial Reporting",
    description:
      "Eliminate excessive manual preparation of the annual financial report (to include note disclosures and background information).",
    color: "bg-gradient-to-br from-cyan-900 to-cyan-700",
    hoverColor: "hover:from-cyan-800 hover:to-cyan-600",
    disabled: true,
  },
  {
    id: "5.14",
    title: "DLA Inventory Data Aggregation",
    description:
      "Aggregate all DLA inventory data into a single system and reconcile the data to all feeder systems real-time.",
    color: "bg-gradient-to-br from-sky-900 to-sky-700",
    hoverColor: "hover:from-sky-800 hover:to-sky-600",
    disabled: true,
  },
];

export default function AOISelectionPage() {
  const router = useRouter();

  const handleCardClick = (aoiId: string) => {
    // Only navigate if the card is not disabled (only 5.12 for now)
    if (aoiId === "5.12") {
      router.push("/audit-workbench");
    }
  };

  // Custom fullscreen layout without sidebar or page title
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Select Area of Interest
          </h1>
          <p className="mx-auto max-w-3xl text-gray-600">
            Below are major categories impacting the DoD audit results.
            Currently, only the Trading Partner Reconciliation (5.12)
            functionality is available in this application.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {areasOfInterest.map(aoi => (
            <button
              key={aoi.id}
              onClick={() => handleCardClick(aoi.id)}
              disabled={aoi.disabled}
              className={clsx(
                "overflow-hidden rounded-sm border",
                "border-gray-200 p-3 text-left",
                "shadow-sm transition-all duration-200",
                aoi.color,
                !aoi.disabled ? aoi.hoverColor : "",
                aoi.disabled
                  ? "cursor-not-allowed opacity-60"
                  : "transform hover:scale-[1.02] hover:shadow-lg"
              )}
              aria-label={`${aoi.title}${aoi.disabled ? " (not available)" : ""}`}
            >
              <div className="flex h-full flex-col">
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{aoi.title}</h3>
                  <span className="rounded-full bg-white px-1.5 py-0.5 text-xs font-semibold text-gray-800">
                    {aoi.id}
                  </span>
                </div>
                <p className="line-clamp-2 flex-grow text-xs text-gray-100">
                  {aoi.description}
                </p>

                {!aoi.disabled && (
                  <div className="mt-2 flex justify-end">
                    <span className="inline-flex items-center rounded-sm bg-white px-1.5 py-0.5 text-xs font-medium text-teal-800">
                      Available
                    </span>
                  </div>
                )}

                {aoi.disabled && (
                  <div className="mt-2 flex justify-end">
                    <span className="inline-flex items-center rounded-sm bg-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-800">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

import Card from "./Card";

export default function CardExamples() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <h1 className="text-foreground mb-8 text-2xl font-bold">
        Card Component Examples
      </h1>

      {/* Simple Card */}
      <Card>
        <h3 className="mb-2 text-lg font-semibold">Simple Card</h3>
        <p className="text-foreground/70">
          This is a basic card with just content. No header or footer.
        </p>
      </Card>

      {/* Card with Header */}
      <Card header={{ title: "Card with Header" }}>
        <p className="text-foreground/70">
          This card has a header with a title. The header is separated from the
          content with a subtle border.
        </p>
      </Card>

      {/* Card with Header and Actions */}
      <Card
        header={{
          title: "Card with Header Actions",
          actions: (
            <div className="flex gap-2">
              <button className="bg-wds-blue-50 hover:bg-wds-blue-60 rounded-sm px-3 py-1 text-sm text-white transition-colors">
                Edit
              </button>
              <button className="border-wds-gray-30 text-foreground hover:bg-wds-gray-5 rounded-sm border px-3 py-1 text-sm transition-colors">
                View
              </button>
            </div>
          ),
        }}
      >
        <p className="text-foreground/70">
          This card has a header with both a title and action buttons. Actions
          are positioned on the right side of the header.
        </p>
      </Card>

      {/* Card with Footer */}
      <Card
        footer={{
          actions: (
            <div className="flex gap-2">
              <button className="border-wds-gray-30 text-foreground hover:bg-wds-gray-5 rounded-sm border px-4 py-2 transition-colors">
                Cancel
              </button>
              <button className="bg-wds-blue-50 hover:bg-wds-blue-60 rounded-sm px-4 py-2 text-white transition-colors">
                Save
              </button>
            </div>
          ),
        }}
      >
        <h3 className="mb-2 text-lg font-semibold">Card with Footer</h3>
        <p className="text-foreground/70">
          This card has a footer with action buttons. Footer actions are
          typically right-aligned and used for form submissions or
          confirmations.
        </p>
      </Card>

      {/* Full Card with Header and Footer */}
      <Card
        header={{
          title: "Complete Card Example",
          actions: (
            <button className="text-wds-gray-60 hover:text-foreground px-3 py-1 text-sm transition-colors">
              ⋯
            </button>
          ),
        }}
        footer={{
          actions: (
            <div className="flex gap-2">
              <button className="border-wds-gray-30 text-foreground hover:bg-wds-gray-5 rounded-sm border px-4 py-2 transition-colors">
                Discard
              </button>
              <button className="bg-auditinsight-primary rounded-sm px-4 py-2 text-white transition-opacity hover:opacity-90">
                Apply Changes
              </button>
            </div>
          ),
        }}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Full Featured Card</h3>
          <p className="text-foreground/70">
            This card demonstrates all features: header with title and actions,
            main content area, and footer with action buttons.
          </p>
          <div className="bg-wds-gray-5 rounded-sm border p-4">
            <p className="text-foreground/60 text-sm">
              The card component is highly flexible and can accommodate various
              content types and layouts.
            </p>
          </div>
        </div>
      </Card>

      {/* Card with Custom Styling */}
      <Card
        className="border-auditinsight-secondary shadow-xl"
        header={{ title: "Custom Styled Card" }}
      >
        <p className="text-foreground/70">
          This card uses the optional className prop to apply custom styling,
          including a different border color and enhanced shadow.
        </p>
      </Card>
    </div>
  );
}

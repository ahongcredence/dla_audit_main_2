interface HelloWorldProps {
  appName: string;
  description?: string;
}

export default function HelloWorld({ appName, description }: HelloWorldProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="text-center">
        <h1 className="text-foreground mb-4 text-3xl font-bold">{appName}</h1>
        <p className="text-foreground/70 mb-8">
          {description ||
            `Welcome to ${appName}. This is a placeholder component that will be replaced with the actual application.`}
        </p>
        <div className="bg-foreground/5 border-foreground/10 rounded-sm border p-8">
          <h2 className="mb-4 text-xl font-semibold">Ready for Integration</h2>
          <p className="text-foreground/60">
            This component is ready to be replaced with your actual {appName}{" "}
            implementation. The routing and navigation are fully functional.
          </p>
        </div>
      </div>
    </div>
  );
}

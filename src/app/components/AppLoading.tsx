interface AppLoadingProps {
  title: string;
}

export default function AppLoading({ title }: AppLoadingProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      {/* Logo Placeholder */}
      <div className="mb-8">
        <div className="bg-foreground/10 flex h-16 w-16 items-center justify-center rounded-sm">
          {/* Logo will go here */}
          <div className="bg-foreground/20 h-8 w-8 rounded-sm"></div>
        </div>
      </div>

      {/* Loading Title */}
      <h2 className="text-foreground mb-6 text-center text-xl font-medium">
        Loading {title}
      </h2>

      {/* Animated Progress Bar */}
      <div className="w-full max-w-md">
        <div className="bg-foreground/10 h-2 overflow-hidden rounded-full">
          <div className="bg-foreground/70 animate-loading-bar h-full rounded-full"></div>
        </div>
      </div>

      {/* Loading Text */}
      <p className="text-foreground/60 mt-4 text-sm">
        Please wait while we prepare your application...
      </p>
    </div>
  );
}

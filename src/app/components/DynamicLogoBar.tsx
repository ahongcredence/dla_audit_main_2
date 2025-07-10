"use client";

import Image from "next/image";

export default function DynamicLogoBar() {
  return (
    <div className="bg-auditinsight-primary-100 fixed top-0 right-0 left-0 z-[100] flex h-30 flex-row items-center justify-between py-4 shadow-sm">
      {/* Background SVG layer */}
      <div
        className="absolute inset-0 z-0 bg-[url('/00_DLA_ZerosOnes100percent_White-cropped.svg')] bg-cover bg-center bg-no-repeat"
        style={{
          maskImage: `
            radial-gradient(circle at 20% 30%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.06) 1%, rgba(0,0,0,0.03) 5%, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.01) 100%),
            radial-gradient(circle at 70% 20%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.07) 2%, rgba(0,0,0,0.04) 3%, rgba(0,0,0,0.01) 4%, rgba(0,0,0,0.01) 100%),
            radial-gradient(circle at 15% 80%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.06) 1%, rgba(0,0,0,0.03) 2%, rgba(0,0,0,0.01) 2%, rgba(0,0,0,0.01) 100%),
            radial-gradient(circle at 85% 70%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.07) 5%, rgba(0,0,0,0.04) 5%, rgba(0,0,0,0.01) 5%, rgba(0,0,0,0.01) 100%),
            radial-gradient(circle at 50% 60%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.05) 1%, rgba(0,0,0,0.01) 3%, rgba(0,0,0,0.01) 100%)
          `,
          WebkitMaskImage: `
            radial-gradient(circle at 20% 30%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.06) 1%, rgba(0,0,0,0.03) 5%, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.01) 100%),
            radial-gradient(circle at 70% 20%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.07) 2%, rgba(0,0,0,0.04) 3%, rgba(0,0,0,0.01) 4%, rgba(0,0,0,0.01) 100%),
            radial-gradient(circle at 15% 80%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.06) 1%, rgba(0,0,0,0.03) 2%, rgba(0,0,0,0.01) 2%, rgba(0,0,0,0.01) 100%),
            radial-gradient(circle at 85% 70%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.07) 5%, rgba(0,0,0,0.04) 5%, rgba(0,0,0,0.01) 5%, rgba(0,0,0,0.01) 100%),
            radial-gradient(circle at 50% 60%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.05) 1%, rgba(0,0,0,0.01) 3%, rgba(0,0,0,0.01) 100%)
          `,
          maskComposite: "add",
          WebkitMaskComposite: "source-over",
        }}
      ></div>

      <Image
        src="/albertFaceLogo.svg"
        alt="Albert Logo"
        height={100}
        width={200}
        className="relative ml-4"
        title="Albert Logo"
      />

      <div className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center justify-center">
        <Image
          src="/auditinsightWhite.svg"
          alt="Audit Insight Logo"
          width={350}
          height={88}
          className="z-10"
          title="Audit Insight Logo"
        />
      </div>

      <Image
        src="/dlaLogoWhite.svg"
        alt="DLA Logo"
        width={88}
        height={88}
        className="relative z-10 mr-4"
        title="DLA Logo"
      />
    </div>
  );
}

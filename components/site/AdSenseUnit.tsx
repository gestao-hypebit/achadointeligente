"use client";

import { useEffect } from "react";

interface Props {
  slot: string;
  format?: string;
  className?: string;
}

export function AdSenseUnit({ slot, format = "auto", className }: Props) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!adsenseId) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {}
  }, [adsenseId]);

  if (!adsenseId) return null;

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

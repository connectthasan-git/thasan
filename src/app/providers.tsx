"use client";

import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

export default function Providers({ children }: { children: ReactNode }) {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isSplashFadingOut, setIsSplashFadingOut] = useState(false);

  useEffect(() => {
    const startFadeTimer = setTimeout(() => {
      setIsSplashFadingOut(true);
    }, 2600);

    const hideSplashTimer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3400);

    return () => {
      clearTimeout(startFadeTimer);
      clearTimeout(hideSplashTimer);
    };
  }, []);

  return (
    <AuthProvider>
      <Toaster position="top-right" />
      {isSplashVisible ? (
        <div className={`splash-screen ${isSplashFadingOut ? "splash-screen--fade-out" : ""}`}>
          <div className="splash-screen__content">
            <div className="splash-screen__glow" aria-hidden="true" />
            <div className="splash-screen__logo-crop" aria-hidden="true">
              <Image
                src="/assets/splash_screen.png"
                alt="Thasan Platform"
                width={520}
                height={520}
                priority
                className="splash-screen__image splash-screen__image--logo-only"
              />
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthProvider>
  );
}

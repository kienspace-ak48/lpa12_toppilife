import { useEffect, useRef } from "react";

/** Fallback khi chưa có / chưa load được VITE_TURNSTILE_SITE_KEY (public) */
const DEFAULT_SITE_KEY = "0x4AAAAAACvpJLCIG15PhIWV";

const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export type TurnstileProps = {
  onVerify: (token: string) => void;
  siteKey?: string;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: (code?: string) => void;
          "expired-callback"?: () => void;
        },
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

/**
 * Inject script Turnstile — KHÔNG dùng async/defer (Cloudflare báo lỗi nếu dùng kèm turnstile.ready).
 * Ta không gọi ready() nữa; chỉ poll tới khi window.turnstile.render có sẵn.
 */
function ensureTurnstileScript(): void {
  if (typeof document === "undefined") return;
  const sel = `script[src="${TURNSTILE_SCRIPT_SRC}"]`;
  if (document.querySelector(sel)) return;
  const s = document.createElement("script");
  s.src = TURNSTILE_SCRIPT_SRC;
  // Script động mặc định async=true — tắt để tránh lỗi tương thích với Turnstile
  s.async = false;
  s.defer = false;
  document.head.appendChild(s);
}

export default function Turnstile({ onVerify, siteKey }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);

  const fromEnv = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim();
  const key =
    (siteKey && siteKey.trim()) || (fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_SITE_KEY);

  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    ensureTurnstileScript();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let pollId: ReturnType<typeof setInterval> | null = null;
    let initStarted = false;

    const doRender = () => {
      if (cancelled || widgetIdRef.current || initStarted) return;
      const el = containerRef.current;
      const ts = window.turnstile;
      if (!el || !ts || typeof ts.render !== "function") return;

      initStarted = true;

      const opts = {
        sitekey: key,
        callback: (token: string) => onVerifyRef.current(token),
        "error-callback": (code?: string) => {
          console.warn("[Turnstile] widget error:", code ?? "unknown");
          onVerifyRef.current("");
        },
        "expired-callback": () => onVerifyRef.current(""),
      };

      try {
        widgetIdRef.current = ts.render(el, opts);
      } catch (e) {
        console.warn("[Turnstile] render() failed:", e);
        onVerifyRef.current("");
        initStarted = false;
      }
      if (pollId) {
        clearInterval(pollId);
        pollId = null;
      }
    };

    pollId = setInterval(() => {
      if (cancelled) return;
      doRender();
    }, 50);
    const pollStop = setTimeout(() => {
      if (pollId) clearInterval(pollId);
      pollId = null;
      if (!cancelled && !widgetIdRef.current) {
        console.warn(
          "[Turnstile] Hết thời gian chờ. Kiểm tra mạng / adblock / Hostnames (localhost) trên Cloudflare.",
        );
      }
    }, 20000);

    return () => {
      cancelled = true;
      clearTimeout(pollStop);
      if (pollId) clearInterval(pollId);
      const wid = widgetIdRef.current;
      widgetIdRef.current = null;
      if (wid && window.turnstile) {
        try {
          window.turnstile.remove(wid);
        } catch {
          /* noop */
        }
      }
    };
  }, [key]);

  return <div ref={containerRef} className="cf-turnstile min-h-[65px] flex justify-center" />;
}

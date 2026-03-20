import { useState } from "react";
import { PlayCircle } from "lucide-react";

type VideoCardProps = {
  title?: string;
  label?: string;
  badge?: string;
  videoUrl?: string | null;
  fallbackImage: string;
};

function extractVideoId(url?: string | null): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    let id: string | null = null;

    if (parsed.hostname.includes("youtu.be")) {
      id = parsed.pathname.slice(1);
    }

    if (parsed.pathname === "/watch") {
      id = parsed.searchParams.get("v");
    }

    if (parsed.pathname.startsWith("/shorts/")) {
      id = parsed.pathname.split("/shorts/")[1];
    }

    if (parsed.pathname.startsWith("/embed/")) {
      id = parsed.pathname.split("/embed/")[1];
    }

    if (!id) return null;

    // 🔥 QUAN TRỌNG: remove query nếu có
    return id.split("?")[0];
  } catch {
    return null;
  }
}

const VideoCard = ({
  title,
  label,
  badge,
  videoUrl,
  fallbackImage,
}: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = extractVideoId(videoUrl);
  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : fallbackImage;

  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`
    : null;

  return (
    <div className="relative aspect-[9/16] bg-gray-200 rounded-2xl overflow-hidden group cursor-pointer">
      
      {/* 👉 Khi chưa click: show thumbnail */}
      {!isPlaying && (
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
      )}

      {/* 👉 Khi click: load iframe */}
      {isPlaying && embedUrl && (
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      )}

      {/* Overlay */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/30"
          onClick={() => setIsPlaying(true)}
        >
          <PlayCircle
            size={56}
            className="mb-2 opacity-90 group-hover:scale-110 transition-transform"
          />
          <span className="text-xs font-bold text-center px-2">
            {label}
          </span>
        </div>
      )}

      {/* Badge */}
      {badge && (
        <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
          {badge}
        </div>
      )}
    </div>
  );
};

export default VideoCard;
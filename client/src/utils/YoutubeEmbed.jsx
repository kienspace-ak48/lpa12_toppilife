import { useState } from "react"
import { Play } from "lucide-react";
import pre_video from 'pre_video';

export default function YoutubeEmbed({ videoId, thumbnail=pre_video }) {

  function getYoutubeId(input) {
    if (!input) return null

    if (input.length === 11 && !input.includes("http")) return input

    const reg = /(?:v=|\/embed\/|\.be\/)([A-Za-z0-9_-]{11})/
    const match = input.match(reg)
    return match ? match[1] : null
  }

  const videoIdHandle = getYoutubeId(videoId)
  const [play, setPlay] = useState(false)

  // ✅ Nếu không có video → return image luôn
  if (!videoIdHandle) {
    return (
      <div className="relative">
        <img
          src={thumbnail || "/no-video.jpg"}
          className="w-full aspect-video object-cover rounded-3xl shadow-2xl"
          alt="about image"
        />
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black z-10">
        
        {!play && (
          <>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <button
                onClick={() => setPlay(true)}
                className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-lg group"
              >
                <Play className="w-10 h-10 text-[#2dbdb6] ml-1 group-hover:text-green-700 transition-colors" />
              </button>
            </div>

            <img
              src={`https://img.youtube.com/vi/${videoIdHandle}/hqdefault.jpg`}
              className="w-full h-full object-cover opacity-90"
              alt="video thumbnail"
            />
          </>
        )}

        {play && (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoIdHandle}?autoplay=1`}
            title="YouTube video"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
      </div>
    </div>
  )
}

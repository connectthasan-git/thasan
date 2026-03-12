"use client";

interface LessonPlayerProps {
  videoUrl?: string;
  title: string;
}

export default function LessonPlayer({ videoUrl, title }: LessonPlayerProps) {
  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
        <p className="text-gray-400">No video available for this lesson</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
        <video
          src={videoUrl}
          controls
          className="w-full h-full"
          title={title}
        >
          <track kind="captions" />
          Your browser does not support the video tag.
        </video>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mt-4">{title}</h2>
    </div>
  );
}

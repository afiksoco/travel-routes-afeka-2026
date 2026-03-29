"use client";

interface RouteImageProps {
  imageUrl: string | null;
  alt: string;
}

export default function RouteImage({ imageUrl, alt }: RouteImageProps) {
  if (!imageUrl) return null;

  return (
    <div className="mt-3 rounded-xl overflow-hidden">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
    </div>
  );
}

import Image from "next/image";
import logo from "@/public/logo.png";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  alt = "",
  preload = false,
}: {
  className?: string;
  alt?: string;
  preload?: boolean;
}) {
  return (
    <Image
      src={logo}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      sizes="120px"
      preload={preload}
      className={cn("h-12 w-auto", className)}
    />
  );
}

import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

interface GeneratedAvatarProps {
  seed: string;
  className?: string;
  variant: "botttsNeutral" | "initials";
}

export const GeneratedAvatar = ({
  seed,
  className,
  variant,
}: GeneratedAvatarProps) => {
  let avatar;
  if (variant === "botttsNeutral") {
    avatar = createAvatar(botttsNeutral, {
      seed,
    });
  } else {
    avatar = createAvatar(initials, {
      seed,
      fontWeight: 500,
      fontSize: 42,
    });
  }
  return (
   



    <Avatar
      className={cn(
        "w-12 h-12 rounded-full overflow-hidden shrink-0", // small, circular, prevents resizing
        className
      )}
    >
      <AvatarImage
        src={avatar.toDataUri()}
        alt="Avatar"
        className="w-16 h-16 object-cover rounded-full"
      />
      <AvatarFallback className="flex items-center justify-center w-full h-full bg-muted text-sm font-medium rounded-full">
        {seed.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
  

   
   
};

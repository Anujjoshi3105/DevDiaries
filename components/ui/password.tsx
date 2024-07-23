import * as React from "react";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Password = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePassword = () => setShowPassword(prev => !prev);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
      <div 
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer select-none"
        onClick={handleTogglePassword}
      >
        {showPassword ? <EyeIcon /> : <EyeOffIcon />}
      </div>
    </div>
  );
});

Password.displayName = "Password";

export { Password };

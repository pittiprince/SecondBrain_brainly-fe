import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useEffect, useState } from "react";

interface AlertMessageProps {
  message: string;
}

export const AlertMessage = ({ message }: AlertMessageProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer); // Clear timeout on component unmount or when message changes
  }, [message]); // Adding `message` in dependency to reset when it changes

  if (!visible) {
    return null;
  }

  return (
    <Alert className="w-[20rem] absolute left-12">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

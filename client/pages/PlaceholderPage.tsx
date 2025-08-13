import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-4rem)] pb-20 lg:pb-0 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Construction className="w-12 h-12 text-muted-foreground" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground mb-6">{description}</p>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            This feature is being developed. Continue prompting to have it built
            out!
          </p>

          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

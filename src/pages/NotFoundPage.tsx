import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <main className="min-h-screen bg-bg-warm flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-black text-primary-olive/5 absolute select-none">404</h1>
      <div className="relative z-10">
        <h2 className="text-4xl font-bold text-primary-olive font-serif mb-4">
          Page Not Found
        </h2>
        <p className="text-text-muted mb-8 max-w-md font-medium">
          The destination you are looking for does not exist or has been moved to a new horizon.
        </p>
        <Button asChild className="bg-primary-olive hover:bg-primary-olive/90 text-white rounded-full px-8 font-bold">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </main>
  );
}

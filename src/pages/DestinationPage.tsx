import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { PackageGrid } from "@/components/PackageGrid";
import { StayGrid } from "@/components/StayGrid";
import { Skeleton } from "@/components/ui/skeleton";

export function DestinationPage() {
  const { destinationId } = useParams<{ destinationId: string }>();
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState<any>(null);

  useEffect(() => {
    const fetchDestinationDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/public/destinations/${destinationId}`);
        if (response.ok) {
          const data = await response.json();
          setDestination({
            ...data,
            heroImage: data.heroImage || data.image,
            highlights: (data.highlights || []).map((h: any) => 
              typeof h === 'string' ? { icon: "Compass", text: h } : h
            ),
            packages: (data.packages || []).map((p: any) => ({
              ...p,
              name: p.name || p.title
            })),
            stays: (data.stays || []).map((s: any) => ({
              ...s,
              info: s.info || s.description
            }))
          });
        }
      } catch (err) {
        console.error("Failed to fetch destination:", err);
      } finally {
        setLoading(false);
      }
    };

    if (destinationId) {
      fetchDestinationDetails();
    }
  }, [destinationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-warm pt-20">
        <div className="px-4">
          <Skeleton className="h-[70vh] w-full bg-primary-olive/5 rounded-[40px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 bg-primary-olive/5 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!destination) {
    return <Navigate to="/404" />;
  }

  return (
    <main className="min-h-screen bg-bg-warm">
      <Hero title={destination.name} image={destination.heroImage} />
      <Highlights highlights={destination.highlights} />
      <PackageGrid packages={destination.packages} />
      <StayGrid stays={destination.stays} />
    </main>
  );
}

import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "@/lib/data";
import { motion } from "motion/react";

interface PackageGridProps {
  packages: Package[];
}

export function PackageGrid({ packages }: PackageGridProps) {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-bg-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary-olive font-serif">
            Exclusive Packages
          </h2>
          <div className="h-1 w-24 bg-accent-clay mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg: any, index) => (
            <motion.div
              key={pkg.id || pkg._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border-primary-olive/10 overflow-hidden group rounded-[20px] shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-primary-olive/10">
                    <span className="text-accent-clay font-bold text-sm">
                      ${pkg.price?.toLocaleString()} / pp
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-text-main mb-2">{pkg.name}</h3>
                  <p className="text-text-muted text-sm line-clamp-2">{pkg.description}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button
                    onClick={() => navigate(`/trip-builder?package=${pkg.id || pkg._id}`)}
                    className="w-full bg-transparent border border-primary-olive text-primary-olive hover:bg-primary-olive hover:text-white transition-all rounded-xl font-bold text-sm"
                  >
                    Select Package
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

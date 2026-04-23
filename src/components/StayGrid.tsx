import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stay } from "@/lib/data";
import { motion } from "motion/react";

interface StayGridProps {
  stays: Stay[];
}

export function StayGrid({ stays }: StayGridProps) {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-bg-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary-olive font-serif">
            Premier Stays
          </h2>
          <div className="h-1 w-24 bg-accent-clay mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stays.map((stay: any, index) => (
            <motion.div
              key={stay.id || stay._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border-primary-olive/10 overflow-hidden group rounded-[20px] shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={stay.image}
                    alt={stay.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="inline-block px-2 py-1 bg-tag-bg text-text-muted text-[10px] font-bold uppercase rounded mb-3">
                    Premier Stay
                  </div>
                  <h3 className="text-xl font-bold text-text-main mb-1">{stay.name}</h3>
                  <p className="text-text-muted text-sm italic mb-4">{stay.info || stay.description}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button
                    onClick={() => navigate(`/trip-builder?stay=${stay.id || stay._id}`)}
                    className="w-full bg-primary-olive text-white hover:bg-primary-olive/90 transition-all rounded-xl font-bold text-sm"
                  >
                    Select Stay
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

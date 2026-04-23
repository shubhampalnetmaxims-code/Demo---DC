import * as Icons from "lucide-react";
import { motion } from "motion/react";

interface Highlight {
  icon: string;
  text: string;
}

interface HighlightsProps {
  highlights: Highlight[];
}

export function Highlights({ highlights }: HighlightsProps) {
  return (
    <section className="py-20 bg-bg-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {highlights.map((item, index) => {
            const IconComponent = (Icons as any)[item.icon] || Icons.Compass;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 bg-white p-6 rounded-2xl border border-primary-olive/5 shadow-sm"
              >
                <div className="w-12 h-12 rounded-lg bg-bg-warm flex items-center justify-center text-primary-olive">
                  <IconComponent className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-text-main">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

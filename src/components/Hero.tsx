import { motion } from "motion/react";

interface HeroProps {
  title: string;
  image: string;
}

export function Hero({ title, image }: HeroProps) {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-4">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative h-full w-full overflow-hidden rounded-[32px]"
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold text-white font-serif"
          >
            {title}
          </motion.h1>
        </div>
      </motion.div>
    </section>
  );
}

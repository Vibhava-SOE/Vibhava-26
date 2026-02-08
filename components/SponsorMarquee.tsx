"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const sponsors = [
  { name: "KSUM", logo: "/sponsors/ksum.png" },
  { name: "FabLab", logo: "/sponsors/fablab.png" },
  { name: "ASAP", logo: "/sponsors/asap-logo.png" },
  { name: "SolidWorks", logo: "/sponsors/SolidWorks-logo.png" },
  { name: "KIREAP", logo: "/sponsors/KIREAP-logo-light.jpeg" },
  { name: "Altair", logo: "/sponsors/Altair_logo.png" },
  { name: "Adhira Appa Coffee", logo: "/sponsors/AdhiraAppaCoffee-logo.png" },
];

export default function SponsorMarquee() {
  return (
    <motion.div
      className="absolute bottom-0 left-0 w-full z-20 bg-black/20 backdrop-blur-sm py-2 border-t border-white/5 overflow-hidden flex flex-col items-center gap-1"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    >
      <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase font-clash">
        Previous Event Partners
      </p>
      <div className="flex relative w-full">
        <motion.div
          className="flex whitespace-nowrap gap-12 items-center"
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30,
          }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              {sponsors.map((sponsor, index) => (
                <div
                  key={index}
                  className="relative h-6 md:h-8 2xl:h-12 w-20 md:w-28 2xl:w-40 flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
                >
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

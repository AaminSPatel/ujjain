"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUjjain } from "@/components/context/UjjainContext";

export default function AdCarousel() {
  const { ads } = useUjjain();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [ads]);

  // If no ads or closed
  if (!visible || ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={currentAd._id || currentIndex}
          className="w-full relative bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer"
          onClick={() => window.open(currentAd.link, "_blank")}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
        >
          {/* Close button */}
          <button
            className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 z-10"
            onClick={(e) => {
              e.stopPropagation(); // Prevent redirect
              setVisible(false);
            }}
          >
            <X size={18} />
          </button>

          {/* Ad Image */}
          {currentAd.image?.url && (
            <img
              src={currentAd.image.url}
              alt={currentAd.title}
              className="w-full h-32 sm:h-44 object-fit"
            />
          )}

          {/* Ad Text Overlay */}
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-3 text-white">
            <h3 className="text-sm sm:text-base font-semibold truncate">{currentAd.title}</h3>
            {currentAd.description && (
              <p className="text-xs sm:text-sm opacity-90 truncate">{currentAd.description}</p>
            )}
          </div>

          {/* Indicators */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
            {ads.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              ></div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

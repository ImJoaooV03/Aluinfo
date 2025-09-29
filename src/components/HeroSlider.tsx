import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSupabaseBanners } from "@/hooks/useSupabaseBanners";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { banners, loading } = useSupabaseBanners();
  const { t } = useTranslation('home');
  
  // Filter banners for home slider
  const sliderBanners = banners.filter(banner => {
    if (banner.position !== 'home-slider' || !banner.is_active || !banner.image_url) {
      return false;
    }
    
    const now = new Date();
    
    // Check start date - if set, current date must be after it
    if (banner.start_date) {
      const startDate = new Date(banner.start_date);
      if (now < startDate) return false;
    }
    
    // Check end date - if set, current date must be before it
    if (banner.end_date) {
      const endDate = new Date(banner.end_date);
      if (now > endDate) return false;
    }
    
    return true;
  });

  // Auto-advance slides
  useEffect(() => {
    if (sliderBanners.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderBanners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [sliderBanners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderBanners.length) % sliderBanners.length);
  };

  if (loading) {
    return (
      <section className="w-full h-[300px] md:h-[400px] lg:h-[500px] bg-muted animate-pulse">
        <div className="w-full h-full bg-gradient-to-r from-muted/50 to-muted" />
      </section>
    );
  }

  if (sliderBanners.length === 0) {
    return (
      <section className="w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-lead mb-4">
            Portal ALUINFO
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('configureSlides')}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {sliderBanners.map((banner, index) => (
          <div key={banner.id} className="min-w-full h-full relative">
            {banner.link_url ? (
              <a 
                href={banner.link_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full h-full"
              >
                <img
                  src={banner.image_url || ''}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </a>
            ) : (
              <img
                src={banner.image_url || ''}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Removido o overlay com título para não aparecer para os usuários */}
          </div>
        ))}
      </div>

      {/* Navigation arrows - only show if there are multiple slides */}
      {sliderBanners.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-white/50 shadow-lg"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-white/50 shadow-lg"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots indicator - only show if there are multiple slides */}
      {sliderBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {sliderBanners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSlider;

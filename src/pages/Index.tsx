import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import HeroSlider from "@/components/HeroSlider";
import MainContent from "@/components/MainContent";
import Sidebar from "@/components/Sidebar";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <Header />
        <Navigation />
      </div>
      
      <HeroSlider />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <MainContent />
          <Sidebar />
        </div>
      </div>
      
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;


import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import MainContent from "@/components/MainContent";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <Header />
        <Navigation />
      </div>
      
      <HeroSection />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <MainContent />
          <Sidebar />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;

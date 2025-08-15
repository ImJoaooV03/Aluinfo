
import AdBanner from "./AdBanner";

const Sidebar = () => {
  return (
    <aside className="w-80 space-y-6">
      {/* Anúncio Topo */}
      <AdBanner size="medium" position="sidebar" />
      
      {/* Anúncio Meio */}
      <AdBanner size="medium" position="sidebar" />

      {/* Anúncio Adicional */}
      <AdBanner size="medium" position="sidebar" />

      {/* Anúncio Final */}
      <AdBanner size="large" position="sidebar" />
    </aside>
  );
};

export default Sidebar;

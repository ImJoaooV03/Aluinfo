
import AdBanner from "./AdBanner";

const Sidebar = () => {
  return (
    <aside className="w-80 space-y-6">
      {/* Espaço Publicitário 1 */}
      <AdBanner size="medium" position="sidebar" spaceNumber={1} />
      
      {/* Espaço Publicitário 2 */}
      <AdBanner size="medium" position="sidebar" spaceNumber={2} />

      {/* Espaço Publicitário 3 */}
      <AdBanner size="medium" position="sidebar" spaceNumber={3} />

      {/* Espaço Publicitário 4 */}
      <AdBanner size="large" position="sidebar" spaceNumber={4} />
    </aside>
  );
};

export default Sidebar;

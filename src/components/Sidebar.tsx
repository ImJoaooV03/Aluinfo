
import AdBanner from "./AdBanner";

const Sidebar = () => {
  return (
    <aside className="w-80 space-y-6">
      {/* Banner 1 - Sidebar 1 */}
      <AdBanner size="medium" position="sidebar" spaceNumber={1} slotKey="sidebar-1" />
      
      {/* Banner 2 - Sidebar 2 */}
      <AdBanner size="medium" position="sidebar" spaceNumber={2} slotKey="sidebar-2" />

      {/* Banner 3 - Sidebar 3 */}
      <AdBanner size="medium" position="sidebar" spaceNumber={3} slotKey="sidebar-3" />

      {/* Banner 4 - Sidebar 4 */}
      <AdBanner size="large" position="sidebar" spaceNumber={4} slotKey="sidebar-4" />
    </aside>
  );
};

export default Sidebar;

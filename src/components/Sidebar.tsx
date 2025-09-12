
import AdBanner from "./AdBanner";

interface SidebarProps {
  slotKeyPrefix?: string; // ex.: "eventos" para usar eventos-sidebar-1..4
}

const Sidebar = ({ slotKeyPrefix }: SidebarProps) => {
  const key = (n: number) => (slotKeyPrefix ? `${slotKeyPrefix}-sidebar-${n}` : `sidebar-${n}`);
  return (
    <aside className="w-80 space-y-6">
      {/* Banner 1 - Sidebar 1 */}
      <AdBanner size="medium" position="sidebar" spaceNumber={1} slotKey={key(1)} />
      
      {/* Banner 2 - Sidebar 2 */}
      <AdBanner size="medium" position="sidebar" spaceNumber={2} slotKey={key(2)} />

      {/* Banner 3 - Sidebar 3 */}
      <AdBanner size="medium" position="sidebar" spaceNumber={3} slotKey={key(3)} />

      {/* Banner 4 - Sidebar 4 */}
      <AdBanner size="large" position="sidebar" spaceNumber={4} slotKey={key(4)} />
    </aside>
  );
};

export default Sidebar;

interface MenuIconProps {
  iconUrl: string;
  menuName: string;
  isActive: boolean;
}

function MenuIcon(props: MenuIconProps) {
  const { iconUrl, menuName, isActive } = props;

  return (
    <div
      className={`h-[60px] w-full rounded-full flex items-center justify-center border-2 menu-icon-container ${
        isActive ? "bg-icon-active" : "bg-default-color"
      }`}
    >
      <img src={iconUrl} alt={menuName} className="h-10 w-10" />
    </div>
  );
}

export default MenuIcon;

import MartMenu from "./mart-menu";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full">
      <MartMenu />
      {children}
    </div>
  );
}

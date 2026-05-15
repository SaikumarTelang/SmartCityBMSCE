import BottomNav from './BottomNav';

export default function CitizenShell({ children, header }) {
  return (
    <div className="citizen-shell">
      {header}
      <main className="citizen-main">{children}</main>
      <BottomNav />
    </div>
  );
}

import { NavLink } from 'react-router-dom';

const links = [
  { to: '/map', label: 'Live Map', icon: '📍' },
  { to: '/detect', label: 'AI Detector', icon: '📷' },
  { to: '/tracking', label: 'Track Nodes', icon: '✓' },
  { to: '/milestones', label: 'Milestones', icon: '🏆' },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
          <span className="nav-icon">{l.icon}</span>
          <span>{l.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

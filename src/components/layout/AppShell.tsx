import React from 'react';
import { useLocation, Link } from 'react-router-dom';

interface AppShellProps {
  children: React.ReactNode;
}

const NAV_LINKS: { label: string; to: string }[] = [
  { label: 'Charts', to: '/' },
  { label: 'Templates', to: '/templates' },
  { label: 'Reports', to: '/reports' },
  { label: 'Dashboard', to: '/dashboard' },
];

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();

  return (
    <>
      <nav
        style={{
          height: 52,
          display: 'flex',
          alignItems: 'center',
          padding: '0 28px',
          background: '#FFFFFF',
          borderBottom: '1px solid var(--cc-card-border, #E8E0D4)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          boxShadow: '0 1px 8px rgba(60, 45, 20, 0.04)',
          gap: 0,
        }}
      >
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
          }}
        >
          {/* Red bar brand mark */}
          <div
            style={{
              width: 5,
              height: 22,
              borderRadius: 1,
              background: '#E3120B',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: '#1A1714',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            ChartCraft
          </span>
        </a>
        <span
          style={{
            fontSize: 12,
            color: '#9B9488',
            fontWeight: 400,
            marginLeft: 10,
            lineHeight: 1,
            letterSpacing: '0.01em',
          }}
        >
          Publication-quality charts
        </span>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: '100%' }}>
          {NAV_LINKS.map((link) => {
            const isActive =
              link.to === '/'
                ? location.pathname === '/' || location.pathname.startsWith('/edit')
                : location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  padding: '0 14px',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#2D2A26' : '#9B9488',
                  textDecoration: 'none',
                  borderBottom: isActive ? '2px solid #E3120B' : '2px solid transparent',
                  transition: 'color 0.15s, border-color 0.15s',
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  letterSpacing: '0.01em',
                  boxSizing: 'border-box',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 1160,
          margin: '0 auto',
          padding: '28px 24px 64px',
        }}
      >
        {children}
      </main>
    </>
  );
};

export default AppShell;

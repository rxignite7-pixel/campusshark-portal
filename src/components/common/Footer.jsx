import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ marginTop: '60px', paddingTop: '28px', borderTop: '1px solid var(--border-light)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
        <Zap size={14} color="var(--primary)" />
        <span>CampusShark Global Summit & Hackathon Registration Protocol v2.6</span>
      </div>
      <div>
        © 2026 CampusShark. All rights reserved. Designed for elite hackathon and tech event team management.
      </div>
    </footer>
  );
}

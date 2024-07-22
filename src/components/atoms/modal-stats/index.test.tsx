import React from 'react';
import { render, screen } from '@testing-library/react';
import Stats from './index';

describe('Stats', () => {
  const mockStatsData = [
    { base_stat: 45, stat: { name: 'hp' } },
    { base_stat: 49, stat: { name: 'attack' } },
    { base_stat: 49, stat: { name: 'defense' } },
    { base_stat: 65, stat: { name: 'special-attack' } },
    { base_stat: 65, stat: { name: 'special-defense' } },
    { base_stat: 45, stat: { name: 'speed' } },
  ];

  beforeEach(() => {
    render(<Stats data={mockStatsData} />);
  });

  it('renders the Stats title', () => {
    expect(screen.getByText('Stats')).toBeInTheDocument();
  });

  it('renders all stat names correctly', () => {
    expect(screen.getByText('HP')).toBeInTheDocument();
    expect(screen.getByText('Attack')).toBeInTheDocument();
    expect(screen.getByText('Defense')).toBeInTheDocument();
    expect(screen.getByText('Sp. Attack')).toBeInTheDocument();
    expect(screen.getByText('Sp. Def.')).toBeInTheDocument();
    expect(screen.getByText('Speed')).toBeInTheDocument();
  });

//   it('renders all stat values correctly', () => {
//     mockStatsData.forEach(stat => {
//       expect(screen.getByText(stat.base_stat.toString())).toBeInTheDocument();
//     });
//   });

  it('applies correct CSS classes', () => {
    const container = screen.getByText('Stats').closest('div');
    expect(container).toHaveClass('p-4', 'bg-secondbg', 'rounded-lg');
  });

//   it('renders stat bars with correct widths', () => {
//     const maxStat = 110; // As defined in the component
//     mockStatsData.forEach(stat => {
//       const statBar = screen.getByText(stat.base_stat.toString()).parentElement;
//       expect(statBar).toHaveStyle(`width: ${(stat.base_stat / maxStat) * 100}%`);
//     });
//   });

  it('handles unknown stat names gracefully', () => {
    const { rerender } = render(<Stats data={[{ base_stat: 50, stat: { name: 'unknown-stat' } }]} />);
    expect(screen.getByText('unknown-stat')).toBeInTheDocument();
  });
});
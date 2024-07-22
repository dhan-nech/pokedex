import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import StatsDD from './index';

jest.mock('../../../components/atoms/stats-slider', () => {
    return {
      __esModule: true,
      default: ({ label, value, onChange }: any) => (
        <div data-testid={`stats-slider-${label}`}>
          <input
            type="range"
            min={value[0]}
            max={value[1]}
            value={value[0]}
            onChange={(e) => onChange([parseInt(e.target.value), value[1]])}
          />
          <span>{value[0]} - {value[1]}</span>
        </div>
      ),
    };
  });

describe('StatsDD', () => {
  const mockOnStatsChange = jest.fn();
  const defaultStats = {
    hp: [0, 210],
    attack: [0, 210],
    defense: [0, 210],
    speed: [0, 210],
    spAttack: [0, 210],
    spDef: [0, 210]
  };

  beforeEach(() => {
    mockOnStatsChange.mockClear();
  });

  it('renders correctly with initial stats', () => {
    render(<StatsDD initialStats={defaultStats} onStatsChange={mockOnStatsChange} />);
    expect(screen.getByTestId('stats-dropdown-button')).toHaveTextContent('Stats');
  });

  it('opens dropdown when clicked', async () => {
    render(<StatsDD initialStats={defaultStats} onStatsChange={mockOnStatsChange} />);
    fireEvent.click(screen.getByTestId('stats-dropdown-button'));
    await waitFor(() => {
      expect(screen.getByText('HP')).toBeInTheDocument();
      expect(screen.getByText('Attack')).toBeInTheDocument();
      expect(screen.getByText('Defense')).toBeInTheDocument();
      expect(screen.getByText('Speed')).toBeInTheDocument();
      expect(screen.getByText('Sp. Attack')).toBeInTheDocument();
      expect(screen.getByText('Sp. Defense')).toBeInTheDocument();
    });
  });

  it('closes dropdown when clicking outside', async () => {
    render(<StatsDD initialStats={defaultStats} onStatsChange={mockOnStatsChange} />);
    fireEvent.click(screen.getByTestId('stats-dropdown-button'));
    await waitFor(() => {
      expect(screen.getByText('HP')).toBeInTheDocument();
    });
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByText('HP')).not.toBeInTheDocument();
    });
  });

  it('updates stats when sliders change', async () => {
    render(<StatsDD initialStats={defaultStats} onStatsChange={mockOnStatsChange} />);
    fireEvent.click(screen.getByTestId('stats-dropdown-button'));
    
    const hpSlider = await screen.findByTestId('stats-slider-hp');
    fireEvent.change(hpSlider.querySelector('input'), { target: { value: 100 } });

    await waitFor(() => {
      expect(screen.getByText('100 - 210')).toBeInTheDocument();
    });
  });

  it('applies changes when Apply button is clicked', async () => {
    render(<StatsDD initialStats={defaultStats} onStatsChange={mockOnStatsChange} />);
    fireEvent.click(screen.getByTestId('stats-dropdown-button'));
    
    const hpSlider = await screen.findByTestId('stats-slider-hp');
    fireEvent.change(hpSlider.querySelector('input'), { target: { value: 100 } });

    fireEvent.click(screen.getByText('Apply'));

    expect(mockOnStatsChange).toHaveBeenCalledWith(expect.objectContaining({
      hp: [100, 210]
    }));
  });

//   it('resets stats when Reset button is clicked', async () => {
//     render(<StatsDD initialStats={defaultStats} onStatsChange={mockOnStatsChange} />);
//     fireEvent.click(screen.getByTestId('stats-dropdown-button'));
    
//     const hpSlider = await screen.findByTestId('stats-slider-hp');
//     fireEvent.change(hpSlider.querySelector('input'), { target: { value: 100 } });

//     fireEvent.click(screen.getByText('Reset'));

//     await waitFor(() => {
//       expect(screen.getByText('0 - 210')).toBeInTheDocument();
//     });
//   });

  it('disables Apply button when no changes are made', async () => {
    render(<StatsDD initialStats={defaultStats} onStatsChange={mockOnStatsChange} />);
    fireEvent.click(screen.getByTestId('stats-dropdown-button'));
    
    const applyButton = screen.getByText('Apply');
    expect(applyButton).toBeDisabled();
  });

  it('enables Apply button when changes are made', async () => {
    render(<StatsDD initialStats={defaultStats} onStatsChange={mockOnStatsChange} />);
    fireEvent.click(screen.getByTestId('stats-dropdown-button'));
    
    const hpSlider = await screen.findByTestId('stats-slider-hp');
    fireEvent.change(hpSlider.querySelector('input'), { target: { value: 100 } });

    const applyButton = screen.getByText('Apply');
    expect(applyButton).not.toBeDisabled();
  });

  it('displays "(Filtered)" when stats are not default', () => {
    const nonDefaultStats = { ...defaultStats, hp: [50, 210] };
    render(<StatsDD initialStats={nonDefaultStats} onStatsChange={mockOnStatsChange} />);
    expect(screen.getByTestId('stats-dropdown-button')).toHaveTextContent('Stats (Filtered)');
  });

  it('maintains other stats when changing one stat', async () => {
    render(<StatsDD initialStats={defaultStats} onStatsChange={mockOnStatsChange} />);
    fireEvent.click(screen.getByTestId('stats-dropdown-button'));
    
    const hpSlider = await screen.findByTestId('stats-slider-hp');
    fireEvent.change(hpSlider.querySelector('input'), { target: { value: 100 } });

    fireEvent.click(screen.getByText('Apply'));

    expect(mockOnStatsChange).toHaveBeenCalledWith(expect.objectContaining({
      hp: [100, 210],
      attack: [0, 210],
      defense: [0, 210],
      speed: [0, 210],
      spAttack: [0, 210],
      spDef: [0, 210]
    }));
  });
});
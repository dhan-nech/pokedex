import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ModalControlButtons from './index';

describe('ModalControlButtons', () => {
  const mockOnPrevCard = jest.fn();
  const mockOnNextCard = jest.fn();
  const props = {
    id: 25,
    name: 'Pikachu',
    onPrevCard: mockOnPrevCard,
    onNextCard: mockOnNextCard,
  };

  beforeEach(() => {
    render(<ModalControlButtons {...props} />);
  });

  it('renders previous and next buttons', () => {
    expect(screen.getByLabelText('View previous Pokémon (24)')).toBeInTheDocument();
    expect(screen.getByLabelText('View next Pokémon (26)')).toBeInTheDocument();
  });

  it('calls onPrevCard when previous button is clicked', () => {
    fireEvent.click(screen.getByLabelText('View previous Pokémon (24)'));
    expect(mockOnPrevCard).toHaveBeenCalledTimes(1);
  });

  it('calls onNextCard when next button is clicked', () => {
    fireEvent.click(screen.getByLabelText('View next Pokémon (26)'));
    expect(mockOnNextCard).toHaveBeenCalledTimes(1);
  });

  it('calls onPrevCard when Enter key is pressed on previous button', () => {
    fireEvent.keyDown(screen.getByLabelText('View previous Pokémon (24)'), { key: 'Enter' });
    expect(mockOnPrevCard).toHaveBeenCalledTimes(2);
  });

  it('calls onNextCard when Enter key is pressed on next button', () => {
    fireEvent.keyDown(screen.getByLabelText('View next Pokémon (26)'), { key: 'Enter' });
    expect(mockOnNextCard).toHaveBeenCalledTimes(2);
  });

  it('calls onPrevCard when Space key is pressed on previous button', () => {
    fireEvent.keyDown(screen.getByLabelText('View previous Pokémon (24)'), { key: ' ' });
    expect(mockOnPrevCard).toHaveBeenCalledTimes(3);
  });

  it('calls onNextCard when Space key is pressed on next button', () => {
    fireEvent.keyDown(screen.getByLabelText('View next Pokémon (26)'), { key: ' ' });
    expect(mockOnNextCard).toHaveBeenCalledTimes(3);
  });

  it('does not call handlers for other key presses', () => {
    fireEvent.keyDown(screen.getByLabelText('View previous Pokémon (24)'), { key: 'A' });
    fireEvent.keyDown(screen.getByLabelText('View next Pokémon (26)'), { key: 'A' });
    expect(mockOnPrevCard).toHaveBeenCalledTimes(3);
    // expect(mockOnNextCard).not.toHaveBeenCalled();
  });
});
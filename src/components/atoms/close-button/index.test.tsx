import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CloseButton from './index';

describe('CloseButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    render(<CloseButton onClick={mockOnClick} />);
  });

  it('renders the close button', () => {
    expect(screen.getByLabelText('Close Pokemon details')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    fireEvent.click(screen.getByLabelText('Close Pokemon details'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Enter key is pressed', () => {
    const button = screen.getByLabelText('Close Pokemon details');
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(mockOnClick).toHaveBeenCalledTimes(2);
  });

  it('calls onClick when Space key is pressed', () => {
    const button = screen.getByLabelText('Close Pokemon details');
    fireEvent.keyDown(button, { key: ' ' });
    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });

  it('does not call onClick for other key presses', () => {
    const button = screen.getByLabelText('Close Pokemon details');
    fireEvent.keyDown(button, { key: 'A' });
    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });

  it('has correct accessibility attributes', () => {
    const button = screen.getByLabelText('Close Pokemon details');
    expect(button).toHaveAttribute('aria-label', 'Close Pokemon details');
  });



  it('prevents default behavior for Enter and Space key presses', () => {
    const button = screen.getByLabelText('Close Pokemon details');
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    
    Object.defineProperty(enterEvent, 'preventDefault', { value: jest.fn() });
    Object.defineProperty(spaceEvent, 'preventDefault', { value: jest.fn() });

    fireEvent(button, enterEvent);
    expect(enterEvent.preventDefault).not.toHaveBeenCalled();

    fireEvent(button, spaceEvent);
    expect(spaceEvent.preventDefault).not.toHaveBeenCalled();
  });
});
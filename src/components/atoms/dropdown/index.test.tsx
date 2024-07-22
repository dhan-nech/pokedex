import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import Dropdown from './index';

describe('Dropdown', () => {
  const mockOnChange = jest.fn();
  const props = {
    label: 'Test Dropdown',
    options: ['Option 1', 'Option 2', 'Option 3'],
    selectedOptions: ['Option 1'],
    onChange: mockOnChange,
  };

  beforeEach(() => {
    render(<Dropdown {...props} />);
  });

  it('renders the dropdown with correct label', () => {
    expect(screen.getByText('Test Dropdown')).toBeInTheDocument();
  });

  it('displays the correct number of options when opened', () => {
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('calls onChange when an option is selected', () => {
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Option 2'));
    expect(mockOnChange).toHaveBeenCalledWith(['Option 1', 'Option 2']);
  });

  it('closes dropdown when clicking outside', () => {
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.click(document.body);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  // it('toggles option selection when clicked', () => {
  //   fireEvent.click(screen.getByRole('button'));
  //   fireEvent.click(screen.getByText('Option 1'));
  //   expect(mockOnChange).toHaveBeenCalledWith([]);
  // });

  it('handles keyboard events for opening and closing dropdown', () => {
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(button, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('handles keyboard events for selecting options', () => {
    fireEvent.click(screen.getByRole('button'));
    const option = screen.getByText('Option 2');
    fireEvent.keyDown(option, { key: 'Enter' });
    expect(mockOnChange).toHaveBeenCalledWith(['Option 1', 'Option 2']);
  });

  it('displays correct text when multiple options are selected', () => {
    render(<Dropdown {...props} selectedOptions={['Option 1', 'Option 2']} />);
    expect(screen.getByText('Option 1 + 1 more')).toBeInTheDocument();
  });

  // it('displays label when no options are selected', () => {
  //   render(<Dropdown {...props} selectedOptions={[]} />);
  //   expect(screen.getByText('Test Dropdown')).toBeInTheDocument();
  // });

  // it('handles empty options array', () => {
  //   render(<Dropdown {...props} options={[]} />);
  //   fireEvent.click(screen.getByRole('button'));
  //   expect(screen.queryByRole('option')).not.toBeInTheDocument();
  // });

  it('updates display when props change', () => {
    const { rerender } = render(<Dropdown {...props} />);
    rerender(<Dropdown {...props} selectedOptions={['Option 2', 'Option 3']} />);
    expect(screen.getByText('Option 2 + 1 more')).toBeInTheDocument();
  });

  // it('maintains focus on the button after closing dropdown', () => {
  //   const button = screen.getByRole('button');
  //   fireEvent.click(button);
  //   fireEvent.click(document.body);
  //   expect(document.activeElement).toBe(button);
  // });
});
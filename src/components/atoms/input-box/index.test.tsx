import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import GeneralInputBox from './index';

describe('GeneralInputBox', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    label: 'Test Input',
    placeholder: 'Enter text',
    value: '',
    onChange: mockOnChange,
  };

  const renderComponent = (props = {}) => {
    return render(<GeneralInputBox {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders the input with correct label and placeholder', () => {
    renderComponent();
    expect(screen.getByText('Test Input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Enter text');
    fireEvent.change(input, { target: { value: 'New Value' } });
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('renders with default label when not provided', () => {
    renderComponent({ label: undefined });
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('renders with default placeholder when not provided', () => {
    renderComponent({ placeholder: undefined });
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with initial value when provided', () => {
    const initialValue = 'Initial Value';
    renderComponent({ value: initialValue });
    expect(screen.getByDisplayValue(initialValue)).toBeInTheDocument();
  });

  it('updates value when props change', () => {
    const { rerender } = renderComponent();
    rerender(<GeneralInputBox {...defaultProps} value="Updated Value" />);
    expect(screen.getByDisplayValue('Updated Value')).toBeInTheDocument();
  });

  it('handles empty string value correctly', () => {
    renderComponent({ value: '' });
    expect(screen.getByPlaceholderText('Enter text')).toHaveValue('');
  });
});
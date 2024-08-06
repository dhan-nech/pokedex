import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MobileDropdown from './index';

describe('MobileDropdown', () => {
  const mockProps = {
    label: 'Test Dropdown',
    options: ['Option 1', 'Option 2', 'Option 3'],
    selectedOptions: ['Option 1'],
    onChange: jest.fn(),
    isOpen: false,
    onToggle: jest.fn(),
  };

//   it('renders closed dropdown correctly', () => {
//     render(<MobileDropdown {...mockProps} />);
//     expect(screen.getByText('Test Dropdown')).toBeInTheDocument();
//     expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
//   });

//   it('renders open dropdown correctly', () => {
//     render(<MobileDropdown {...mockProps} isOpen={true} />);
//     expect(screen.getByText('Option 1')).toBeInTheDocument();
//     expect(screen.getByText('Option 2')).toBeInTheDocument();
//     expect(screen.getByText('Option 3')).toBeInTheDocument();
//   });

//   it('calls onToggle when dropdown is clicked', () => {
//     render(<MobileDropdown {...mockProps} />);
//     fireEvent.click(screen.getByText('Test Dropdown'));
//     expect(mockProps.onToggle).toHaveBeenCalled();
//   });

  it('calls onChange when an option is selected', () => {
    render(<MobileDropdown {...mockProps} isOpen={true} />);
    fireEvent.click(screen.getByLabelText('Option 2'));
    expect(mockProps.onChange).toHaveBeenCalledWith(['Option 1', 'Option 2']);
  });

  it('calls onChange when a selected option is deselected', () => {
    render(<MobileDropdown {...mockProps} isOpen={true} />);
    fireEvent.click(screen.getByLabelText('Option 1'));
    expect(mockProps.onChange).toHaveBeenCalledWith([]);
  });

  it('displays correct text when no options are selected', () => {
    render(<MobileDropdown {...mockProps} selectedOptions={[]} />);
    expect(screen.getByText('Test Dropdown')).toBeInTheDocument();
  });

  it('displays correct text when one option is selected', () => {
    render(<MobileDropdown {...mockProps} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('displays correct text when multiple options are selected', () => {
    render(<MobileDropdown {...mockProps} selectedOptions={['Option 1', 'Option 2']} />);
    expect(screen.getByText('Option 1 + 1 More')).toBeInTheDocument();
  });

//   it('renders children when provided instead of options', () => {
//     render(
//       <MobileDropdown {...mockProps} isOpen={true}>
//         <div>Custom Content</div>
//       </MobileDropdown>
//     );
//     expect(screen.getByText('Custom Content')).toBeInTheDocument();
//     expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
//   });

//   it('sets correct ARIA attributes', () => {
//     render(<MobileDropdown {...mockProps} />);
//     const button = screen.getByRole('button');
//     expect(button).toHaveAttribute('aria-expanded', 'false');
//     expect(button).toHaveAttribute('aria-controls', 'test-dropdown-options');
//   });

  it('updates ARIA attributes when opened', () => {
    render(<MobileDropdown {...mockProps} isOpen={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });
});
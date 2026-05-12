import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DifficultySelector from '../components/DifficultySelector';

describe('DifficultySelector Component', () => {
  test('renders all three difficulty buttons with correct labels', () => {
    render(<DifficultySelector onSelect={() => {}} />);
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  test('clicking Easy calls onSelect with "easy"', () => {
    const onSelect = jest.fn();
    render(<DifficultySelector onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Easy'));
    expect(onSelect).toHaveBeenCalledWith('easy');
  });

  test('clicking Medium calls onSelect with "medium"', () => {
    const onSelect = jest.fn();
    render(<DifficultySelector onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Medium'));
    expect(onSelect).toHaveBeenCalledWith('medium');
  });

  test('clicking Hard calls onSelect with "hard"', () => {
    const onSelect = jest.fn();
    render(<DifficultySelector onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Hard'));
    expect(onSelect).toHaveBeenCalledWith('hard');
  });

  test('selected="medium" gives only the Medium button the active class', () => {
    render(<DifficultySelector onSelect={() => {}} selected="medium" />);
    expect(screen.getByText('Medium')).toHaveClass('active');
    expect(screen.getByText('Easy')).not.toHaveClass('active');
    expect(screen.getByText('Hard')).not.toHaveClass('active');
  });

  test('renders without errors when no selected prop is provided', () => {
    render(<DifficultySelector onSelect={() => {}} />);
    expect(screen.getByText('Easy')).not.toHaveClass('active');
    expect(screen.getByText('Medium')).not.toHaveClass('active');
    expect(screen.getByText('Hard')).not.toHaveClass('active');
  });
});

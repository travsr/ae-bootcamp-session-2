import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterSortBar from '../components/filter-sort-bar';

describe('FilterSortBar', () => {
  test('renders all filter and sort controls', () => {
    render(
      <FilterSortBar filters={{}} sortBy="created_at" onFilterChange={jest.fn()} onSortChange={jest.fn()} />,
    );
    expect(screen.getByRole('combobox', { name: /^category$/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /^priority$/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /^status$/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /^sort by$/i })).toBeInTheDocument();
  });

  test('calls onFilterChange when category is selected', () => {
    const onFilterChange = jest.fn();
    render(
      <FilterSortBar filters={{}} sortBy="created_at" onFilterChange={onFilterChange} onSortChange={jest.fn()} />,
    );
    fireEvent.mouseDown(screen.getByRole('combobox', { name: /^category$/i }));
    fireEvent.click(within(screen.getByRole('listbox')).getByText('Work'));
    expect(onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ category: 'Work' }));
  });

  test('calls onFilterChange when priority is selected', () => {
    const onFilterChange = jest.fn();
    render(
      <FilterSortBar filters={{}} sortBy="created_at" onFilterChange={onFilterChange} onSortChange={jest.fn()} />,
    );
    fireEvent.mouseDown(screen.getByRole('combobox', { name: /^priority$/i }));
    fireEvent.click(within(screen.getByRole('listbox')).getByText('High'));
    expect(onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ priority: 'high' }));
  });

  test('calls onFilterChange with completed=false when Incomplete is selected', () => {
    const onFilterChange = jest.fn();
    render(
      <FilterSortBar filters={{}} sortBy="created_at" onFilterChange={onFilterChange} onSortChange={jest.fn()} />,
    );
    fireEvent.mouseDown(screen.getByRole('combobox', { name: /^status$/i }));
    fireEvent.click(within(screen.getByRole('listbox')).getByText('Incomplete'));
    expect(onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ completed: false }));
  });

  test('calls onFilterChange with completed=true when Completed is selected', () => {
    const onFilterChange = jest.fn();
    render(
      <FilterSortBar filters={{}} sortBy="created_at" onFilterChange={onFilterChange} onSortChange={jest.fn()} />,
    );
    fireEvent.mouseDown(screen.getByRole('combobox', { name: /^status$/i }));
    fireEvent.click(within(screen.getByRole('listbox')).getByText('Completed'));
    expect(onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ completed: true }));
  });

  test('calls onSortChange when a sort option is selected', () => {
    const onSortChange = jest.fn();
    render(
      <FilterSortBar filters={{}} sortBy="created_at" onFilterChange={jest.fn()} onSortChange={onSortChange} />,
    );
    fireEvent.mouseDown(screen.getByRole('combobox', { name: /^sort by$/i }));
    fireEvent.click(within(screen.getByRole('listbox')).getByText('Due Date'));
    expect(onSortChange).toHaveBeenCalledWith('due_date');
  });

  test('shows active filter chips when filters are set', () => {
    render(
      <FilterSortBar
        filters={{ category: 'Work', priority: 'high', completed: false }}
        sortBy="created_at"
        onFilterChange={jest.fn()}
        onSortChange={jest.fn()}
      />,
    );
    expect(screen.getByText('Category: Work')).toBeInTheDocument();
    expect(screen.getByText('Priority: High')).toBeInTheDocument();
    expect(screen.getByText('Status: Incomplete')).toBeInTheDocument();
  });

  test('shows Status: Completed chip when completed=true', () => {
    render(
      <FilterSortBar
        filters={{ completed: true }}
        sortBy="created_at"
        onFilterChange={jest.fn()}
        onSortChange={jest.fn()}
      />,
    );
    expect(screen.getByText('Status: Completed')).toBeInTheDocument();
  });

  test('removes category chip when its delete icon is clicked', async () => {
    const onFilterChange = jest.fn();
    render(
      <FilterSortBar
        filters={{ category: 'Work' }}
        sortBy="created_at"
        onFilterChange={onFilterChange}
        onSortChange={jest.fn()}
      />,
    );
    const deleteIcon = screen.getByTestId('CancelIcon');
    await userEvent.click(deleteIcon);
    expect(onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ category: '' }));
  });

  test('removes priority chip when its delete icon is clicked', async () => {
    const onFilterChange = jest.fn();
    render(
      <FilterSortBar
        filters={{ priority: 'high' }}
        sortBy="created_at"
        onFilterChange={onFilterChange}
        onSortChange={jest.fn()}
      />,
    );
    const deleteIcon = screen.getByTestId('CancelIcon');
    await userEvent.click(deleteIcon);
    expect(onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ priority: '' }));
  });

  test('removes status chip when its delete icon is clicked', async () => {
    const onFilterChange = jest.fn();
    render(
      <FilterSortBar
        filters={{ completed: false }}
        sortBy="created_at"
        onFilterChange={onFilterChange}
        onSortChange={jest.fn()}
      />,
    );
    const deleteIcon = screen.getByTestId('CancelIcon');
    await userEvent.click(deleteIcon);
    const callArg = onFilterChange.mock.calls[0][0];
    expect(callArg).not.toHaveProperty('completed');
  });
});

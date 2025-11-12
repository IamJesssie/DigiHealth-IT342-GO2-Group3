import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import apiClient from '../api/client';

// Mock apiClient
jest.mock('../api/client', () => ({
  default: {
    get: jest.fn(),
  },
}));

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard with stats and appointments', async () => {
    // Mock API responses
    apiClient.get
      .mockResolvedValueOnce({
        data: { totalPatients: 3, todayConfirmed: 1, todayPending: 1, todayCompleted: 1 }
      })
      .mockResolvedValueOnce({
        data: [{ id: 1, time: '10:00 AM', patientName: 'John Doe', type: 'Checkup', status: 'confirmed' }]
      });

    render(<Dashboard />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument(); // totalPatients
    });

    // Check stats
    expect(screen.getByText('1')).toBeInTheDocument(); // todayConfirmed
    expect(screen.getByText('1')).toBeInTheDocument(); // todayPending
    expect(screen.getByText('1')).toBeInTheDocument(); // todayCompleted

    // Check appointment row
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Checkup')).toBeInTheDocument();
    expect(screen.getByText('confirmed')).toBeInTheDocument();
  });
});
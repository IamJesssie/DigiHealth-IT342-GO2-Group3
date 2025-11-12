import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Appointments from './Appointments';
import apiClient from '../api/client';

// Mock apiClient
jest.mock('../api/client', () => ({
  default: {
    get: jest.fn(),
  },
}));

describe('Appointments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders appointments table with appointment data', async () => {
    // Mock API response
    apiClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          patientName: 'Jane Smith',
          type: 'Consultation',
          doctorName: 'Dr. Sarah Smith',
          status: 'confirmed',
          startDateTime: '2023-10-20T10:00:00'
        }
      ]
    });

    render(<Appointments />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    // Check appointment data
    expect(screen.getByText('Consultation')).toBeInTheDocument();
    expect(screen.getByText('Dr. Sarah Smith')).toBeInTheDocument();
    expect(screen.getByText('confirmed')).toBeInTheDocument();
  });
});
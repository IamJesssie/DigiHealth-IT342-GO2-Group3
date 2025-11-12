import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfileSettings from './ProfileSettings';
import apiClient from '../api/client';

// Mock apiClient
jest.mock('../api/client', () => ({
  default: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

describe('ProfileSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders profile form with prefilled data and handles update', async () => {
    // Mock GET response
    apiClient.get.mockResolvedValueOnce({
      data: {
        fullName: 'Dr. Sarah Smith',
        email: 'sarah@example.com',
        phone: '+1234567890',
        role: 'Doctor',
        department: 'Internal Medicine',
        specialization: 'General Practitioner',
        medicalLicenseNumber: 'LIC12345',
        yearsOfExperience: '10',
        professionalBio: 'Experienced doctor'
      }
    });

    // Mock PUT response
    apiClient.put.mockResolvedValueOnce({
      data: {
        fullName: 'Dr. Sarah Smith Updated',
        email: 'sarah@example.com',
        phone: '+1234567890',
        role: 'Doctor',
        department: 'Internal Medicine',
        specialization: 'General Practitioner',
        medicalLicenseNumber: 'LIC12345',
        yearsOfExperience: '10',
        professionalBio: 'Experienced doctor'
      }
    });

    render(
      <MemoryRouter initialEntries={['/profile-settings']}>
        <ProfileSettings />
      </MemoryRouter>
    );

    // Wait for data to load and check prefilled inputs
    await waitFor(() => {
      expect(screen.getByDisplayValue('Dr. Sarah Smith')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('sarah@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument();

    // Find and click the submit button
    const submitButton = screen.getByText('Save Changes');
    fireEvent.click(submitButton);

    // Wait for PUT to be called and success message
    await waitFor(() => {
      expect(apiClient.put).toHaveBeenCalledWith('/api/users/me', expect.any(Object));
    });

    expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
  });
});
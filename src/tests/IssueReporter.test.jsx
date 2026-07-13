import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IssueReporter from '../components/IssueReporter.jsx';

const mockUseApp = vi.fn();
vi.mock('../context/AppContext.jsx', () => ({
  useApp: () => mockUseApp()
}));

describe('IssueReporter Component', () => {
  const baseContext = {
    complaints: [
      {
        id: '1',
        title: 'Gate 3 Congestion',
        category: 'Crowd Congestion',
        description: 'Heavy crowds building up outside the entry point.',
        severity: 'Medium',
        location: 'Gate 3',
        status: 'Submitted',
        timeline: []
      }
    ],
    addComplaint: vi.fn(),
    updateComplaintStatus: vi.fn(),
    userProfile: { role: 'Fan' },
    t: (key) => key
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApp.mockReturnValue(baseContext);
  });

  it('renders complaints list and shows modal when clicking new complaint button', () => {
    render(<IssueReporter />);

    expect(screen.getAllByText(/Gate 3 Congestion/i)[0]).toBeInTheDocument();

    // Click "New Complaint" button
    const openModalBtn = screen.getByRole('button', { name: /newComplaintBtn/i });
    fireEvent.click(openModalBtn);

    // Modal should be open
    expect(screen.getByText(/Brief Summary Title/i)).toBeInTheDocument();
  });

  it('rejects submissions with script injections or empty values', async () => {
    render(<IssueReporter />);

    // Open modal
    fireEvent.click(screen.getByRole('button', { name: /newComplaintBtn/i }));

    const titleInput = screen.getByPlaceholderText(/Bottleneck outside Gate 3/i);
    const descInput = screen.getByPlaceholderText(/Describe the stadium incident/i);
    const locInput = screen.getByPlaceholderText(/e.g. Section 104 Row 12/i);
    const submitBtn = screen.getByRole('button', { name: /submitBtn/i });

    // Test empty validation
    fireEvent.change(titleInput, { target: { value: '   ' } });
    fireEvent.change(descInput, { target: { value: 'Valid Description' } });
    fireEvent.change(locInput, { target: { value: 'Valid Location' } });
    fireEvent.click(submitBtn);

    // Displays empty error
    expect(screen.getByText(/Please fill out all required fields/i)).toBeInTheDocument();

    // Test script injection validation
    fireEvent.change(titleInput, { target: { value: 'Dangerous Title' } });
    fireEvent.change(descInput, { target: { value: '<script>alert(1)</script>' } });
    fireEvent.click(submitBtn);

    // Displays invalid characters error
    expect(screen.getByText(/Description: Invalid characters detected/i)).toBeInTheDocument();
  });

  it('submits successfully when form is valid', async () => {
    const addComplaintMock = vi.fn();
    mockUseApp.mockReturnValue({
      ...baseContext,
      addComplaint: addComplaintMock
    });

    render(<IssueReporter />);

    // Open modal
    fireEvent.click(screen.getByRole('button', { name: /newComplaintBtn/i }));

    const titleInput = screen.getByPlaceholderText(/Bottleneck outside Gate 3/i);
    const descInput = screen.getByPlaceholderText(/Describe the stadium incident/i);
    const locInput = screen.getByPlaceholderText(/e.g. Section 104 Row 12/i);
    const submitBtn = screen.getByRole('button', { name: /submitBtn/i });

    fireEvent.change(titleInput, { target: { value: 'Spilled Soda' } });
    fireEvent.change(descInput, { target: { value: 'There is a huge puddle near Section 104.' } });
    fireEvent.change(locInput, { target: { value: 'Section 104 Row 12' } });

    fireEvent.click(submitBtn);

    expect(addComplaintMock).toHaveBeenCalledWith({
      title: 'Spilled Soda',
      category: 'Crowd Congestion',
      description: 'There is a huge puddle near Section 104.',
      severity: 'Medium',
      location: 'Section 104 Row 12',
      image: 'svg'
    });
  });

  it('rejects oversized files and invalid MIME types during upload', async () => {
    render(<IssueReporter />);

    // Open modal
    fireEvent.click(screen.getByRole('button', { name: /newComplaintBtn/i }));

    const fileInput = screen.getByLabelText(/Upload Real/i);

    // 1. Test oversized file (3MB)
    const oversizedFile = new File(['a'.repeat(3 * 1024 * 1024)], 'large_image.png', {
      type: 'image/png'
    });
    fireEvent.change(fileInput, { target: { files: [oversizedFile] } });
    expect(screen.getByText(/File exceeds 2MB size limit/i)).toBeInTheDocument();

    // 2. Test invalid MIME type (text/plain)
    const textFile = new File(['text content'], 'info.txt', {
      type: 'text/plain'
    });
    fireEvent.change(fileInput, { target: { files: [textFile] } });
    expect(screen.getByText(/Only image files are allowed/i)).toBeInTheDocument();
  });
});

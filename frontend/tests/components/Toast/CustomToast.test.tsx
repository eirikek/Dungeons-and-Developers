import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider } from '../../../src/components/Toast/CustomToast';
import { ToastProps } from '../../../src/context/ToastContext';
import { useToast } from '../../../src/hooks/useToast';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn((message) => {
      const div = document.createElement('div');
      div.textContent = message;
      div.setAttribute('data-testid', 'toast-message');
      document.body.appendChild(div);
      return 'mock-toast-id'; // Return a mock ID if needed
    }),
    error: vi.fn((message) => {
      const div = document.createElement('div');
      div.textContent = message;
      div.setAttribute('data-testid', 'toast-message');
      document.body.appendChild(div);
      return 'mock-toast-id'; // Return a mock ID if needed
    }),
    info: vi.fn(),
    warning: vi.fn(),
    dismiss: vi.fn(),
    isActive: vi.fn(() => false),
  },
  ToastContainer: () => <div data-testid="ToastContainer"></div>,
  Zoom: vi.fn(),
}));

vi.mock('@mui/icons-material', () => ({
  CheckCircle: () => <span data-testid="CheckCircleIcon" />,
}));
vi.mock('react-icons/fa', () => ({
  FaUndoAlt: () => <span data-testid="FaUndoAltIcon" />,
}));
vi.mock('react-icons/io', () => ({
  IoIosInformationCircleOutline: () => <span data-testid="IoInformationCircleIcon" />,
}));
vi.mock('react-icons/io5', () => ({
  IoAlertCircleOutline: () => <span data-testid="IoAlertCircleOutlineIcon" />,
  IoCloseCircleOutline: () => <span data-testid="IoCloseCircleOutlineIcon" />,
}));

describe('CustomToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  const TestToast = ({ message, type, undoAction, closeToast }: ToastProps) => {
    const { showToast } = useToast()!;
    return <button onClick={() => showToast({ message, type, undoAction, closeToast })}>Show Toast</button>;
  };
  it('displays the correct icon and message for success type', async () => {
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime.bind(vi),
    });
    render(
      <ToastProvider>
        <TestToast message="Success message" type="success" />
      </ToastProvider>
    );
    await user.click(screen.getByRole('button', { name: 'Show Toast' }));

    await waitFor(() => {
      expect(screen.getByTestId('toast-message')).toBeInTheDocument();
    });

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument();
  });

  it('displays the correct icon and message for error type', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestToast message="Error message" type="error" />
      </ToastProvider>
    );
    await user.click(screen.getByText('Show Toast'));

    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByTestId('IoCloseCircleOutlineIcon')).toBeInTheDocument();
  });

  it('displays the undo button when undoAction is provided', async () => {
    const undoAction = jest.fn();
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <TestToast message="Undo message" type="info" undoAction={undoAction} />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show toast'));

    expect(screen.getByText('Undo')).toBeInTheDocument();
  });

  it('calls undoAction and closeToast when undo button is clicked', async () => {
    const undoAction = vi.fn();
    const closeToast = vi.fn();
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <TestToast message="Undo message" type="info" undoAction={undoAction} closeToast={closeToast} />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Toast'));
    await user.click(screen.getByText('Undo'));

    expect(undoAction).toHaveBeenCalled();
    expect(closeToast).toHaveBeenCalled();
  });

  it('does not display the undo button when undoAction is not provided', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestToast message="No undo message" type="info" />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Toast'));
    expect(screen.queryByText('Undo')).not.toBeInTheDocument();
  });

  it('dismisses the previous toast if a new one is shown', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ToastProvider>
        <TestToast message="First message" type="info" />
      </ToastProvider>
    );
    await user.click(screen.getByText('Show Toast'));

    rerender(
      <ToastProvider>
        <TestToast message="First message" type="info" />
      </ToastProvider>
    );

    await user.click(screen.getByText('Show Toast'));

    expect(screen.queryByText('First message')).not.toBeInTheDocument();
    expect(screen.getByText('Second message')).toBeInTheDocument();
  });
});

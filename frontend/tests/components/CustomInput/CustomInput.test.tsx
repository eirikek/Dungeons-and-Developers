import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomInput from '../../../src/components/CustomInput/CustomInput.tsx';

describe('CustomInput Component', () => {
  const placeholder = 'Enter your dungeon name';
  const inputName = 'Dungeon';
  const initialValue = 'My dungeon';
  const onSaveMock = vi.fn();

  it('renders correctly in view mode', () => {
    render(<CustomInput placeholder={placeholder} inputName={inputName} value={initialValue} onSave={onSaveMock} />);
    expect(screen.getByTestId('dungeon name')).toHaveTextContent(initialValue);
    expect(screen.getByRole('button', { name: `Edit ${inputName}` })).toBeInTheDocument();
  });

  it('renders correctly in edit mode', async () => {
    const user = userEvent.setup();
    render(<CustomInput placeholder={placeholder} inputName={inputName} value={initialValue} onSave={onSaveMock} />);

    const editButton = screen.getByRole('button', { name: `Edit ${inputName}` });
    await user.click(editButton);

    const input = screen.getByRole('textbox', { name: 'Edit name' });
    expect(input).toBeInTheDocument();
    const saveButton = screen.getByRole('button', { name: `Save ${inputName}` });
    expect(saveButton).toBeInTheDocument();
  });

  it('updates input value on change', async () => {
    const user = userEvent.setup();
    render(<CustomInput placeholder={placeholder} inputName={inputName} value={initialValue} onSave={onSaveMock} />);

    await user.click(screen.getByRole('button', { name: `Edit ${inputName}` }));
    const inputElement = screen.getByRole('textbox', { name: 'Edit name' });
    await user.type(inputElement, 'Test');
    expect(inputElement).toHaveValue(`${initialValue}Test`);
  });

  it('limits input value to 20 characters', async () => {
    const user = userEvent.setup();
    render(<CustomInput placeholder={placeholder} inputName={inputName} value={initialValue} onSave={onSaveMock} />);

    await user.click(screen.getByRole('button', { name: `Edit ${inputName}` }));
    const inputElement = screen.getByRole('textbox', { name: 'Edit name' });

    const longValue = 'ThisIsAVeryLongInputValueThatShouldDefinitelyBeTruncated';
    const expectedTrimmedValue = longValue.substring(0, 20);

    await user.clear(inputElement);

    await user.type(inputElement, longValue);

    const actualValue = (inputElement as HTMLInputElement).value;
    expect(actualValue).toHaveLength(20);

    expect(inputElement).toHaveValue(expectedTrimmedValue);
  });

  it('calls onSave with the correct value when saved', async () => {
    const user = userEvent.setup();
    render(<CustomInput placeholder={placeholder} inputName={inputName} value={initialValue} onSave={onSaveMock} />);

    await user.click(screen.getByRole('button', { name: `Edit ${inputName}` }));
    const inputElement = screen.getByRole('textbox', { name: 'Edit name' });
    await user.clear(inputElement);
    await user.type(inputElement, 'New Name');
    await user.click(screen.getByRole('button', { name: `Save ${inputName}` }));
    expect(onSaveMock).toHaveBeenCalledWith('New Name');
  });

  it('shows an alert when trying to save an empty value', async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<CustomInput placeholder={placeholder} inputName={inputName} value={initialValue} onSave={onSaveMock} />);
    await user.click(screen.getByRole('button', { name: `Edit ${inputName}` }));
    const inputElement = screen.getByRole('textbox', { name: 'Edit name' });
    await user.clear(inputElement);
    await user.click(screen.getByRole('button', { name: `Save ${inputName}` }));
    expect(alertMock).toHaveBeenCalledWith(`${inputName} cannot be empty!`);
    alertMock.mockRestore();
  });

  it('saves on blur', async () => {
    const user = userEvent.setup();
    render(<CustomInput placeholder={placeholder} inputName={inputName} value={initialValue} onSave={onSaveMock} />);

    await user.click(screen.getByRole('button', { name: `Edit ${inputName}` }));
    const inputElement = screen.getByRole('textbox', { name: 'Edit name' });
    await user.clear(inputElement);
    await user.type(inputElement, 'Another Name');
    fireEvent.blur(inputElement);
    expect(onSaveMock).toHaveBeenCalledWith('Another Name');
  });

  it('matches snapshot', () => {
    const { container } = render(
      <CustomInput placeholder={placeholder} inputName={inputName} value={initialValue} onSave={onSaveMock} />
    );
    expect(container).toMatchSnapshot();
  });
});

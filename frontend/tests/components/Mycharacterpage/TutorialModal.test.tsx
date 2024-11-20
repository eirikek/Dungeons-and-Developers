import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TutorialModal from '../../../src/components/MyCharacter/TutorialModal.tsx';
import { BrowserRouter } from 'react-router-dom';

describe('TutorialModal Component', () => {
  it('renders the help icon', () => {
    render(
      <BrowserRouter>
        <TutorialModal />
      </BrowserRouter>
    );
    const helpIcon = screen.getByRole('button', { name: 'Help' });
    expect(helpIcon).toBeInTheDocument();
  });

  it('opens modal when help icon is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <TutorialModal />
      </BrowserRouter>
    );

    const helpIcon = screen.getByRole('button', { name: 'Help' });
    await user.click(helpIcon);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: 'Close' });
    expect(closeButton).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <TutorialModal />
      </BrowserRouter>
    );

    const helpIcon = screen.getByRole('button', { name: 'Help' });
    await user.click(helpIcon);

    const closeButton = screen.getByRole('button', { name: 'Close' });
    await user.click(closeButton);

    const dialog = screen.queryByRole('dialog');
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
  });

  it('renders all sections inside the modal', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <TutorialModal />
      </BrowserRouter>
    );

    const helpIcon = screen.getByRole('button', { name: 'Help' });
    await user.click(helpIcon);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const sections = ['Race', 'Class', 'Ability scores', 'Equipments'];

    for (const section of sections) {
      const heading = await screen.findByRole('heading', { name: section });
      expect(heading).toBeInTheDocument();
    }
  });

  it('renders images and links correctly', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <TutorialModal />
      </BrowserRouter>
    );

    const helpIcon = screen.getByRole('button', { name: 'Help' });
    await user.click(helpIcon);

    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);

    for (const link of links) {
      expect(link).toHaveAttribute('href');
    }
  });

  it('matches snapshot', () => {
    const { container } = render(
      <BrowserRouter>
        <TutorialModal />
      </BrowserRouter>
    );
    expect(container).toMatchSnapshot();
  });
});

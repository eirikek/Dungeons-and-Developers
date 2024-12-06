import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import TutorialModal from '../../../src/components/TutorialModal/TutorialModal';

describe('TutorialModal Component', () => {
  it('renders the help icon', () => {
    render(
      <BrowserRouter>
        <TutorialModal />
      </BrowserRouter>
    );
    const helpIcon = screen.getByRole('button', { name: 'Help' });
    expect(helpIcon).toBeTruthy();
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
    expect(dialog).toBeTruthy();

    const closeButton = screen.getByRole('button', { name: 'Close' });
    expect(closeButton).toBeTruthy();
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
      expect(screen.getByRole('dialog')).toBeTruthy();
    });

    const sections = ['Race', 'Class', 'Ability scores', 'Equipments'];

    for (const section of sections) {
      const heading = await screen.findByRole('heading', { name: section });
      expect(heading).toBeTruthy();
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
      expect(link.outerHTML).toContain('href');
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

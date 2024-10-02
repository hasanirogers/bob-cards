import { css } from 'lit';

export default css`
  :host {
    display: block;
    border: var(--app-border);
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.25);
  }

  img {
    width: 100%;
  }

  p,
  h3 {
    margin: 0;
    padding: 0;
  }

  section {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
`;

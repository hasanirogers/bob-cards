import { css } from 'lit';

export default css`
  :host {
    display: block;
    margin: 1rem 1rem;
    padding: 1rem 0;
    border-bottom: var(--app-border);
  }

  .toggles {
    display: flex;
    gap: 2rem;
  }
`;

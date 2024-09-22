import { css } from 'lit';

const styles = css`
  :host {
    display: block;
    border-bottom: var(--app-border);
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
  }

  nav,
  header > div {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  h1 {
    margin: 0;
  }

  h1 small {
    display: block;
    font-weight: normal;
    font-size: 0.9rem;
  }

  .logo {
    cursor: pointer;
    color: inherit;
    display: flex;
    gap: 1rem;
    align-items: center;
    text-align: left;
    border: 0;
    background: none;
  }

  .logo img {
    max-width: 96px;
    width: 100%;
    height: auto;
  }
`;

export default styles;

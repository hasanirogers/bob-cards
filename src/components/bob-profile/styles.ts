import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  button.image {
    width: 100%;
  }

  button.close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99;
  }

  button.delete {
    margin-top: 1rem;
  }

  .profile {
    display: grid;
    grid-template-columns: 1fr 1.25fr;
    gap: 8vw;
    align-items: center;
    margin: 2vw 4vw;
    padding: 4vw;
    border: var(--app-border);
  }

  .profile-image {
    text-align: center;
    position: relative;
  }
`;

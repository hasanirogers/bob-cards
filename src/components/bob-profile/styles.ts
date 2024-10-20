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
    display: block;
    margin: 2vw 4vw;
    padding: 4vw;
    border: var(--app-border);
  }

  .profile-image {
    text-align: center;
    position: relative;
  }

  @media screen and (min-width: 769px) {
    .profile {
      display: grid;
      gap: 8vw;
      align-items: center;
      grid-template-columns: 1fr 1fr;
    }
  }
`;

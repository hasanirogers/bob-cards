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

  .profile-image {
    text-align: center;
    position: relative;
  }
`;

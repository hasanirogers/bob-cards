import { css } from 'lit';

export default css`
  :host {
    display: block;
    position: relative;
    padding: 1rem 1.5rem;
    border: var(--app-border);
    border-radius: var(--kemet-border-radius-lg);
    box-shadow: 4px 4px 4px rgb(var(--kemet-color-black) / 66%);
    filter: drop-shadow(8px 8px 8px rgb(var(--kemet-color-black) / 66%));
    background-color: rgb(var(--kemet-color-black) / 10%);

  }

  img {
    aspect-ratio: 1 / 1;
    max-width: 100%;
  }

  section {
    padding: 1rem;
  }

  kemet-button[variant=circle]  {
    position: absolute;
    top: -1rem;
    right: -1rem;
  }

  kemet-button[variant=text] {
    --kemet-button-color: var(--app-color-text);
  }

  kemet-button[variant=text]:hover {
    text-decoration: none;
  }

  kemet-modal p {
    margin: 2rem 0;
  }

  kemet-modal div {
    display: flex;
    justify-content: space-between;
  }
`;

import { css } from 'lit';

export default css`
  main {
    display: block;
    max-width: var(--app-page-width);
    margin: auto;
    padding: 1rem;
  }

  figure {
    margin: 0;
    padding: 2rem;
    background-color: rgb(var(--kemet-color-black) / 50%);
  }

  figcaption {
    margin-top: 1rem;
  }

  nav {
    display: flex;
    gap: 2.5rem;
    flex-direction: column;
    padding: 2rem;
    align-items: flex-start;
    font-size: 1.25rem;
  }
`;

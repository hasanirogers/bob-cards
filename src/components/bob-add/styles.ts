import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  ul {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
    margin: 2rem 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
  }

  fieldset {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 160px;
  }
`;

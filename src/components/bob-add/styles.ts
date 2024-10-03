import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  ul {
    margin: 2rem -1rem;
    padding: 0;
    list-style: none;
    min-height: 540px;
  }

  li {
    width: 33%;
  }

  bob-card-add {
    margin: 1rem;
  }

  fieldset {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 160px;
  }

  section > div {
    display: none;
    text-align: center;
    margin: 1.5rem 0;
  }

  section > div:has(bob-loader[loading]) {
    display: block;
  }
`;

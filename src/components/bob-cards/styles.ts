import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    width: 33%;
  }

  bob-card {
    margin: 1rem;
  }

  .shuffle {
    overflow: visible !important;
  }
`;

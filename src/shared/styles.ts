import { css } from 'lit';

export default css`
  kemet-alert {
    position: fixed;
    top: 2rem;
    left: 50%;
    width: 90%;
    transform: translateX(-50%);
    background: rgb(var(--app-background-color));
  }

  kemet-tabs {
    --kemet-tabs-divider-color: rgb(var(--kemet-color-gray-700));
  }

  kemet-card {
    --kemet-card-border: var(--app-border);
    --kemet-card-background-color: none;

    display: block;
    margin: 2rem auto;
  }

  ::part(input) {
    outline-offset: 6px;
  }
`;

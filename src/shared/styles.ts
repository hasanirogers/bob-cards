import { css } from 'lit';

export default css`
  :host([hidden]) {
    display: none;
  }

  button {
    cursor: pointer;
    color: inherit;
    font-size: inherit;
    padding: 0;
    margin: 0;
    border: 0;
    background: none;
  }

  fieldset {
    border: none;
    padding: 0;
  }

  h2 {
    font-size: 2rem;
    font-weight: 400;
    width: 100%;
    padding: 0;
    margin: 0;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: var(--app-border);
  }

  h3 {
    font-size: 1.75rem;
    font-weight: 400;
  }

  legend {
    font-size: 2rem;
    width: 100%;
    padding: 0;
    margin: 0;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: var(--app-border);
  }

  hr {
    opacity: 0.25;
  }

  a[href*='lostpassword'] {
    display: none;
  }

  kemet-toggle {
    --kemet-toggle-track-shadow: none;
    --kemet-toggle-track-color: transparent;
    --kemet-toggle-track-border: var(--app-border);
  }

  kemet-alert {
    pointer-events: none;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 50%;
    z-index: 9999;
    width: 96%;
    margin-top: 2%;
    transform: translateX(-50%);
    background: rgb(var(--app-background-color));
  }

  kemet-alert[opened] {
    pointer-events: auto;
  }

  kemet-alert > div {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  kemet-alert[status=error] * {
    color: rgb(var(--kemet-color-error));
  }

  kemet-alert[status=success] * {
    color: rgb(var(--kemet-color-success));
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

  kemet-avatar {
    color: rgb(var(--app-background-color));
    padding: 8px;
  }

  ::part(input) {
    outline-offset: 6px;
  }

  ::part(input):-internal-autofill-selected {
    background-color: red !important;
  }

  ::part(overlay) {
    width: 1000vw;
    height: 1000vh;
    left: -100vw;
    top: -100vh;
    background: rgb(var(--kemet-color-black) / 40%);
  }

  .profile-picture {
    aspect-ratio: 1 / 1;
    min-width: 48px;
    border-radius: 50%;
    background-size: 100% auto;
    background-position: center;
    background-repeat: no-repeat;
  }
`;

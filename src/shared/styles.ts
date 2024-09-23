import { css } from 'lit';

export default css`
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

  kemet-alert {
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 50%;
    width: 100%;
    transform: translateX(-50%);
    background: rgb(var(--app-background-color));
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

  .profile-picture {
    aspect-ratio: 1 / 1;
    min-width: 48px;
    border-radius: 50%;
    background-size: 100% auto;
    background-position: center;
    background-repeat: no-repeat;
  }
`;

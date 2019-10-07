import { html } from 'lit-element';

export const sharedStyles = html`
  <style>
    a {
      color: var(--bob-primary-color);
    }

    page-submit,
    page-contributors {
      max-width: var(--bob-page-max-width);
      padding: 1.5rem;
      margin: auto;
    }

    main + footer {
      margin-top: 2rem;
      max-width: var(--bob-page-max-width);
      margin: auto;
      border-top: 1px solid var(--bob-divider-color);
    }
  </style>
`;

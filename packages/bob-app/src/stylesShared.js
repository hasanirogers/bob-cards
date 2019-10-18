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
      padding: 0 1rem;
      border-top: 1px solid var(--bob-divider-color);
    }

    .btn {
      color: var(--bob-white);
      font-weight: bold;
      cursor: pointer;
      padding: 1rem 1.5rem;
      border: 0;
      border-radius: 6px;
      background-color: var(--bob-primary-color);
    }

    .hide {
      display: none;
    }

    .grid-span-all {
      grid-column: 1/-1;
    }
  </style>
`;

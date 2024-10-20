import { css } from 'lit';

export default css`
  :host {
    container-name: bob-card;
    container-type: inline-size;

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
    padding: 2rem 0;
  }

  a {
    display: inline-flex;
    color: var(--app-color-text);
  }

  kemet-button[variant=circle]  {
    position: absolute;
    top: -1rem;
    right: -1rem;
  }

  kemet-button[outlined][variant=circle]  {
    position: static;
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

  .cta {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .social {
    display: none;
  }

  .links,
  .social:has(a) {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .phone > :first-child {
    display: inline-block;
  }

  .phone > :nth-child(2) {
    display: none;
  }

  @media screen and (min-width: 769px) {
    .phone > :first-child {
      display: none;
    }

    .phone > :nth-child(2) {
      white-space: nowrap;
      display: inline-block;
      font-size: 1.25rem;
      font-weight: 400;
    }
  }

  @container bob-card (width > 320px) {
    .cta {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0.75rem;
      align-items: center;
      justify-content: space-between;
    }
  }
`;

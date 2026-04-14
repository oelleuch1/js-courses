import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// ─────────────────────────────────────────────
// EXERCISE 1 — Counter
// Create <my-counter> with increment/decrement buttons and a count display.
// ─────────────────────────────────────────────

@customElement('my-counter')
export class MyCounter extends LitElement {
  // TODO: add a @state() for count

  static styles = css`
    :host { display: inline-flex; align-items: center; gap: 12px; }
    button { padding: 4px 12px; font-size: 1rem; cursor: pointer; }
    span { min-width: 2ch; text-align: center; font-weight: bold; }
  `;

  render() {
    return html`
      <!-- TODO: render decrement button, count, increment button -->
    `;
  }
}

// ─────────────────────────────────────────────
// EXERCISE 2 — Toggle with custom event
// Create <my-toggle> that dispatches 'toggle-changed' with { detail: { isOn } }
// ─────────────────────────────────────────────

@customElement('my-toggle')
export class MyToggle extends LitElement {
  @property({ type: String }) label = 'Toggle';
  // TODO: add @state() for isOn

  static styles = css`
    :host { display: inline-block; }
    button {
      padding: 8px 16px;
      border-radius: 20px;
      border: 2px solid #333;
      cursor: pointer;
      background: white;
    }
    button.active {
      background: #28a745;
      color: white;
      border-color: #28a745;
    }
  `;

  // TODO: implement handleToggle()
  // - flip isOn state
  // - dispatch CustomEvent('toggle-changed', { detail: { isOn }, bubbles: true, composed: true })

  render() {
    return html`
      <!-- TODO: render button with label, active class when isOn, click handler -->
    `;
  }
}

// ─────────────────────────────────────────────
// EXERCISE 3 — User Badge with typed role
// Create <user-badge name="Alice" role="admin">
// ─────────────────────────────────────────────

type UserRole = 'admin' | 'user' | 'viewer';

@customElement('user-badge')
export class UserBadge extends LitElement {
  // TODO: add @property() for name (string)
  // TODO: add @property() for role (UserRole), default 'user'

  static styles = css`
    :host { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; }
    /* TODO: add :host styles for each role variant */
    /* admin = dark red, user = blue, viewer = grey */
  `;

  render() {
    return html`
      <!-- TODO: render name + role badge -->
    `;
  }
}

// ─────────────────────────────────────────────
// SOLUTIONS (collapsed — try first!)
// ─────────────────────────────────────────────

/*
// SOLUTION 1 — Counter
@customElement('my-counter-solution')
export class MyCounterSolution extends LitElement {
  @state() private count = 0;

  static styles = css`
    :host { display: inline-flex; align-items: center; gap: 12px; }
    button { padding: 4px 12px; font-size: 1rem; cursor: pointer; }
    span { min-width: 2ch; text-align: center; font-weight: bold; }
  `;

  render() {
    return html`
      <button @click=${() => this.count--}>−</button>
      <span>${this.count}</span>
      <button @click=${() => this.count++}>+</button>
    `;
  }
}

// SOLUTION 2 — Toggle
@customElement('my-toggle-solution')
export class MyToggleSolution extends LitElement {
  @property({ type: String }) label = 'Toggle';
  @state() private isOn = false;

  static styles = css`
    :host { display: inline-block; }
    button { padding: 8px 16px; border-radius: 20px; border: 2px solid #333; cursor: pointer; background: white; }
    button.active { background: #28a745; color: white; border-color: #28a745; }
  `;

  private handleToggle() {
    this.isOn = !this.isOn;
    this.dispatchEvent(new CustomEvent('toggle-changed', {
      detail: { isOn: this.isOn },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <button class=${this.isOn ? 'active' : ''} @click=${this.handleToggle}>
        ${this.label}
      </button>
    `;
  }
}

// SOLUTION 3 — User Badge
@customElement('user-badge-solution')
export class UserBadgeSolution extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: String }) role: UserRole = 'user';

  static styles = css`
    :host { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; }
    :host([role='admin']) { background: #c0392b; color: white; }
    :host([role='user']) { background: #2980b9; color: white; }
    :host([role='viewer']) { background: #7f8c8d; color: white; }
  `;

  render() {
    return html`${this.name} (${this.role})`;
  }
}
*/

"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";

const fieldClassName =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)]";

// The site has no server, so sending opens the visitor's own email app with
// the message filled in. Nothing is stored or sent anywhere else.
export function ContactForm({ email }: { email: string }) {
  const [opened, setOpened] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim() || `Hello from ${name}`;
    const message = String(data.get("message") ?? "").trim();
    const body = `${message}\n\n${name}${from ? ` (${from})` : ""}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Send me a message"
      className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-[var(--text)]">
          Name <span className="text-[var(--accent)]">*</span>
          <input name="name" required autoComplete="name" className={fieldClassName} />
        </label>
        <label className="block text-sm font-semibold text-[var(--text)]">
          Email <span className="text-[var(--accent)]">*</span>
          <input name="email" type="email" required autoComplete="email" className={fieldClassName} />
        </label>
      </div>
      <label className="mt-5 block text-sm font-semibold text-[var(--text)]">
        Subject
        <input name="subject" className={fieldClassName} />
      </label>
      <label className="mt-5 block text-sm font-semibold text-[var(--text)]">
        Message <span className="text-[var(--accent)]">*</span>
        <textarea name="message" required rows={6} className={`${fieldClassName} resize-y`} />
      </label>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--on-accent)] hover:brightness-110"
        >
          <Send aria-hidden="true" size={16} /> Send message
        </button>
        <p className="text-xs text-[var(--muted)]" aria-live="polite">
          {opened
            ? "Your email app should now be open with the message ready to send."
            : "Opens your email app with the message filled in."}
        </p>
      </div>
    </form>
  );
}

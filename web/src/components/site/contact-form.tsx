"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CONTACT_UI_IT,
  type ContactUiLabels,
} from "@/lib/site-ui-labels";

export function ContactForm({
  successMessage,
  labels = CONTACT_UI_IT,
}: {
  successMessage: string;
  labels?: ContactUiLabels;
}) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/5 p-6 text-success">
        {successMessage}
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={labels.name} name="name" />
        <Field label={labels.email} name="email" type="email" />
      </div>
      <Field label={labels.phone} name="phone" required={false} />
      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-primary"
        >
          {labels.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full rounded-[10px] border border-primary/20 bg-bg px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
        />
      </div>
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        {labels.submit}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-primary"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-[10px] border border-primary/20 bg-bg px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
      />
    </div>
  );
}

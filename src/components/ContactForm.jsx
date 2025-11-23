import React, { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    alert("Dummy submit. This will be wired to Strapi later.");
  };
  return (
    <form onSubmit={submit} className="card p-6 grid gap-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <input name="name" value={form.name} onChange={handle} className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2" placeholder="Your name" />
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <input name="email" value={form.email} onChange={handle} type="email" className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2" placeholder="you@example.com" />
      </div>
      <div>
        <label className="text-sm font-medium">Message</label>
        <textarea name="message" value={form.message} onChange={handle} rows="5" className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2" placeholder="How can we help?" />
      </div>
      <button className="rounded-xl bg-accent text-slate-900 px-5 py-2 font-semibold">Send</button>
    </form>
  );
}

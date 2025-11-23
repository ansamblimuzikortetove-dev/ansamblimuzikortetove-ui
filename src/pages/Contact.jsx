import React from "react";
import ContactForm from "../components/ContactForm";

export default function Contact() {
  return (
    <section className="container-max py-12 grid gap-8 lg:grid-cols-2">
      <ContactForm />
      <div className="card overflow-hidden">
        <iframe
          title="Map"
          className="w-full h-full min-h-80"
          src="https://maps.google.com/maps?q=Skopje&t=&z=13&ie=UTF8&iwloc=&output=embed"
          loading="lazy"
        />
      </div>
    </section>
  );
}

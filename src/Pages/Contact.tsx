import React, { useState } from "react";
import axios from "axios";

const Contact: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = { name, email, message };

    axios
      .post("/api/contact", data)
      .then((response) => {
        console.log(response.data);
        // Formularen ble sendt og behandlingen var vellykket
      })
      .catch((error) => {
        console.error(error);
        // Feil ved sending av formularen
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Contact Us
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col mt-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="font-bold">
            Navn:
          </label>
          <input
            type="text"
            id="name"
            placeholder="Vennligst skriv inn ditt navn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="font-bold">
            E-post:
          </label>
          <input
            type="email"
            id="email"
            placeholder="Vennligst skriv inn e-postadressen"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <label htmlFor="message" className="font-bold">
          Melding:
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition mt-4"
        >
          Send inn
        </button>
      </form>
    </div>
  );
};

export default Contact;
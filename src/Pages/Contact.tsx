import React, { useState } from "react";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa"; // Lagt til for en penere suksessmelding

const Contact: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = { name, email, message };

    axios
      .post("http://localhost:5000/api/contact", data)
      .then((response) => {
        console.log("✅ Melding sendt:", response.data);
        setName("");
        setEmail("");
        setMessage("");

        // Vis en pen toast i stedet for nettleser-alert
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      })
      .catch((error) => {
        console.error("❌ Feil ved sending av kontaktskjema:", error);
        alert("Noe gikk galt. Vennligst prøv igjen senere.");
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 relative">
      {/* Suksess-toast */}
      <div
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 w-[90%] sm:w-auto transition-all duration-300 font-medium ${
          showToast
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 translate-y-4 invisible"
        }`}
      >
        <FaCheckCircle className="text-green-400 text-xl shrink-0" />
        <span className="text-sm">
          Takk! Meldingen din har blitt sendt inn.
        </span>
      </div>

      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Contact Us
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5 mt-4">
        {/* Navn */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="font-semibold text-gray-700">
            Navn:
          </label>
          <input
            type="text"
            id="name"
            required
            placeholder="Vennligst skriv inn ditt navn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* E-post */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="font-semibold text-gray-700">
            E-post:
          </label>
          <input
            type="email"
            id="email"
            required
            placeholder="Vennligst skriv inn e-postadressen"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Melding */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="font-semibold text-gray-700">
            Melding:
          </label>
          <textarea
            id="message"
            required
            rows={5}
            placeholder="Skriv meldingen din her..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y min-h-[120px]"
          ></textarea>
        </div>

        {/* Knapp */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition shadow-sm mt-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Send inn
        </button>
      </form>
    </div>
  );
};

export default Contact;

 import React from "react";
import { FaEnvelope, FaPhoneAlt, FaQuestionCircle, FaHeadset } from "react-icons/fa";

function Supportpage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col items-center py-12 px-6">
      <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 mb-10">
        Support & Help
      </h1>

      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left column: Text & contact options */}
        <div className="w-full md:w-1/2 p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            We’re here to help
          </h2>
          <p className="text-gray-600 leading-relaxed">
            At <span className="font-semibold text-orange-600">KR Travels</span>, your comfort and peace of mind is our top priority. If you face any issues or have questions about your booking, travel or journey – we are just a message or call away.
          </p>

          <div className="space-y-4">
            <ContactCard
              icon={<FaQuestionCircle className="text-orange-500 text-3xl" />}
              title="Frequently Asked Questions"
              detail="Check our FAQ for quick answers to common queries."
            />
            <ContactCard
              icon={<FaEnvelope className="text-blue-500 text-3xl" />}
              title="Email Support"
              detail="support@KR travels.com"
            />
            <ContactCard
              icon={<FaPhoneAlt className="text-green-500 text-3xl" />}
              title="Call Us"
              detail="+91 878650 6780"
            />
            <ContactCard
              icon={<FaHeadset classAlso="text-purple-500 text-3xl" />}
              title="Live Chat"
              detail="Available 24/7 via our website"
            />
          </div>
        </div>

      
        <div className="w-full md:w-1/2">
          <img
            src="kr-tavels.jpg" 
            alt="Support at KR TRAVELS"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="mt-10 text-gray-500 text-sm">
        © {new Date().getFullYear()} KR Travels. All rights reserved.
      </div>
    </div>
  );
}

const ContactCard = ({ icon, title, detail }) => (
  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
    <div>{icon}</div>
    <div>
      <h4 className="font-semibold text-gray-800">{title}</h4>
      <p className="text-gray-600">{detail}</p>
    </div>
  </div>
);

export default Supportpage;

import Link from "next/link";
import { Stethoscope } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1656a4] to-[#1656a4]/80 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold">Arogya</span>
                <div className="text-xs text-gray-400 -mt-1">
                  Professional Healthcare
                </div>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Professional healthcare services with modern technology and
              experienced doctors.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-6 text-lg">Services</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">
                General Consultation
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Specialist Care
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Health Checkups
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Online Prescriptions
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/guest/doctors"
                  className="hover:text-white transition-colors"
                >
                  Our Doctors
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-6 text-lg">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <span>📞</span> +94 21 343 3433
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span> info@arogya.com
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span> 123 Nelliyady Karaveddy.
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>
            &copy; 2024 Arogya. All rights reserved. | Professional Healthcare
            Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
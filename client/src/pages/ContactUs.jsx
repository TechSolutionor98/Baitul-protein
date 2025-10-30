"use client"
import React, { useState } from "react";
import axios from "axios";
import config from "../config/config";

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${config.API_URL}/api/request-callback`, form);
      setSuccess(true);
      setForm({ name: "", email: "", phone: "" });
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Info Section */}
        <div className="rounded-xl  p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Contact Us</h2>
          <p className="text-gray-600 mb-8">Our friendly team is always here to chat.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div>
              <div className="text-sm font-semibold text-gray-900">Customer Service</div>
              <a href="tel:18662378289" className="text-[#d9a82e] font-medium">1-866-237-8289</a>
              <div className="text-xs text-gray-500 mt-1">Call us from 8am to 12am ET.</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Chat with us here!</div>
              <a href="#" className="text-[#d9a82e] font-medium">Chat Now</a>
              <div className="text-xs text-gray-500 mt-1">Daily: 8 am to 11 pm CT</div>
            </div>
          </div>

          <div className="mt-2">
            <div className="text-xl font-semibold text-gray-900 mb-4">Contact Information</div>
            <div className="space-y-2 text-sm text-gray-700">
              <div>340 Main Street Los Angeles, CA 90291</div>
              <div>United States</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div>
                <div className="text-xs tracking-wide text-gray-500 mb-1">Phone</div>
                <div className="space-y-1">
                  <a href="tel:+13103106000" className="block text-sm text-gray-800 hover:text-[#d9a82e]">+971 6550 81 61</a>
                  {/* <a href="tel:+13102425002" className="block text-sm text-gray-800 hover:text-[#d9a82e]">+1 310-242-5002</a> */}
                </div>
              </div>
              <div>
                <div className="text-xs tracking-wide text-gray-500 mb-1">Email</div>
                <div className="space-y-1">
                  <a href="mailto:losangelesmotta@uix.store" className="block text-sm text-gray-800 hover:text-[#d9a82e]">info@Baytalprotein.net</a>
                  {/* <a href="mailto:info@uix.store" className="block text-sm text-gray-800 hover:text-[#d9a82e]">info@uix.store</a> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form Section */}
        <div className="w-full">
          <div className="w-full space-y-6 bg-white p-8 rounded-xl shadow-lg ">
            <div>
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-[#2377c1]">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2m18 0v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8m18 0l-9 6-9-6" />
                </svg>
              </div>
              <h3 className="mt-6 text-center text-2xl font-extrabold text-gray-900">Contact Form</h3>
              <p className="mt-2 text-center text-sm text-[#d9a82e]">We look forward to hearing from you and
will try to respond within three days.</p>
            </div>
            {success ? (
              <div className="text-green-600 font-medium text-center">Request submitted successfully!</div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#d9a82e] focus:border-[#d9a82e] focus:z-10 sm:text-sm"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#d9a82e] focus:border-[#d9a82e] focus:z-10 sm:text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#d9a82e] focus:border-[#d9a82e] focus:z-10 sm:text-sm"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#d9a82e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d9a82e]"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Send Request"}
                  </button>
                </div>
              </form>
            )}
            <p className="text-xs text-gray-500 text-center">We'll get back to you as soon as possible.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

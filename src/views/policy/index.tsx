import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-y-auto">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FFEF43] to-[#FFC42F] bg-clip-text text-transparent mb-4">
            Dolla Privacy Policy
          </h1>
          <p className="text-gray-300 text-lg">Effective Date: 2025-07-15</p>
        </div>

        {/* Introduction */}
        <div className="backdrop-blur-sm rounded-2xl p-8">
          <p className="text-gray-200 text-lg leading-relaxed">
            Eureka Labs Ltd. ("we," "our," "us") operates the Dolla platform
            ("Dolla," "Service"), a blockchain-based micro-bid marketplace that
            enables users to participate in probabilistic auctions for digital
            assets. We respect your privacy and are committed to protecting it
            through compliance with this policy.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-2">
          {/* Section 1 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-200 leading-relaxed mb-4">
              We may collect the following types of information:
            </p>
            <ul className="text-gray-200 leading-relaxed space-y-2 ml-4">
              <li>
                • <strong>On-chain Data:</strong> Public blockchain wallet
                addresses and transaction history, bidding activity.
              </li>
              <li>
                • <strong>Off-chain Data:</strong> Email address,
                Discord/Twitter handles (when provided), IP address, device
                identifiers, browser type, usage analytics.
              </li>
              <li>
                • <strong>Cookies and Similar Technologies.</strong>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-200 leading-relaxed">
              We use collected data to operate and improve the Service, process
              transactions, enforce rules, provide support, and comply with
              legal requirements.
            </p>
          </div>

          {/* Section 3 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              3. Sharing and Disclosure
            </h2>
            <p className="text-gray-200 leading-relaxed">
              We will not sell your data. We may share information with service
              providers, comply with legal requests, and protect rights and
              safety.
            </p>
          </div>

          {/* Section 4 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-200 leading-relaxed">
              We implement reasonable safeguards, but blockchain transactions
              are public, immutable, and cannot be erased.
            </p>
          </div>

          {/* Section 5 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              5. Your Rights
            </h2>
            <p className="text-gray-200 leading-relaxed">
              You may have rights to access, correct, delete your data, opt-out
              of cookies, or request processing information.
            </p>
          </div>

          {/* Section 6 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              6. International Data Transfers
            </h2>
            <p className="text-gray-200 leading-relaxed">
              Data may be processed in jurisdictions outside your residence.
            </p>
          </div>

          {/* Section 7 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              7. Children's Privacy
            </h2>
            <p className="text-gray-200 leading-relaxed">
              Not directed to persons under 18.
            </p>
          </div>

          {/* Section 8 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              8. Changes to This Policy
            </h2>
            <p className="text-gray-200 leading-relaxed">
              We may update this Policy; continued use constitutes acceptance.
            </p>
          </div>

          {/* Section 9 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              9. Contact Us
            </h2>
            <div className="text-gray-200 leading-relaxed space-y-2">
              <p>Eureka Labs Ltd.</p>
              <p>
                Email: <span className="font-semibold">joe@dapdap.org</span>
              </p>
              <p>
                Business Address:{" "}
                <span className="font-semibold">
                  George Town, Grand Cayman, Cayman Islands
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Eureka Labs Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

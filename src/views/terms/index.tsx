import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-y-auto">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FFEF43] to-[#FFC42F] bg-clip-text text-transparent mb-4">
            Dolla Terms of Service
          </h1>
          <p className="text-gray-300 text-lg">Effective Date: 2025-07-15</p>
        </div>

        {/* Introduction */}
        <div className="backdrop-blur-sm rounded-2xl p-8">
          <p className="text-gray-200 text-lg leading-relaxed">
            These Terms govern your use of the Dolla platform provided by Eureka
            Labs Ltd. By using Dolla, you agree to these Terms.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-2">
          {/* Section 1 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              1. Eligibility
            </h2>
            <p className="text-gray-200 leading-relaxed">
              You must be at least 18 years old and legally allowed to engage in
              digital asset transactions.
            </p>
          </div>

          {/* Section 2 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              2. Nature of the Service
            </h2>
            <p className="text-gray-200 leading-relaxed">
              Dolla is a probabilistic auction marketplace for NFTs, tokens, and
              other digital assets. Each bid costs 1 USDC, with win probability
              based on listing price. Outcomes are determined by Switchboard VRF
              and are final.
            </p>
          </div>

          {/* Section 3 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              3. Account & Wallet
            </h2>
            <p className="text-gray-200 leading-relaxed">
              You are responsible for your blockchain wallet. We do not hold
              custody or private keys.
            </p>
          </div>

          {/* Section 4 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              4. Bidding Rules
            </h2>
            <p className="text-gray-200 leading-relaxed">
              Bids are non-refundable. Winning bids transfer the asset
              instantly. Losing bids may trigger secondary rewards.
            </p>
          </div>

          {/* Section 5 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              5. Seller Rules
            </h2>
            <p className="text-gray-200 leading-relaxed">
              Only whitelisted assets may be listed. Listings are marked up by a
              set percentage. Platform fees apply only to net profits: Net
              Profit = Total Sale Price - Anchor Price.
            </p>
          </div>

          {/* Section 6 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">6. Fees</h2>
            <p className="text-gray-200 leading-relaxed">
              Fees are progressive and charged only on net profits.
            </p>
          </div>

          {/* Section 7 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              7. Risk Disclosure
            </h2>
            <p className="text-gray-200 leading-relaxed">
              Participation involves loss risk. Asset values are volatile.
            </p>
          </div>

          {/* Section 8 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              8. Prohibited Conduct
            </h2>
            <p className="text-gray-200 leading-relaxed">
              No bots, manipulation, or unlawful activity.
            </p>
          </div>

          {/* Section 9 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-gray-200 leading-relaxed">
              Service is provided "AS IS". Our liability is limited to fees paid
              in the past 6 months.
            </p>
          </div>

          {/* Section 10 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              10. Dispute Resolution
            </h2>
            <p className="text-gray-200 leading-relaxed">
              Governed by Cayman Islands law; arbitration applies.
            </p>
          </div>

          {/* Section 11 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              11. Changes to Terms
            </h2>
            <p className="text-gray-200 leading-relaxed">
              We may update Terms; continued use means acceptance.
            </p>
          </div>

          {/* Section 12 */}
          <div className="backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#FFEF43] mb-4">
              12. Contact
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

export default TermsOfService;

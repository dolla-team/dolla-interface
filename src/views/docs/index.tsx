import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTaskStore from "@/stores/use-task";

export default function Docs() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("concept");
  const taskStore = useTaskStore();
  const sections = [
    { id: "concept", title: "The Concept", icon: "💡" },
    { id: "buyers", title: "For Bidders", icon: "🛒" },
    { id: "sellers", title: "For Sellers", icon: "🏪" },
    { id: "fairness", title: "Fair Probability", icon: "⚖️" }
  ];

  const content = {
    concept: {
      title: "The Concept",
      description:
        "Dolla turns traditional buying and selling into a probabilistic marketplace — where assets are won through on-chain odds, not fixed prices.",
      details: [
        "Transform traditional commerce into probability-based trading",
        "Win high-value assets through transparent odds",
        "Real-time on-chain asset transfers",
        "No queues, no waiting - every bid is a new opportunity"
      ]
    },
    buyers: {
      title: "For Bidders",
      description:
        "Bid 1 Dolla (1 USDT) for a chance to win high-value assets like ETH, NFTs, or meme tokens.",
      features: [
        {
          title: "Simple Bidding",
          description:
            "Bid 1 Dolla (1 USDT) for a chance to win high-value assets like ETH, NFTs, or meme tokens.",
          icon: "💰"
        },
        {
          title: "Fair Odds",
          description:
            "Each bid is an independent trial with odds based on the asset's Anchor Price.",
          icon: "🎯"
        },
        {
          title: "Instant Wins",
          description:
            "Win instantly — the asset transfers on-chain in real time.",
          icon: "⚡"
        },
        {
          title: "No Waiting",
          description:
            "No waiting, no queue — every click is a new chance to win.",
          icon: "🚀"
        }
      ]
    },
    sellers: {
      title: "For Sellers",
      description:
        "List any asset and set an Anchor Price (base value for odds).",
      features: [
        {
          title: "Easy Listing",
          description:
            "List any asset and set an Anchor Price (base value for odds).",
          icon: "📝"
        },
        {
          title: "Market Lock",
          description:
            "The market is locked for 72 hours — can't be cancelled early.",
          icon: "🔒"
        },
        {
          title: "Manual Close",
          description:
            "After 72 hours, you can close the market manually if unsold (a small penalty applies).",
          icon: "⏰"
        },
        {
          title: "Earn from Bids",
          description:
            "Earn from all valid bids, even if total bids exceed the asset's value.",
          icon: "💎"
        }
      ]
    },
    fairness: {
      title: "Fair Probability",
      description:
        "Random outcomes powered by verifiable on-chain randomness (TEE + contract validation).",
      features: [
        {
          title: "Verifiable Randomness",
          description:
            "Random outcomes powered by verifiable on-chain randomness (TEE + contract validation).",
          icon: "🎲"
        },
        {
          title: "Transparent Odds",
          description:
            "Every bid's chance is transparent, auditable, and tamper-proof.",
          icon: "🔍"
        },
        {
          title: "No Hidden Logic",
          description:
            "No hidden logic — just provably fair odds for everyone.",
          icon: "✨"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0f12] to-[#1a1d23] text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            How Dolla Works
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto">
            Discover the revolutionary probabilistic marketplace where assets
            are won through transparent odds, not fixed prices.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-lg font-semibold mb-4 text-yellow-400">
                Navigation
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                      activeSection === section.id
                        ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                        : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                    }`}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              {/* Concept Section */}
              {activeSection === "concept" && (
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💡</div>
                    <h2 className="text-3xl font-bold mb-4 text-yellow-400">
                      {content.concept.title}
                    </h2>
                    <p className="text-xl text-gray-300 leading-relaxed">
                      {content.concept.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {content.concept.details.map((detail, index) => (
                      <div
                        key={index}
                        className="bg-white/5 rounded-lg p-6 border border-white/10"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center text-yellow-400 font-bold">
                            {index + 1}
                          </div>
                          <p className="text-gray-300">{detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Buyers Section */}
              {activeSection === "buyers" && (
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-3xl font-bold mb-4 text-yellow-400">
                      {content.buyers.title}
                    </h2>
                    <p className="text-xl text-gray-300 leading-relaxed">
                      {content.buyers.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {content.buyers.features.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-yellow-400/30 transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-3xl">{feature.icon}</div>
                          <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">
                              {feature.title}
                            </h3>
                            <p className="text-gray-300">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sellers Section */}
              {activeSection === "sellers" && (
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🏪</div>
                    <h2 className="text-3xl font-bold mb-4 text-yellow-400">
                      {content.sellers.title}
                    </h2>
                    <p className="text-xl text-gray-300 leading-relaxed">
                      {content.sellers.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {content.sellers.features.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-yellow-400/30 transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-3xl">{feature.icon}</div>
                          <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">
                              {feature.title}
                            </h3>
                            <p className="text-gray-300">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fairness Section */}
              {activeSection === "fairness" && (
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="text-6xl mb-4">⚖️</div>
                    <h2 className="text-3xl font-bold mb-4 text-yellow-400">
                      {content.fairness.title}
                    </h2>
                    <p className="text-xl text-gray-300 leading-relaxed">
                      {content.fairness.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {content.fairness.features.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-yellow-400/30 transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-3xl">{feature.icon}</div>
                          <div>
                            <h3 className="text-lg font-semibold mb-2 text-white">
                              {feature.title}
                            </h3>
                            <p className="text-gray-300">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-2xl p-8 border border-yellow-400/30">
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">
                  Ready to Experience Dolla?
                </h3>
                <p className="text-gray-300 mb-6">
                  Join the probabilistic marketplace and start winning assets
                  today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      navigate("/");
                      setTimeout(() => {
                        taskStore.set({ isBid: true });
                      }, 300);
                    }}
                    className="button bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-200"
                  >
                    Bid Now
                  </button>
                  <button
                    onClick={() => navigate("/btc/create")}
                    className="button border border-yellow-400 text-yellow-400 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400/10 transition-colors duration-200"
                  >
                    Launch a Market
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

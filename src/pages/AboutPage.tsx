import React from 'react';
import { Leaf, Shield, Users } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AboutPage = () => {
  const prefersReducedMotion = useReducedMotion();
  const drivers = [
    {
      icon: <Leaf className="h-8 w-8 text-emerald-500" />,
      title: 'Clear Understanding',
      description: 'Expose what is natural, artificial, excessive, or unnecessary in a product.',
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-500" />,
      title: 'Safety by Design',
      description: 'Surface potential allergens and sensitizers before they reach your plate.',
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-500" />,
      title: 'Consumer Empowerment',
      description: 'Give people the ability to make decisions based on facts, not packaging language.',
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-500" />,
      title: 'Community Insight',
      description: 'Foster a growing community of users who care about transparency and better choices.',
    }
  ];

  const { ref: titleRef, inView: titleInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { ref: featuresRef, inView: featuresInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <>
      <Helmet>
        <title>About ingreBOARD - Our Mission and Team</title>
        <meta name="description" content="Learn about ingreBOARD's mission to empower informed choices through ingredient analysis. " />
      </Helmet>

      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              About ingreBOARD
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto mb-6">
              ingreBOARD is built on a straightforward idea: ingredient lists shouldn't require scientific literacy. People deserve clarity about what they're putting into their bodies, without needing to decode jargon, chemical names, or marketing tricks.
            </p>
            <p className="text-gray-400 max-w-3xl mx-auto mb-6">
              The platform began with a simple purpose - scan any ingredient list and translate it into plain, actionable understanding. Today, that core remains our focus. The tool reads raw ingredient text, cleans it, analyzes each component, flags potential allergens, and presents everything in a way that is easy to interpret.
            </p>
            <p className="text-gray-400 max-w-3xl mx-auto mb-10">
              We're building toward a future where ingredient intelligence becomes accessible, contextual, and personalized. As the system matures, ingreBOARD will evolve into a broader decision-support platform - showing what an ingredient is, why it matters, how it affects different dietary needs, and how it aligns with individual health goals.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-800/60 rounded-lg p-8 mb-16 max-w-4xl mx-auto border border-gray-700"
          >
            <h3 className="text-emerald-400 text-2xl font-bold mb-6 text-center">Platform Capabilities (v2.0)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'Serverless Backend', desc: 'Secure, high-performance Vercel Edge compute for instant processing.' },
                { title: 'Open Food Facts', desc: 'Integrated with the world\'s largest open food database for barcode lookup.' },
                { title: 'Groq AI (GPT-OSS 20B)', desc: 'Advanced semantic analysis replacing legacy Gemini models for better accuracy.' },
                { title: 'Real-time OCR', desc: 'Extract ingredient lists instantly from product packaging images.' },
                { title: 'Allergen Detection', desc: 'Automated flagging of potential allergens and sensitizers.' },
                { title: 'Risk Scoring', desc: 'Weighted scoring model based on regulatory data and additives.' }
              ].map((f, i) => (
                <div key={i} className="flex flex-col p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                  <span className="text-emerald-400 font-semibold mb-1">▹ {f.title}</span>
                  <span className="text-gray-400 text-sm">{f.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div
            ref={featuresRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          >
            {drivers.map((driver, index) => {
              const hiddenState = prefersReducedMotion
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-6 scale-95';
              const visibleState = 'opacity-100 translate-y-0 scale-100';

              return (
                <div
                  key={driver.title}
                  className={`bg-gray-800 rounded-lg p-8 text-center transition-transform duration-700 ease-out will-change-transform will-change-opacity hover:-translate-y-1 ${featuresInView ? visibleState : hiddenState
                    } ${prefersReducedMotion ? '' : 'transition-opacity'}`}
                  style={
                    prefersReducedMotion
                      ? undefined
                      : { transitionDelay: `${index * 120}ms` }
                  }
                >
                  <div className="flex justify-center mb-4">{driver.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {driver.title}
                  </h3>
                  <p className="text-gray-400">{driver.description}</p>
                </div>
              );
            })}
          </div>

          <div className="max-w-4xl mx-auto text-center border-t border-gray-800 pt-16">
            <h3 className="text-2xl font-bold text-white mb-6">Our Commitment</h3>
            <p className="text-gray-400 text-lg mb-8">
              ingreBOARD is the first step toward a more informed food ecosystem - one ingredient list at a time. We are committed to using the best technology, from Groq AI to Open Food Facts, to provide you with the most accurate information.
            </p>
            <a
              href="/technology"
              className="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              Learn more about our technology stack <span className="ml-2">→</span>
            </a>
          </div>

          {/* Open Source Callout */}
          <div className="max-w-4xl mx-auto mt-16 bg-gray-800/50 border border-emerald-500/20 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Open Source on GitHub
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              ingreBOARD is built in the open
            </h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              We believe transparency doesn't stop at ingredient labels. The entire codebase is open source — review it, fork it, and help make it better. Contributions of all kinds are warmly welcomed.
            </p>
            <a
              href="https://github.com/techynAR/ingreBOARD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-sm transition-all duration-200"
            >
              <svg viewBox="0 0 16 16" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              View on GitHub & Contribute
            </a>
          </div>

        </div>
      </section>
    </>
  );
};

export default AboutPage;

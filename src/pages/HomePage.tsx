import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, AlertTriangle, CheckCircle } from 'lucide-react';
import Lottie from 'react-lottie-player';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
// Import the updated phone animation
import phoneAnimation from '../assets/Phone.json';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';

const HomePage = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      icon: <Camera className="h-6 w-6 text-emerald-500" />,
      title: "Ingredient Breakdown",
      description: "Instantly interpret each ingredient with simplified explanations."
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-emerald-500" />,
      title: "Allergen & Sensitivity Alerts",
      description: "Automatic detection of common allergens and risk markers."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-emerald-500" />,
      title: "Smart Text Processing",
      description: "Cleans messy ingredient text for accurate and consistent analysis."
    }
  ];

  return (
    <>
      <Helmet>
        <title>ingreBOARD - Ingredient Analysis Made Easy</title>
        <meta name="description" content="Analyze food and cosmetic ingredients instantly with ingreBOARD. Identify allergens, understand ingredients, and make informed choices about your products." />
      </Helmet>
      
      <section className="min-h-screen bg-gray-900 text-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center"
          >
            <motion.div variants={fadeIn}>
              <img 
                src="/ingreBOARD-logo.png" 
                alt="ingreBOARD Logo" 
                className="w-48 h-48 rounded-full object-cover mb-6 mx-auto" 
              />
              {/* Use Lottie with the Phone.json file */}
              <Lottie
                loop
                animationData={phoneAnimation}
                play
                style={{ width: 300, height: 300 }}
              />
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-4xl sm:text-6xl font-bold mt-8 mb-4"
            >
              Welcome to <span className="text-emerald-500">ingreBOARD</span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-xl sm:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto"
            >
              A smarter way to understand what's inside your food.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex justify-center mb-6"
            >
              <InteractiveHoverButton
                text="Try the Tool"
                onClick={() => navigate('/scanner')}
              />
            </motion.div>

            <motion.p
              variants={fadeIn}
              className="text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              Clarity begins with knowing what you're consuming.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Why ingreBOARD exists</h2>
              <p className="text-gray-300 mb-6">
                Most people skim ingredient labels without truly understanding them. Technical terms, additives, hidden allergens, and vague descriptions make it nearly impossible to judge what a product really contains. That confusion leads to poor decisions, especially for people with allergies, sensitivities, or specific dietary goals.
              </p>
              <p className="text-gray-300 mb-6">
                <strong className="text-emerald-400">ingreBOARD</strong> solves this by turning any ingredient list into clear, structured insight. One scan. No guesswork. Real understanding.
              </p>
              <div className="bg-gray-700 rounded-lg p-6 border-l-4 border-emerald-500">
                <p className="text-white">
                  Clarity begins with knowing what you're consuming. That's why we built a tool focused on truth over marketing language.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              {/* Use Lottie with the Phone.json file */}
              <Lottie
                loop
                animationData={phoneAnimation}
                play
                style={{ width: 400, height: 400 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Key Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our tool provides comprehensive analysis to help you understand what's in your products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-800 rounded-lg p-8 hover:bg-gray-700 transition-colors"
              >
                <div className="bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source / Contributions Section */}
      <section className="bg-gray-900 py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Open Source
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Built in the Open. <span className="text-emerald-400">Powered by the Community.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              ingreBOARD is open source and welcomes contributions from developers, designers, researchers, and anyone who cares about food transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                emoji: '🐛',
                title: 'Report Bugs',
                description: 'Found something broken? Open an issue and help us improve accuracy and reliability.'
              },
              {
                emoji: '✨',
                title: 'Suggest Features',
                description: 'Have an idea that makes ingredient analysis smarter? Share it with us on GitHub.'
              },
              {
                emoji: '🔧',
                title: 'Submit a PR',
                description: 'Contribute code, fix issues, improve UI, or add new integrations. All PRs are welcome.'
              }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-800/60 border border-gray-700/60 rounded-xl p-6 hover:border-emerald-500/40 hover:bg-gray-800 transition-all duration-300 group"
              >
                <div className="text-3xl mb-4">{item.emoji}</div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-white font-semibold text-lg mb-1">
                🌿 techynAR / ingreBOARD
              </p>
              <p className="text-gray-400 text-sm">
                github.com/techynAR/ingreBOARD
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://github.com/techynAR/ingreBOARD/stargazers"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-sm transition-all duration-200 border border-gray-600 hover:border-gray-500"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4 fill-yellow-400" aria-hidden="true">
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                </svg>
                Star on GitHub
              </a>
              <a
                href="https://github.com/techynAR/ingreBOARD/fork"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm transition-all duration-200"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                Fork &amp; Contribute
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-700/20 via-teal-600/20 to-cyan-500/20 py-16 border-t border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to see what's really in your food?</h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Try ingreBOARD Now. Try ingreBOARD Now.
          </p>
          <InteractiveHoverButton
            text="Try ingreBOARD Now"
            onClick={() => navigate('/scanner')}
          />
        </div>
      </section>
    </>
  );
};

export default HomePage;
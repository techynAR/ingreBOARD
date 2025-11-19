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
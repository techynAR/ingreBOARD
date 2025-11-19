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
            className="bg-gray-800/60 rounded-lg p-6 mb-16 max-w-4xl mx-auto"
          >
            <h3 className="text-yellow-400 font-semibold mb-2">Current Development Status</h3>
            <p className="text-gray-300">
              ingreBOARD is actively evolving. The current version focuses on accurate ingredient analysis and reliable allergen detection. We are continuously refining the engine to improve precision, expand our database, and support more nuanced classifications across different product categories.
            </p>
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
                  className={`bg-gray-800 rounded-lg p-8 text-center transition-transform duration-700 ease-out will-change-transform will-change-opacity hover:-translate-y-1 ${
                    featuresInView ? visibleState : hiddenState
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

          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-400 text-lg">
              ingreBOARD is the first step toward a more informed food ecosystem - one ingredient list at a time.
            </p>
          </div>

        </div>
      </section>
    </>
  );
};

export default AboutPage;

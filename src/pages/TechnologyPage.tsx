import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import {
  Camera,
  Brain,
  Database,
  Zap,
  Shield,
  Code2,
  Cpu,
  Eye,
  Layers,
  GitBranch,
  Network,
  Sparkles
} from 'lucide-react';
import DatabaseWithRestApi from '@/components/ui/database-with-rest-api';

const TechnologyPage = () => {
  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { ref: techStackRef, inView: techStackInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { ref: architectureRef, inView: architectureInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { ref: pipelineRef, inView: pipelineInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { ref: specsRef, inView: specsInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { ref: ctaRef, inView: ctaInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const techStack = [
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Tesseract.js OCR Engine",
      description: "Advanced optical character recognition using WebAssembly-compiled LSTM neural networks for accurate text extraction from images.",
      tech: "OCR.Space API v2 + Tesseract.js v6"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Groq AI (Llama 3.3)",
      description: "Ultra-fast inference engine utilizing Llama 3.3 70B for deep semantic analysis, safety assessment, and ingredient classification.",
      tech: "Groq SDK + Llama 3.3 70B"
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Open Food Facts",
      description: "Global collaborative food database integration for instant barcode lookup and verified product data enrichment.",
      tech: "Open Food Facts API v2"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Serverless Backend",
      description: "High-performance asynchronous processing pipeline deployed on Vercel Edge for instant, scalable ingredient analysis.",
      tech: "Vercel Functions + Node.js Context"
    }
  ];

  const architectureLayers = [
    {
      title: "Presentation Layer",
      items: ["React 18 with TypeScript", "Tailwind CSS + Framer Motion", "Responsive PWA Architecture"],
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Business Logic Layer",
      items: ["Singleton Service Pattern", "Async State Management", "Error Boundary Handling"],
      color: "from-teal-500 to-cyan-600"
    },
    {
      title: "Integration Layer",
      items: ["OCR.Space REST API", "Groq AI (Llama 3.3) API", "Open Food Facts API"],
      color: "from-cyan-500 to-blue-600"
    },
    {
      title: "Data Layer",
      items: ["Local Knowledge Base", "String Similarity Matching", "Fuzzy Search Algorithms"],
      color: "from-blue-500 to-indigo-600"
    }
  ];

  const processingPipeline = [
    {
      step: "01",
      title: "Image Capture & Preprocessing",
      description: "High-resolution image acquisition with automatic orientation detection, noise reduction, and contrast enhancement.",
      icon: <Eye className="h-6 w-6" />
    },
    {
      step: "02",
      title: "OCR Text Extraction",
      description: "Multi-engine OCR processing with Tesseract LSTM networks and OCR.Space API, utilizing confidence scoring and character segmentation.",
      icon: <Code2 className="h-6 w-6" />
    },
    {
      step: "03",
      title: "Text Normalization & Parsing",
      description: "Advanced regex-based parsing with Levenshtein distance algorithms for ingredient tokenization and delimiter detection.",
      icon: <GitBranch className="h-6 w-6" />
    },
    {
      step: "04",
      title: "AI-Powered Analysis",
      description: "LLM-based semantic analysis using Groq AI with advanced prompt engineering for safety assessment and allergen detection.",
      icon: <Brain className="h-6 w-6" />
    },
    {
      step: "05",
      title: "Knowledge Base Matching",
      description: "Hybrid search combining exact matching with fuzzy string similarity algorithms (Levenshtein, Jaro-Winkler) against curated database.",
      icon: <Database className="h-6 w-6" />
    },
    {
      step: "06",
      title: "Results Rendering",
      description: "React-based virtualized rendering with lazy loading, suspense boundaries, and optimistic UI updates for instant feedback.",
      icon: <Sparkles className="h-6 w-6" />
    }
  ];

  return (
    <>
      <Helmet>
        <title>Technology & Architecture - ingreBOARD</title>
        <meta
          name="description"
          content="Explore the advanced technology stack powering ingreBOARD: OCR, AI, and modern web architecture for ingredient analysis."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent" />
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto relative z-10"
          >
            <div className="flex items-center justify-center mb-6">
              <Cpu className="h-12 w-12 text-emerald-400 mr-4" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Technology Stack
              </h1>
            </div>
            <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto leading-relaxed">
              Powered by cutting-edge AI, advanced OCR, and modern web technologies to deliver
              <span className="text-emerald-400 font-semibold"> real-time ingredient analysis</span> with unparalleled accuracy.
            </p>
          </motion.div>
        </section>

        {/* Core Technologies */}
        <section className="py-16 px-4">
          <div
            ref={techStackRef}
            className="max-w-6xl mx-auto"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={techStackInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold mb-12 text-center"
            >
              Core Technologies
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {techStack.map((tech, index) => (
                <div
                  key={index}
                  className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-emerald-500/50 transition-all duration-700 ease-out will-change-transform will-change-opacity hover:-translate-y-1 ${techStackInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                  style={{ transitionDelay: `${index * 120}ms` }}
                >
                  <div className="text-emerald-400 mb-4">{tech.icon}</div>
                  <h3 className="text-2xl font-semibold mb-3">{tech.title}</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">{tech.description}</p>
                  <div className="flex items-center text-sm text-emerald-400 font-mono">
                    <Code2 className="h-4 w-4 mr-2" />
                    {tech.tech}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* System Architecture Diagram */}
        <section className="py-16 px-4 bg-gray-900/50">
          <motion.div
            ref={architectureRef}
            initial={{ opacity: 0, y: 30 }}
            animate={architectureInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4 text-center">System Architecture</h2>
            <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
              Multi-layered microservices architecture with RESTful APIs and real-time data processing pipelines
            </p>
            <div className="flex justify-center mb-16">
              <DatabaseWithRestApi
                circleText="API"
                title="Real-time Ingredient Analysis Pipeline"
                lightColor="#10b981"
                badgeTexts={{
                  first: "OCR",
                  second: "AI",
                  third: "Parse",
                  fourth: "Analyze"
                }}
                buttonTexts={{
                  first: "ingreBOARD",
                  second: "v1.0"
                }}
              />
            </div>

            {/* Architecture Layers */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {architectureLayers.map((layer, index) => (
                <div
                  key={index}
                  className={`bg-gray-800 border border-gray-700 rounded-lg p-6 transition-all duration-700 ease-out will-change-transform will-change-opacity ${architectureInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`h-2 w-full bg-gradient-to-r ${layer.color} rounded-full mb-4`} />
                  <h3 className="text-lg font-semibold mb-4 text-emerald-400">{layer.title}</h3>
                  <ul className="space-y-2">
                    {layer.items.map((item, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start">
                        <span className="text-emerald-400 mr-2">▹</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Processing Pipeline */}
        <section className="py-16 px-4">
          <div
            ref={pipelineRef}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={pipelineInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center mb-4">
                <Network className="h-10 w-10 text-emerald-400 mr-3" />
                <h2 className="text-4xl font-bold">Processing Pipeline</h2>
              </div>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Six-stage asynchronous processing pipeline with parallel execution and intelligent fallback mechanisms
              </p>
            </motion.div>

            <div className="space-y-6">
              {processingPipeline.map((stage, index) => (
                <div
                  key={index}
                  className={`relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-700 ease-out will-change-transform will-change-opacity ${pipelineInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-2xl font-bold">
                        {stage.step}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center mb-3">
                        <div className="text-emerald-400 mr-3">{stage.icon}</div>
                        <h3 className="text-2xl font-semibold">{stage.title}</h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{stage.description}</p>
                    </div>
                  </div>
                  {index < processingPipeline.length - 1 && (
                    <div className="absolute left-10 -bottom-6 w-0.5 h-6 bg-gradient-to-b from-emerald-500 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="py-16 px-4 bg-gray-900/50">
          <motion.div
            ref={specsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={specsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-12 text-center">Technical Specifications</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className={`bg-gray-800 border border-gray-700 rounded-xl p-6 transition-all duration-700 ease-out will-change-transform will-change-opacity ${specsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: '0ms' }}>
                <Shield className="h-10 w-10 text-emerald-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Security & Privacy</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Client-side image processing</li>
                  <li>• Zero data persistence</li>
                  <li>• HTTPS/TLS encryption</li>
                  <li>• CORS-enabled API gateways</li>
                  <li>• No tracking or analytics</li>
                </ul>
              </div>

              <div className={`bg-gray-800 border border-gray-700 rounded-xl p-6 transition-all duration-700 ease-out will-change-transform will-change-opacity ${specsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: '120ms' }}>
                <Layers className="h-10 w-10 text-emerald-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Performance</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• &lt;2s OCR processing time</li>
                  <li>• 95%+ accuracy rate</li>
                  <li>• Progressive web app (PWA)</li>
                  <li>• Code-splitting & lazy loading</li>
                  <li>• Optimistic UI updates</li>
                </ul>
              </div>

              <div className={`bg-gray-800 border border-gray-700 rounded-xl p-6 transition-all duration-700 ease-out will-change-transform will-change-opacity ${specsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: '240ms' }}>
                <Cpu className="h-10 w-10 text-emerald-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Deployment</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Vercel edge network</li>
                  <li>• Automatic CI/CD pipeline</li>
                  <li>• Global CDN distribution</li>
                  <li>• Serverless functions</li>
                  <li>• Zero-downtime deploys</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <motion.div
            ref={ctaRef}
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6">Experience the Technology</h2>
            <p className="text-xl text-gray-300 mb-8">
              See our advanced AI-powered ingredient analysis in action
            </p>
            <a
              href="/scanner"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
            >
              <Camera className="h-5 w-5 mr-2" />
              Try Scanner Now
            </a>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default TechnologyPage;

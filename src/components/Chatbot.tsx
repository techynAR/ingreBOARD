import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { findBestMatch, processQuery, isGreeting, getGreetingResponse, findIngredientInDatabase } from '../utils/chatUtils';
import { FAQ } from '../data/faq';
import { AIInputWithLoading } from './ui/ai-input-with-loading';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Add a delay before showing the AI response (simulates thinking)
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      let response: string;
      const processedQuery = processQuery(userMessage);

      // Check for ingredient information first
      const ingredientMatch = findIngredientInDatabase(userMessage);
      if (ingredientMatch.found) {
        response = ingredientMatch.response;
      }
      // Handle greetings
      else if (isGreeting(processedQuery)) {
        response = getGreetingResponse();
      }
      // Fallback to FAQ / Keyword Search
      else {
        response = findBestMatch(processedQuery, FAQ);
      }

      // Handle navigation to About page if mentioned
      if (response.toLowerCase().includes('about page')) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response,
        }, {
          role: 'assistant',
          content: "I can take you to the About page if you'd like. Just click the link below.",
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      }
    } catch (error) {
      console.error('Chat processing error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
      }]);
    }

    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:shadow-emerald-500/50 hover:scale-110 transition-all duration-300 z-50"
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-6 right-6 w-[400px] max-w-[calc(100vw-3rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-5 flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold text-lg">ingreBOARD Assistant</h3>
                <p className="text-white/80 text-xs">Always here to help</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-[450px] overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Ask me anything about ingredients!</p>
                </div>
              )}
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${message.role === 'user'
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
                      }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                    {message.content.toLowerCase().includes('about page') && message.role === 'assistant' && (
                      <button
                        onClick={() => {
                          navigate('/about');
                          setIsOpen(false);
                        }}
                        className="mt-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 text-sm font-medium"
                      >
                        Visit About Page
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <AIInputWithLoading
                placeholder="Ask about ingredients or contact info..."
                onSubmit={handleSend}
                loadingDuration={2000}
                minHeight={48}
                maxHeight={120}
                className="py-2"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;

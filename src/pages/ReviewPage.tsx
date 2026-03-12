import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, User, Calendar, Send, ThumbsUp, Filter } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
}

export function ReviewPage() {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      userName: 'Arun Kumar',
      rating: 5,
      comment: 'Excellent service! The bus was on time and very clean. The live tracking feature is a lifesaver.',
      date: '10 Mar 2026',
      likes: 24
    },
    {
      id: '2',
      userName: 'Priya S.',
      rating: 4,
      comment: 'Good experience overall. The driver was professional. A bit of delay due to traffic, but tracking kept me informed.',
      date: '08 Mar 2026',
      likes: 12
    },
    {
      id: '3',
      userName: 'Manoj Pillai',
      rating: 5,
      comment: 'The AI route optimization seems to be working well. Reached my destination 20 minutes earlier than usual!',
      date: '05 Mar 2026',
      likes: 45
    }
  ]);

  const stats = {
    average: (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1),
    total: reviews.length,
    fiveStars: reviews.filter(r => r.rating === 5).length,
    fourStars: reviews.filter(r => r.rating === 4).length
  };

  const getRatingLabel = (r: number) => {
    switch (r) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Select a rating';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newReview: Review = {
        id: Date.now().toString(),
        userName: userName.trim(),
        rating,
        comment,
        date: 'Today',
        likes: 0
      };

      setReviews([newReview, ...reviews]);
      setIsSubmitting(false);
      setShowSuccess(true);
      setRating(0);
      setComment('');
      setUserName('');

      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 bg-slate-50/50 dark:bg-transparent min-h-screen"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-8 md:p-20 text-white shadow-2xl shadow-slate-900/20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-violet-600/20 rounded-full blur-[100px] -ml-32 -mb-32" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="text-center lg:text-left space-y-6 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-black tracking-widest uppercase"
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              Trusted by 50,000+ Travelers
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9]"
            >
              Real Stories. <br />
              <span className="text-indigo-400">Real Journeys.</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-lg md:text-xl font-medium max-w-lg"
            >
              {t('reviewsSubtitle') || 'Your feedback drives our innovation. Join thousands of happy travelers sharing their experiences across Tamil Nadu.'}
            </motion.p>
          </div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] flex flex-col items-center gap-4 min-w-[280px] shadow-2xl"
          >
            <div className="text-7xl font-black tracking-tighter text-indigo-400">{stats.average}</div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={`w-6 h-6 ${i <= Math.round(Number(stats.average)) ? 'fill-amber-400 text-amber-400' : 'text-white/10'}`} />
              ))}
            </div>
            <div className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Based on {stats.total} verified reviews</div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Feedback Form */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 sticky top-24">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-linear-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/30">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
                  {t('submitFeedback') || 'Post Review'}
                </h2>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Share your experience</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Star Rating */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Overall Rating</label>
                  <span className={`text-sm font-black uppercase tracking-wider ${rating > 0 ? 'text-indigo-600' : 'text-slate-300'}`}>
                    {getRatingLabel(hover || rating)}
                  </span>
                </div>
                <div className="flex justify-between bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.25, rotate: 10 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="focus:outline-none relative group"
                    >
                      <Star
                        className={`w-10 h-10 transition-all duration-500 ${
                          star <= (hover || rating)
                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]'
                            : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                      {star <= (hover || rating) && (
                        <motion.div 
                          layoutId="star-glow"
                          className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full -z-10"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex justify-between">
                  <span>{t('fullName') || 'Your Name'}</span>
                  <span className="text-rose-500">REQUIRED</span>
                </label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Monish E"
                    required
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-600 dark:focus:border-indigo-500 rounded-[2rem] outline-none transition-all font-bold text-slate-800 dark:text-white placeholder:text-slate-300"
                  />
                </div>
              </div>

              {/* Comment Input */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                  {t('description') || 'Your Feedback'}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('writeFeedback') || 'How was your journey? What can we do better?'}
                  rows={4}
                  required
                  className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-600 dark:focus:border-indigo-500 rounded-[2rem] outline-none transition-all font-bold text-slate-800 dark:text-white placeholder:text-slate-300 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || rating === 0 || !userName.trim()}
                className="w-full py-6 bg-slate-900 dark:bg-indigo-600 text-white font-black rounded-[2rem] hover:bg-black dark:hover:bg-indigo-700 transition-all shadow-2xl shadow-slate-900/20 dark:shadow-indigo-600/20 disabled:opacity-30 disabled:shadow-none flex items-center justify-center gap-3 text-lg uppercase tracking-widest"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t('submitReview') || 'Publish Review'}
                  </>
                )}
              </button>
            </form>

            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-center font-bold border border-emerald-100 dark:border-emerald-900/30"
                >
                  ✨ {t('reviewSuccess') || 'Feedback posted successfully!'}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
              <div className="w-2 h-8 bg-indigo-600 rounded-full" />
              {t('latestReviews') || 'Community Voice'}
            </h2>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                <Filter className="w-4 h-4" />
                <span>{t('highestRating') || 'Top Rated'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {reviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/10 rounded-bl-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-linear-to-br from-slate-800 to-slate-900 dark:from-indigo-500 dark:to-indigo-700 text-white rounded-[1.25rem] flex items-center justify-center font-black text-2xl shadow-xl shadow-slate-900/20 dark:shadow-indigo-500/20">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-slate-800 dark:text-white text-xl flex items-center gap-2">
                          {review.userName}
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" title="Verified Traveler" />
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          <Calendar className="w-3.5 h-3.5" />
                          {review.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200 dark:text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-bold text-lg mb-10 relative z-10 italic">
                    "{review.comment}"
                  </p>

                  <div className="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-slate-800/50 relative z-10">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs font-black text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all uppercase tracking-widest">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.likes} Helpful</span>
                      </button>
                    </div>
                    <div className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                      Verified Trip
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

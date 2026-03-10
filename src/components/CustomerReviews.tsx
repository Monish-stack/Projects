import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Heart, MessageSquare, Clock, ArrowDownUp } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

interface Review {
  id: string;
  name: string;
  rating: number;
  feedback: string;
  date: string;
  timestamp: number;
  likes: number;
  hearts: number;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Karthik S.',
    rating: 5,
    feedback: 'Excellent service! The bus was on time and very clean. Driver was polite.',
    date: '10 Mar 2026',
    timestamp: Date.now() - 86400000 * 2,
    likes: 12,
    hearts: 5
  },
  {
    id: '2',
    name: 'Priya R.',
    rating: 4,
    feedback: 'Good journey overall, but the AC could have been a bit cooler.',
    date: '09 Mar 2026',
    timestamp: Date.now() - 86400000 * 3,
    likes: 8,
    hearts: 2
  },
  {
    id: '3',
    name: 'Anonymous',
    rating: 3,
    feedback: 'Bus arrived 15 minutes late. Otherwise, the ride was comfortable.',
    date: '08 Mar 2026',
    timestamp: Date.now() - 86400000 * 4,
    likes: 4,
    hearts: 0
  }
];

export default function CustomerReviews() {
  const { t } = useLanguage();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'highest'>('latest');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Load reviews from local storage or use mock data
    const savedReviews = localStorage.getItem('tnsbn_reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      setReviews(MOCK_REVIEWS);
      localStorage.setItem('tnsbn_reviews', JSON.stringify(MOCK_REVIEWS));
    }
  }, []);

  const getRatingText = (val: number) => {
    switch (val) {
      case 1: return '1/5 - Poor';
      case 2: return '2/5 - Fair';
      case 3: return '3/5 - Good';
      case 4: return '4/5 - Very Good';
      case 5: return '5/5 - Excellent';
      default: return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0 || !feedback.trim()) return;
    
    // Spam prevention: Check last submission time
    const lastSubmission = localStorage.getItem('tnsbn_last_review_time');
    if (lastSubmission && Date.now() - parseInt(lastSubmission) < 60000) {
      alert('Please wait a minute before submitting another review.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newReview: Review = {
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim() || 'Anonymous',
        rating,
        feedback: feedback.trim(),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        timestamp: Date.now(),
        likes: 0,
        hearts: 0
      };

      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);
      localStorage.setItem('tnsbn_reviews', JSON.stringify(updatedReviews));
      localStorage.setItem('tnsbn_last_review_time', Date.now().toString());

      setRating(0);
      setFeedback('');
      setName('');
      setIsSubmitting(false);
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 4000);
    }, 1000);
  };

  const handleReaction = (id: string, type: 'likes' | 'hearts') => {
    const updatedReviews = reviews.map(r => {
      if (r.id === id) {
        return { ...r, [type]: r[type] + 1 };
      }
      return r;
    });
    setReviews(updatedReviews);
    localStorage.setItem('tnsbn_reviews', JSON.stringify(updatedReviews));
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating;
    return b.timestamp - a.timestamp;
  });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-display font-bold flex items-center gap-2">
            {t('reviewsTitle')}
          </h2>
          <p className="text-amber-50 mt-1">{t('reviewsSubtitle')}</p>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Feedback Form */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-10">
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <ThumbsUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">{t('reviewSuccess')}</h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating System */}
              <div className="flex flex-col items-center sm:items-start">
                <label className="block text-sm font-bold text-slate-700 mb-3">Rate your experience</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`h-8 w-8 ${
                          (hoverRating || rating) >= star 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'fill-slate-200 text-slate-200'
                        } transition-colors duration-200`} 
                      />
                    </button>
                  ))}
                  <span className="ml-4 text-sm font-bold text-amber-600 min-w-[120px]">
                    {getRatingText(hoverRating || rating)}
                  </span>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('yourName')}
                    maxLength={50}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none bg-white transition-all duration-200"
                  />
                </div>
                <div className="relative">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={t('writeFeedback')}
                    rows={4}
                    maxLength={300}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none bg-white transition-all duration-200 resize-none custom-scrollbar"
                    required
                  />
                  <div className="absolute bottom-3 right-3 text-xs font-medium text-slate-400">
                    {feedback.length}/300
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={rating === 0 || !feedback.trim() || isSubmitting}
                  className="px-8 py-3.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-none disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <MessageSquare className="h-5 w-5" />
                      {t('submitReview')}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Display Reviews */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-xl font-bold text-slate-800">{t('latestReviews')}</h3>
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setSortBy('latest')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  sortBy === 'latest' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t('latestReviews')}
              </button>
              <button
                onClick={() => setSortBy('highest')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  sortBy === 'highest' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t('highestRating')}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {sortedReviews.map((review) => (
              <div key={review.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{review.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-3 w-3" /> {review.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-amber-700 text-sm">{review.rating}.0</span>
                  </div>
                </div>
                
                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  "{review.feedback}"
                </p>
                
                <div className="flex items-center gap-4 pt-3 border-t border-slate-50">
                  <button 
                    onClick={() => handleReaction(review.id, 'likes')}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors bg-slate-50 hover:bg-indigo-50 px-3 py-1.5 rounded-full"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" /> {review.likes > 0 && review.likes}
                  </button>
                  <button 
                    onClick={() => handleReaction(review.id, 'hearts')}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors bg-slate-50 hover:bg-rose-50 px-3 py-1.5 rounded-full"
                  >
                    <Heart className="h-3.5 w-3.5" /> {review.hearts > 0 && review.hearts}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

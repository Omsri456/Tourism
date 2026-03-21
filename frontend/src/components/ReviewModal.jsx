import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { fetchApi } from '../api';
import usePermissions from '../hooks/usePermissions';

const ReviewModal = ({ isOpen, onClose, targetId, targetModel, targetName }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isLoggedIn } = usePermissions();

    // Form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

    const loadReviews = async () => {
        setLoading(true);
        try {
            const data = await fetchApi(`/reviews/${targetId}/${targetModel}`);
            setReviews(data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && targetId) {
            loadReviews();
            setSubmitMessage({ type: '', text: '' });
        }
    }, [isOpen, targetId, targetModel]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setSubmitMessage({ type: '', text: '' });

        try {
            await fetchApi('/reviews', {
                method: 'POST',
                body: JSON.stringify({
                    targetId,
                    targetModel,
                    rating,
                    comment
                })
            });
            setSubmitMessage({ type: 'success', text: 'Review submitted successfully!' });
            setComment('');
            setRating(5);
            loadReviews(); // Refresh the list
        } catch (err) {
            setSubmitMessage({ type: 'error', text: err.message || 'Failed to submit review' });
        } finally {
            setSubmitLoading(false);
        }
    };

    if (!isOpen) return null;

    // Calculate average for display
    const avgRating = reviews.length > 0 
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
        : 0;

    return (
        <div className="modal-overlay" style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', zIndex: 9999 
        }}>
            <div className="modal-card" style={{ 
                background: 'white', padding: '2rem', borderRadius: '12px', 
                width: '90%', maxWidth: '600px', maxHeight: '90vh', 
                display: 'flex', flexDirection: 'column' 
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Reviews for {targetName}</h3>
                    <button 
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.5rem' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {avgRating}
                    </div>
                    <div>
                        <div style={{ display: 'flex', color: '#fbbf24' }}>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={20} fill={i < Math.round(avgRating) ? "currentColor" : "none"} />
                            ))}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                            Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading reviews...</div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>{error}</div>
                    ) : reviews.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No reviews yet. Be the first to review!</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {reviews.map(review => (
                                <div key={review._id} style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <div style={{ fontWeight: 600, color: '#0f172a' }}>
                                            {review.user?.name || 'Anonymous User'}
                                        </div>
                                        <div style={{ display: 'flex', color: '#fbbf24' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{ margin: 0, color: '#334155', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                        {review.comment}
                                    </p>
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Write a Review</h4>
                    {!isLoggedIn ? (
                        <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>
                            Please <a href="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>log in</a> to write a review.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {submitMessage.text && (
                                <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: submitMessage.type === 'success' ? '#dcfce7' : '#fee2e2', color: submitMessage.type === 'success' ? '#166534' : '#991b1b', fontSize: '0.9rem' }}>
                                    {submitMessage.text}
                                </div>
                            )}
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Rating</label>
                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            style={{ 
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: star <= rating ? '#fbbf24' : '#cbd5e1',
                                                padding: '0.25rem'
                                            }}
                                        >
                                            <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Comment</label>
                                <textarea 
                                    required
                                    rows="3"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share your experience..."
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical', fontFamily: 'inherit' }}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="btn-primary" 
                                disabled={submitLoading || submitMessage.type === 'success'}
                                style={{ width: '100%', padding: '0.75rem', justifyContent: 'center' }}
                            >
                                {submitLoading ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;

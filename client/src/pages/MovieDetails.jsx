import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart, FaPlay, FaExternalLinkAlt, FaImage } from 'react-icons/fa';
import { getMovieDetails, getImageUrl } from '../services/tmdbApi';
import { getFavorites, addToFavorites, removeFromFavorites } from '../services/favoriteService';
import { getMovieReviews, addReview } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import MovieGrid from '../components/MovieGrid';

// Function to render an image with fallback
const ImageWithFallback = ({ src, alt, className }) => {
  if (!src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-200 ${className}`}>
        <FaImage className="h-16 w-16 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">No image available</p>
      </div>
    );
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      onError={(e) => {
        e.target.onerror = null;
        e.target.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = `flex flex-col items-center justify-center bg-gray-200 ${className}`;
        placeholder.innerHTML = `
          <svg class="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clip-rule="evenodd" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">No image available</p>
        `;
        e.target.parentNode.appendChild(placeholder);
      }}
    />
  );
};

const MovieDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Review form
  const [reviewFormVisible, setReviewFormVisible] = useState(false);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
        
        // Set trailer
        const trailerVideo = data.videos?.results?.find(
          video => video.type === 'Trailer' && video.site === 'YouTube'
        );
        setTrailer(trailerVideo);
        
        // Set cast (top 10)
        setCast(data.credits?.cast?.slice(0, 10) || []);
        
        // Set similar movies
        setSimilarMovies(data.similar?.results || []);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Fetch favorites and check if movie is favorited
  useEffect(() => {
    if (isAuthenticated) {
      const fetchFavorites = async () => {
        try {
          const data = await getFavorites();
          setFavorites(data);
          
          // Check if current movie is in favorites
          const isFav = data.some(fav => fav.movieId === id);
          setIsFavorite(isFav);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      };

      fetchFavorites();
    }
  }, [isAuthenticated, id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getMovieReviews(id);
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [id]);

  // Toggle favorite
  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !movie) return;

    try {
      if (isFavorite) {
        await removeFromFavorites(id);
        setIsFavorite(false);
      } else {
        await addToFavorites({
          movieId: id,
          title: movie.title,
          poster: movie.poster_path,
          overview: movie.overview,
          rating: movie.vote_average,
          releaseDate: movie.release_date
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated || submittingReview) return;
    
    try {
      setSubmittingReview(true);
      
      await addReview({
        movieId: id,
        title: reviewTitle,
        comment: reviewComment,
        rating: parseInt(reviewRating)
      });
      
      // Reset form and fetch updated reviews
      setReviewTitle('');
      setReviewComment('');
      setReviewRating(5);
      setReviewFormVisible(false);
      
      // Refresh reviews
      const updatedReviews = await getMovieReviews(id);
      setReviews(updatedReviews);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <Loader size="large" />;
  }

  if (error || !movie) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        <p>{error || 'Movie not found'}</p>
      </div>
    );
  }

  const {
    title,
    poster_path,
    backdrop_path,
    overview,
    vote_average,
    vote_count,
    release_date,
    runtime,
    genres,
    homepage
  } = movie;

  const releaseYear = release_date ? new Date(release_date).getFullYear() : 'N/A';
  const backdropUrl = backdrop_path 
    ? getImageUrl(backdrop_path, 'original')
    : poster_path
      ? getImageUrl(poster_path, 'original')
      : null;

  return (
    <div>
      {/* Movie backdrop */}
      {backdropUrl && (
        <div className="relative mb-8 h-[40vh] w-full overflow-hidden md:h-[60vh]">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Movie info overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container grid gap-6 px-4 text-white md:grid-cols-3">
              {/* Poster */}
              <div className="hidden md:block">
                <ImageWithFallback
                  src={poster_path ? getImageUrl(poster_path) : null}
                  alt={`${title} poster`}
                  className="mx-auto h-auto max-w-full rounded-lg shadow-lg"
                />
              </div>
              
              {/* Details */}
              <div className="md:col-span-2">
                <h1 className="text-3xl font-bold md:text-4xl">
                  {title} <span className="text-xl opacity-75">({releaseYear})</span>
                </h1>
                
                <div className="mt-4 flex flex-wrap gap-3">
                  {genres?.map(genre => (
                    <span key={genre.id} className="rounded-full bg-secondary px-3 py-1 text-sm">
                      {genre.name}
                    </span>
                  ))}
                </div>
                
                <div className="mt-4 flex items-center gap-6">
                  <div className="flex items-center">
                    <FaStar className="mr-1 text-yellow-500" />
                    <span className="text-lg font-semibold">{vote_average?.toFixed(1)}</span>
                    <span className="ml-1 text-sm opacity-75">({vote_count} votes)</span>
                  </div>
                  
                  {runtime && (
                    <div>
                      <span className="text-lg">{Math.floor(runtime / 60)}h {runtime % 60}m</span>
                    </div>
                  )}
                </div>
                
                <p className="mt-4 text-lg">{overview}</p>
                
                <div className="mt-6 flex flex-wrap gap-3">
                  {trailer && (
                    <a
                      href={`https://www.youtube.com/watch?v=${trailer.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center rounded-md bg-red-600 px-4 py-2 font-medium hover:bg-red-700"
                    >
                      <FaPlay className="mr-2" />
                      Watch Trailer
                    </a>
                  )}
                  
                  {homepage && (
                    <a
                      href={homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center rounded-md bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700"
                    >
                      <FaExternalLinkAlt className="mr-2" />
                      Official Site
                    </a>
                  )}
                  
                  {isAuthenticated && (
                    <button
                      onClick={handleToggleFavorite}
                      className={`flex items-center rounded-md px-4 py-2 font-medium ${
                        isFavorite
                          ? 'bg-pink-600 hover:bg-pink-700'
                          : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      {isFavorite ? (
                        <>
                          <FaHeart className="mr-2" />
                          Remove from Favorites
                        </>
                      ) : (
                        <>
                          <FaRegHeart className="mr-2" />
                          Add to Favorites
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        {/* Cast section */}
        {cast.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">Top Cast</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {cast.map(person => (
                <div key={person.id} className="text-center">
                  <div className="mx-auto mb-2 h-40 w-40 overflow-hidden rounded-full">
                    <ImageWithFallback
                      src={
                        person.profile_path
                          ? getImageUrl(person.profile_path, 'w185')
                          : null
                      }
                      alt={person.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold">{person.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trailer section */}
        {trailer && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">Trailer</h2>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={`${title} Trailer`}
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              ></iframe>
            </div>
          </section>
        )}

        {/* Reviews section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Reviews</h2>
            {isAuthenticated && !reviewFormVisible && (
              <button
                onClick={() => setReviewFormVisible(true)}
                className="rounded-md bg-secondary px-4 py-2 text-white hover:bg-opacity-90"
              >
                Write a Review
              </button>
            )}
          </div>

          {/* Review form */}
          {isAuthenticated && reviewFormVisible && (
            <div className="mb-8 rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
              <h3 className="mb-4 text-xl font-semibold">Write Your Review</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label htmlFor="reviewTitle" className="mb-1 block font-medium">
                    Title
                  </label>
                  <input
                    id="reviewTitle"
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary dark:border-gray-700 dark:bg-gray-900"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="reviewComment" className="mb-1 block font-medium">
                    Comment
                  </label>
                  <textarea
                    id="reviewComment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    rows={4}
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary dark:border-gray-700 dark:bg-gray-900"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label htmlFor="reviewRating" className="mb-1 block font-medium">
                    Rating: {reviewRating}/10
                  </label>
                  <input
                    id="reviewRating"
                    type="range"
                    min="1"
                    max="10"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(e.target.value)}
                    className="w-full accent-secondary"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setReviewFormVisible(false)}
                    className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="rounded-md bg-secondary px-4 py-2 text-white hover:bg-opacity-90 disabled:opacity-70"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <div className="rounded-lg bg-gray-100 p-6 text-center dark:bg-gray-800">
              <p className="text-gray-600 dark:text-gray-400">
                No reviews yet. Be the first to review this movie!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{review.title}</h3>
                    <div className="flex items-center">
                      <FaStar className="mr-1 text-yellow-500" />
                      <span>{review.rating}/10</span>
                    </div>
                  </div>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">{review.comment}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{review.user.name}</span>
                    <span>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Similar movies section */}
        {similarMovies.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">Similar Movies</h2>
            <MovieGrid 
              movies={similarMovies} 
              favorites={favorites}
              onFavoriteToggle={() => {}} 
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default MovieDetails; 
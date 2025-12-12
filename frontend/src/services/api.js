import axiosInstance from '../lib/axiosInstance'

// Helper: Transform backend field names to frontend format
const transformMovie = (movie) => ({
    ...movie,
    poster: movie.poster_url || movie.poster,
    releaseDate: movie.release_date || movie.releaseDate,
    ageRating: movie.age_rating || movie.ageRating,
    titleEn: movie.title_en || movie.titleEn
})

// =====================================================
// MOVIES API
// =====================================================

export const moviesApi = {
    // Get all movies
    async getAll() {
        console.log('🎬 [API] Fetching all movies...')
        const response = await axiosInstance.get('/movies');
        console.log('✅ [API] Movies fetched:', response.data.length)
        return response.data.map(transformMovie);
    },

    // Get now showing movies
    async getNowShowing() {
        const response = await axiosInstance.get('/movies/now-showing');
        return response.data.map(transformMovie);
    },

    // Get coming soon movies
    async getComingSoon() {
        const response = await axiosInstance.get('/movies/coming-soon');
        return response.data.map(transformMovie);
    },

    // Get movie by ID
    async getById(id) {
        const response = await axiosInstance.get(`/movies/${id}`);
        return transformMovie(response.data);
    },

    // Search movies
    async search(query) {
        const response = await axiosInstance.get('/movies/search', {
            params: { q: query } // Note: backend uses 'q' not 'query'
        });
        return response.data.map(transformMovie);
    },

    // ============ ADMIN CRUD OPERATIONS ============

    // Create new movie (Admin only)
    async create(movieData) {
        console.log('➕ [API] Creating movie:', movieData.title)
        // Transform frontend fields to backend format
        const payload = {
            title: movieData.title,
            genre: movieData.genre,
            duration: parseInt(movieData.duration),
            rating: parseFloat(movieData.rating) || 0,
            release_date: movieData.releaseDate, // Required field
            poster_url: movieData.poster,
            status: movieData.status // 'now-showing' or 'coming-soon'
        }

        // Only add optional fields if they have values
        if (movieData.director) payload.director = movieData.director
        if (movieData.cast) payload.cast = movieData.cast
        if (movieData.description) payload.description = movieData.description
        if (movieData.language) payload.language = movieData.language
        if (movieData.subtitle) payload.subtitle = movieData.subtitle

        console.log('📦 [API] Full payload:', JSON.stringify(payload, null, 2))
        const response = await axiosInstance.post('/movies', payload)
        console.log('✅ [API] Movie created:', response.data.id)
        return transformMovie(response.data)
    },

    // Update movie (Admin only)
    async update(id, movieData) {
        console.log('✏️ [API] Updating movie:', id)
        // Transform frontend fields to backend format
        const payload = {
            title: movieData.title,
            genre: movieData.genre,
            duration: parseInt(movieData.duration),
            rating: parseFloat(movieData.rating) || 0,
            release_date: movieData.releaseDate,
            poster_url: movieData.poster,
            status: movieData.status
        }

        // Only add optional fields if they have values
        if (movieData.director) payload.director = movieData.director
        if (movieData.cast) payload.cast = movieData.cast
        if (movieData.description) payload.description = movieData.description
        if (movieData.language) payload.language = movieData.language
        if (movieData.subtitle) payload.subtitle = movieData.subtitle

        const response = await axiosInstance.put(`/movies/${id}`, payload)
        console.log('✅ [API] Movie updated:', id)
        return transformMovie(response.data)
    },

    // Delete movie (Admin only)
    async delete(id) {
        console.log('🗑️ [API] Deleting movie:', id)
        const response = await axiosInstance.delete(`/movies/${id}`)
        console.log('✅ [API] Movie deleted:', id)
        return response.data
    }
}

// =====================================================
// SHOWTIMES API
// =====================================================

export const showtimesApi = {
    // Get all showtimes
    async getAll() {
        console.log('📅 [API] Fetching all showtimes...')
        const response = await axiosInstance.get('/showtimes');
        console.log('✅ [API] Showtimes fetched:', response.data.length)
        return response.data;
    },

    // Get showtimes for a movie
    async getByMovie(movieId) {
        const response = await axiosInstance.get(`/showtimes/movie/${movieId}`);
        return response.data;
    },

    // Get showtimes by date
    async getByDate(date) {
        const response = await axiosInstance.get(`/showtimes/date/${date}`);
        return response.data;
    },

    // Get showtime by ID
    async getById(id) {
        const response = await axiosInstance.get(`/showtimes/${id}`);
        return response.data;
    },

    // Get seats for a showtime (NEW - from backend)
    async getSeats(showtimeId) {
        const response = await axiosInstance.get(`/showtimes/${showtimeId}/seats`);
        return response.data;
    },

    // ============ ADMIN CRUD OPERATIONS ============

    // Create new showtime (Admin only)
    async create(showtimeData) {
        console.log('➕ [API] Creating showtime:', showtimeData)
        // Transform frontend fields to backend format
        const payload = {
            movie_id: showtimeData.movieId,
            hall_id: showtimeData.hallId,
            show_date: showtimeData.date,
            show_time: showtimeData.time,
            price: parseInt(showtimeData.price)
        }
        const response = await axiosInstance.post('/showtimes', payload)
        console.log('✅ [API] Showtime created:', response.data.id)
        return response.data
    },

    // Update showtime (Admin only)
    async update(id, showtimeData) {
        console.log('✏️ [API] Updating showtime:', id)
        // Transform frontend fields to backend format
        const payload = {
            movie_id: showtimeData.movieId,
            hall_id: showtimeData.hallId,
            show_date: showtimeData.date,
            show_time: showtimeData.time,
            price: parseInt(showtimeData.price)
        }
        const response = await axiosInstance.put(`/showtimes/${id}`, payload)
        console.log('✅ [API] Showtime updated:', id)
        return response.data
    },

    // Delete showtime (Admin only)
    async delete(id) {
        console.log('🗑️ [API] Deleting showtime:', id)
        const response = await axiosInstance.delete(`/showtimes/${id}`)
        console.log('✅ [API] Showtime deleted:', id)
        return response.data
    }
}

// =====================================================
// USER PROFILE API (NEW)
// =====================================================

export const usersApi = {
    // Get current user profile
    async getProfile() {
        const response = await axiosInstance.get('/users/profile');
        return response.data;
    },

    // Update user profile
    async updateProfile(profileData) {
        const response = await axiosInstance.put('/users/profile', profileData);
        return response.data;
    },

    // Get user's booking history
    async getMyBookings(filters = {}) {
        const response = await axiosInstance.get('/users/bookings', { params: filters });
        return response.data;
    }
}

// =====================================================
// ANALYTICS API (ADMIN)
// =====================================================

export const analyticsApi = {
    // Get dashboard statistics
    async getDashboardStats() {
        const response = await axiosInstance.get('/analytics/dashboard');
        return response.data;
    },

    // Get revenue trend
    async getRevenueTrend(months = 6) {
        const response = await axiosInstance.get('/analytics/revenue-trend', {
            params: { months }
        });
        return response.data;
    },

    // Get recent bookings
    async getRecentBookings(limit = 10) {
        const response = await axiosInstance.get('/analytics/recent-bookings', {
            params: { limit }
        });
        return response.data;
    }
}


// =====================================================
// BOOKINGS API
// =====================================================

export const bookingsApi = {
    /**
     * Create booking (SIMPLIFIED - backend handles transaction)
     * OLD: Required 3 separate calls (create, addSeats, addConcessions)
     * NEW: Single call, backend handles everything
     */
    async create(bookingData) {
        const response = await axiosInstance.post('/bookings', {
            showtime_id: bookingData.showtime_id,
            seats: bookingData.seats, // Array of seat IDs
            concessions: bookingData.concessions || [], // Optional array
            points_used: bookingData.points_used || 0,
            payment_method: bookingData.payment_method
        });
        return response.data;
    },

    // Get my bookings (authenticated user)
    async getMyBookings(filters = {}) {
        const response = await axiosInstance.get('/bookings', { params: filters });
        return response.data;
    },

    // Get booking by ID
    async getById(id) {
        const response = await axiosInstance.get(`/bookings/${id}`);
        return response.data;
    },

    // Cancel booking
    async cancel(id) {
        const response = await axiosInstance.delete(`/bookings/${id}`);
        return response.data;
    },

    // DEPRECATED: Backend handles seats in create()
    // Keeping for backward compatibility but not used
    async addSeats(bookingId, seats) {
        console.warn('addSeats is deprecated. Backend handles seats in create()');
        return [];
    },

    // DEPRECATED: Backend handles concessions in create()
    // Keeping for backward compatibility but not used
    async addConcessions(bookingId, concessions) {
        console.warn('addConcessions is deprecated. Backend handles concessions in create()');
        return [];
    },

    // DEPRECATED: Use getMyBookings() instead
    async getUserBookings(userId) {
        console.warn('getUserBookings is deprecated. Use getMyBookings()');
        return this.getMyBookings();
    },

    // DEPRECATED: Backend handles status updates
    async updateStatus(bookingId, status) {
        console.warn('updateStatus should be done via backend admin API');
        throw new Error('Not implemented - use admin API');
    },

    // DEPRECATED: Backend handles payment status
    async updatePaymentStatus(bookingId, paymentStatus, paymentMethod) {
        console.warn('updatePaymentStatus should be done via payment webhook');
        throw new Error('Not implemented - use payment gateway webhook');
    }
}



// =====================================================
// SEATS API (DEPRECATED)
// =====================================================
// Use showtimesApi.getSeats(showtimeId) instead
// Backend provides seat availability via /showtimes/:id/seats

export const seatsApi = {
    async getByHall(hallId) {
        console.warn('seatsApi.getByHall is deprecated. Use showtimesApi.getSeats(showtimeId)');
        throw new Error('Deprecated - use showtimesApi.getSeats()');
    },

    async getBookedSeats(showtimeId) {
        console.warn('seatsApi.getBookedSeats is deprecated. Use showtimesApi.getSeats(showtimeId)');
        throw new Error('Deprecated - use showtimesApi.getSeats()');
    }
}

// =====================================================
// CONCESSIONS API
// =====================================================

export const concessionsApi = {
    // Get all available concessions
    async getAll() {
        const { data, error } = await supabase
            .from('concessions')
            .select('*')
            .eq('is_available', true)
            .order('category', { ascending: true })

        if (error) throw error
        return data
    },

    // Get by category
    async getByCategory(category) {
        const { data, error } = await supabase
            .from('concessions')
            .select('*')
            .eq('category', category)
            .eq('is_available', true)

        if (error) throw error
        return data
    }
}

// =====================================================
// PROMOTIONS API
// =====================================================

export const promotionsApi = {
    // Get active promotions
    async getActive() {
        const { data, error } = await supabase
            .from('promotions')
            .select('*')
            .eq('is_active', true)
            .lte('valid_from', new Date().toISOString().split('T')[0])
            .gte('valid_until', new Date().toISOString().split('T')[0])
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    // Get by category
    async getByCategory(category) {
        const { data, error } = await supabase
            .from('promotions')
            .select('*')
            .eq('category', category)
            .eq('is_active', true)
            .lte('valid_from', new Date().toISOString().split('T')[0])
            .gte('valid_until', new Date().toISOString().split('T')[0])

        if (error) throw error
        return data
    }
}

// =====================================================
// REVIEWS API
// =====================================================

export const reviewsApi = {
    // Get reviews for a movie
    async getByMovie(movieId) {
        const { data, error } = await supabase
            .from('reviews')
            .select(`
        *,
        users (full_name, avatar_url)
      `)
            .eq('movie_id', movieId)
            .eq('is_approved', true)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    // Create review
    async create(reviewData) {
        const { data, error } = await supabase
            .from('reviews')
            .insert(reviewData)
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Update review
    async update(reviewId, reviewData) {
        const { data, error } = await supabase
            .from('reviews')
            .update(reviewData)
            .eq('id', reviewId)
            .select()
            .single()

        if (error) throw error
        return data
    }
}

// =====================================================
// CINEMAS API
// =====================================================

export const cinemasApi = {
    // Get all active cinemas
    async getAll() {
        const { data, error } = await supabase
            .from('cinemas')
            .select('*')
            .eq('is_active', true)
            .order('city', { ascending: true })

        if (error) throw error
        return data
    },

    // Get cinema by ID
    async getById(id) {
        const { data, error } = await supabase
            .from('cinemas')
            .select(`
        *,
        halls (*)
      `)
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    }
}

import { supabase } from '../lib/supabase'

// =====================================================
// MOVIES API
// =====================================================

export const moviesApi = {
    // Get all movies
    async getAll() {
        const { data, error } = await supabase
            .from('movies')
            .select('*')
            .order('release_date', { ascending: false })

        if (error) throw error
        return data
    },

    // Get now showing movies
    async getNowShowing() {
        const { data, error } = await supabase
            .from('movies')
            .select('*')
            .eq('status', 'now-showing')
            .order('release_date', { ascending: false })

        if (error) throw error
        return data
    },

    // Get coming soon movies
    async getComingSoon() {
        const { data, error } = await supabase
            .from('movies')
            .select('*')
            .eq('status', 'coming-soon')
            .order('release_date', { ascending: true })

        if (error) throw error
        return data
    },

    // Get movie by ID
    async getById(id) {
        const { data, error } = await supabase
            .from('movies')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    // Search movies
    async search(query) {
        const { data, error } = await supabase
            .from('movies')
            .select('*')
            .or(`title.ilike.%${query}%,title_en.ilike.%${query}%`)

        if (error) throw error
        return data
    }
}

// =====================================================
// SHOWTIMES API
// =====================================================

export const showtimesApi = {
    // Get showtimes for a movie
    async getByMovie(movieId) {
        const { data, error } = await supabase
            .from('active_showtimes_with_details')
            .select('*')
            .eq('movie_id', movieId)
            .gte('show_date', new Date().toISOString().split('T')[0])
            .order('show_date', { ascending: true })
            .order('show_time', { ascending: true })

        if (error) throw error
        return data
    },

    // Get showtimes by date
    async getByDate(date) {
        const { data, error } = await supabase
            .from('active_showtimes_with_details')
            .select('*')
            .eq('show_date', date)
            .order('show_time', { ascending: true })

        if (error) throw error
        return data
    },

    // Get showtime by ID
    async getById(id) {
        const { data, error } = await supabase
            .from('showtimes')
            .select(`
        *,
        movies (*),
        halls (
          *,
          cinemas (*)
        )
      `)
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    }
}

// =====================================================
// BOOKINGS API
// =====================================================

export const bookingsApi = {
    // Create booking
    async create(bookingData) {
        const { data, error } = await supabase
            .from('bookings')
            .insert(bookingData)
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Add seats to booking
    async addSeats(bookingId, seats) {
        const seatData = seats.map(seat => ({
            booking_id: bookingId,
            seat_id: seat.id,
            price: seat.price
        }))

        const { data, error } = await supabase
            .from('booking_seats')
            .insert(seatData)
            .select()

        if (error) throw error
        return data
    },

    // Add concessions to booking
    async addConcessions(bookingId, concessions) {
        const concessionData = concessions.map(item => ({
            booking_id: bookingId,
            concession_id: item.id,
            quantity: item.quantity,
            price: item.price
        }))

        const { data, error } = await supabase
            .from('booking_concessions')
            .insert(concessionData)
            .select()

        if (error) throw error
        return data
    },

    // Get user bookings
    async getUserBookings(userId) {
        const { data, error } = await supabase
            .from('user_booking_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    // Update booking status
    async updateStatus(bookingId, status) {
        const { data, error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', bookingId)
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Update payment status
    async updatePaymentStatus(bookingId, paymentStatus, paymentMethod) {
        const { data, error } = await supabase
            .from('bookings')
            .update({
                payment_status: paymentStatus,
                payment_method: paymentMethod
            })
            .eq('id', bookingId)
            .select()
            .single()

        if (error) throw error
        return data
    }
}

// =====================================================
// SEATS API
// =====================================================

export const seatsApi = {
    // Get seats for a hall
    async getByHall(hallId) {
        const { data, error } = await supabase
            .from('seats')
            .select('*')
            .eq('hall_id', hallId)
            .order('row_label', { ascending: true })
            .order('seat_number', { ascending: true })

        if (error) throw error
        return data
    },

    // Get booked seats for a showtime
    async getBookedSeats(showtimeId) {
        const { data, error } = await supabase
            .from('booking_seats')
            .select(`
        seat_id,
        seats (*)
      `)
            .eq('bookings.showtime_id', showtimeId)
            .eq('bookings.status', 'confirmed')

        if (error) throw error
        return data.map(item => item.seats)
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

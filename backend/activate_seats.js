require('dotenv').config();
const { supabase } = require('./src/config/supabase');

async function activateSeats() {
    console.log('Activating seats...');
    const { data, error } = await supabase
        .from('seats')
        .update({ is_active: true })
        .eq('hall_id', '722f9c07-7848-4ea5-8d03-a70931f132cf')
        .select();

    if (error) {
        console.error('Error:', error);
    } else {
        console.log(`✅ Success! ${data?.length || 0} seats activated in hall 1.`);
    }
}

activateSeats();

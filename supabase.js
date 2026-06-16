const SUPABASE_URL = "https://tzpzdstmtktngzdlhrgi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6cHpkc3RtdGt0bmd6ZGxocmdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0ODczNTcsImV4cCI6MjA5NzA2MzM1N30.pQvec8YNWgiuzztEyrMsUGqiH3oMP8z8QitpPMdpyYs";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

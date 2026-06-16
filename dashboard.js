document.addEventListener("DOMContentLoaded", loadDashboard);

async function loadDashboard(){

    const { data } = await supabaseClient
        .from("foods")
        .select("*");

    const foods = data || [];

    document.getElementById("foodCount").textContent =
        foods.length;

    document.getElementById("favoriteCount").textContent =
        foods.filter(x => x.favorite).length;
}

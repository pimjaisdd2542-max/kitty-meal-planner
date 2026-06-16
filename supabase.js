document.addEventListener("DOMContentLoaded", async () => {

    const foodsDiv = document.getElementById("foods");

    const { data, error } = await supabaseClient
        .from("foods")
        .select("*");

    if (error) {
        foodsDiv.innerHTML = `
            <p>❌ ${error.message}</p>
        `;
        return;
    }

    let html = "";

    data.forEach(food => {
        html += `
            <div style="
                background:white;
                padding:15px;
                margin:10px 0;
                border-radius:15px;
            ">
                <h3>${food.name}</h3>
                <p>🔥 ${food.calories} kcal</p>
                <p>💪 ${food.protein} g</p>
            </div>
        `;
    });

    foodsDiv.innerHTML = html;

});

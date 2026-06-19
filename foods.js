// =====================================================
// foods.js
// Part 1/6
// Kitty Meal Planner Ultimate
// =====================================================

let foods = [];
let filteredFoods = [];

document.addEventListener("DOMContentLoaded", async () => {

    bindEvents();

    await loadFoods();

});


// =====================================================
// BIND EVENTS
// =====================================================

function bindEvents(){

    document
        .getElementById("searchFood")
        .addEventListener("input", applyFilters);

    document
        .getElementById("categoryFilter")
        .addEventListener("change", applyFilters);

    document
        .getElementById("favoriteFilter")
        .addEventListener("change", applyFilters);

    document
        .getElementById("sortFood")
        .addEventListener("change", applyFilters);

    document
        .getElementById("addFoodButton")
        .addEventListener("click", addFood);

}


// =====================================================
// LOAD FOODS
// =====================================================

async function loadFoods(){

    const { data, error } = await supabaseClient
        .from("foods")
        .select("*");

    if(error){

        console.log(error);

        alert(error.message);

        return;

    }

    foods = data || [];

    createCategoryFilter();

    applyFilters();

}


// =====================================================
// CREATE CATEGORY FILTER
// =====================================================

function createCategoryFilter(){

    const select =
        document.getElementById("categoryFilter");

    select.innerHTML = `

        <option value="all">

            📂 ทุกหมวดหมู่

        </option>

    `;

    const categories =
        [...new Set(

            foods
                .map(food => food.category)
                .filter(Boolean)

        )].sort();

    categories.forEach(category=>{

        select.innerHTML += `

            <option value="${category}">

                ${category}

            </option>

        `;

    });

}
// =====================================================
// APPLY FILTERS
// Part 2/6
// =====================================================

function applyFilters(){

    const keyword =
        document
        .getElementById("searchFood")
        .value
        .toLowerCase()
        .trim();

    const category =
        document
        .getElementById("categoryFilter")
        .value;

    const favorite =
        document
        .getElementById("favoriteFilter")
        .value;

    const sort =
        document
        .getElementById("sortFood")
        .value;


    filteredFoods = foods.filter(food=>{

        const matchKeyword =
            !keyword ||
            (food.name || "")
                .toLowerCase()
                .includes(keyword);

        const matchCategory =
            category==="all" ||
            food.category===category;

        const matchFavorite =

            favorite==="all"

            ||

            (favorite==="favorite" && food.favorite)

            ||

            (favorite==="normal" && !food.favorite);

        return (

            matchKeyword &&
            matchCategory &&
            matchFavorite

        );

    });


    switch(sort){

        case "calories":

            filteredFoods.sort(

                (a,b)=>

                (a.calories||0)-
                (b.calories||0)

            );

            break;

        case "protein":

            filteredFoods.sort(

                (a,b)=>

                (b.protein||0)-
                (a.protein||0)

            );

            break;

        case "category":

            filteredFoods.sort(

                (a,b)=>

                (a.category||"")
                .localeCompare(b.category||"")

            );

            break;

        default:

            filteredFoods.sort(

                (a,b)=>

                (a.name||"")
                .localeCompare(b.name||"")

            );

    }

    renderFoods();

}


// =====================================================
// RENDER FOODS
// =====================================================

function renderFoods(){

    const container =
        document.getElementById("foods");

    container.innerHTML = "";

    if(filteredFoods.length===0){

        container.innerHTML = `

            <div class="empty-card">

                ไม่พบเมนูอาหาร

            </div>

        `;

        return;

    }

    filteredFoods.forEach(food=>{

        const card = document.createElement("div");

        card.className = "food-card";

        card.innerHTML = `

            <img
                src="${
                    food.image_url ||
                    "https://placehold.co/600x400/png?text=🍱"
                }"
                class="food-image"
            >

            <div class="food-content">

                <h3>

                    ${food.name}

                </h3>

                <p>

                    📂 ${food.category || "-"}

                </p>

                <p>

                    🔥 ${food.calories || 0} kcal

                </p>

                <p>

                    💪 ${food.protein || 0} g

                </p>

                <p>

                    🍞 ${food.carb || 0} g

                </p>

                <p>

                    🥑 ${food.fat || 0} g

                </p>

                <div class="food-actions">

                    <button
                        onclick="toggleFavorite('${food.id}', ${food.favorite})">

                        ${food.favorite ? "❤️" : "🤍"}

                    </button>

                    <button
                        onclick="editFood('${food.id}')">

                        ✏️

                    </button>

                    <button
                        onclick="deleteFood('${food.id}')">

                        🗑️

                    </button>

                </div>

            </div>

        `;

        container.appendChild(card);

    });

}
// =====================================================
// ADD FOOD
// Part 3/6
// =====================================================

async function addFood(){

    const name =
        document.getElementById("foodName").value.trim();

    const category =
        document.getElementById("foodCategory").value.trim();

    const calories =
        Number(document.getElementById("foodCalories").value);

    const protein =
        Number(document.getElementById("foodProtein").value);

    const carb =
        Number(document.getElementById("foodCarb").value);

    const fat =
        Number(document.getElementById("foodFat").value);

    const image =
        document.getElementById("foodImage").value.trim();


    if(name===""){

        alert("กรุณากรอกชื่ออาหาร");

        return;

    }

    const { error } = await supabaseClient
        .from("foods")
        .insert([{

            name:name,

            category:category,

            calories:calories,

            protein:protein,

            carb:carb,

            fat:fat,

            image_url:image,

            favorite:false

        }]);

    if(error){

        alert(error.message);

        console.log(error);

        return;

    }

    clearFoodForm();

    await loadFoods();

}


// =====================================================
// TOGGLE FAVORITE
// =====================================================

async function toggleFavorite(id,current){

    const { error } = await supabaseClient

        .from("foods")

        .update({

            favorite:!current

        })

        .eq("id",id);

    if(error){

        alert(error.message);

        console.log(error);

        return;

    }

    await loadFoods();

}


// =====================================================
// DELETE FOOD
// =====================================================

async function deleteFood(id){

    const confirmDelete = confirm(

        "ต้องการลบเมนูนี้ใช่หรือไม่?"

    );

    if(!confirmDelete){

        return;

    }

    const { error } = await supabaseClient

        .from("foods")

        .delete()

        .eq("id",id);

    if(error){

        alert(error.message);

        console.log(error);

        return;

    }

    await loadFoods();

}


// =====================================================
// CLEAR FORM
// =====================================================

function clearFoodForm(){

    document.getElementById("foodName").value="";

    document.getElementById("foodCategory").value="";

    document.getElementById("foodCalories").value="";

    document.getElementById("foodProtein").value="";

    document.getElementById("foodCarb").value="";

    document.getElementById("foodFat").value="";

    document.getElementById("foodImage").value="";

}
// =====================================================
// EDIT FOOD
// Part 4/6
// =====================================================

let editingFoodId = null;


// =====================================================
// EDIT FOOD
// =====================================================

function editFood(id){

    const food = foods.find(f => f.id === id);

    if(!food){

        return;

    }

    editingFoodId = id;

    document.getElementById("foodName").value =
        food.name || "";

    document.getElementById("foodCategory").value =
        food.category || "";

    document.getElementById("foodCalories").value =
        food.calories || "";

    document.getElementById("foodProtein").value =
        food.protein || "";

    document.getElementById("foodCarb").value =
        food.carb || "";

    document.getElementById("foodFat").value =
        food.fat || "";

    document.getElementById("foodImage").value =
        food.image_url || "";

    const button =
        document.getElementById("addFoodButton");

    button.textContent = "💾 บันทึกการแก้ไข";

    button.onclick = saveEditedFood;

}


// =====================================================
// SAVE EDITED FOOD
// =====================================================

async function saveEditedFood(){

    const { error } = await supabaseClient

        .from("foods")

        .update({

            name:
                document.getElementById("foodName").value.trim(),

            category:
                document.getElementById("foodCategory").value.trim(),

            calories:
                Number(document.getElementById("foodCalories").value),

            protein:
                Number(document.getElementById("foodProtein").value),

            carb:
                Number(document.getElementById("foodCarb").value),

            fat:
                Number(document.getElementById("foodFat").value),

            image_url:
                document.getElementById("foodImage").value.trim()

        })

        .eq("id", editingFoodId);

    if(error){

        alert(error.message);

        console.log(error);

        return;

    }

    cancelEdit();

    await loadFoods();

}


// =====================================================
// CANCEL EDIT
// =====================================================

function cancelEdit(){

    editingFoodId = null;

    clearFoodForm();

    const button =
        document.getElementById("addFoodButton");

    button.textContent = "➕ เพิ่มอาหาร";

    button.onclick = addFood;

}
// =====================================================
// foods.js
// Part 5/6
// =====================================================


// =====================================================
// IMAGE PREVIEW
// =====================================================

const imageInput = document.getElementById("foodImage");

if(imageInput){

    imageInput.addEventListener("input", updateImagePreview);

}

function updateImagePreview(){

    let preview = document.getElementById("imagePreview");

    if(!preview){

        preview = document.createElement("img");

        preview.id = "imagePreview";

        preview.style.width = "180px";
        preview.style.marginTop = "15px";
        preview.style.borderRadius = "12px";
        preview.style.objectFit = "cover";
        preview.style.display = "block";

        document
            .getElementById("foodImage")
            .after(preview);

    }

    const url =
        document.getElementById("foodImage").value.trim();

    if(url===""){

        preview.style.display = "none";

        return;

    }

    preview.src = url;

    preview.style.display = "block";

}


// =====================================================
// VALIDATE FOOD
// =====================================================

function validateFood(){

    const name =
        document.getElementById("foodName").value.trim();

    if(name===""){

        alert("กรุณากรอกชื่ออาหาร");

        return false;

    }

    return true;

}


// =====================================================
// OVERRIDE ADD FOOD
// =====================================================

const originalAddFood = addFood;

addFood = async function(){

    if(!validateFood()){

        return;

    }

    await originalAddFood();

}


// =====================================================
// OVERRIDE SAVE EDIT
// =====================================================

const originalSaveEditedFood =
    saveEditedFood;

saveEditedFood = async function(){

    if(!validateFood()){

        return;

    }

    await originalSaveEditedFood();

}


// =====================================================
// CANCEL BUTTON
// =====================================================

function createCancelButton(){

    if(document.getElementById("cancelEditButton")){

        return;

    }

    const button =
        document.createElement("button");

    button.id = "cancelEditButton";

    button.innerHTML = "❌ ยกเลิก";

    button.onclick = cancelEdit;

    document
        .getElementById("addFoodButton")
        .after(button);

}

createCancelButton();


// =====================================================
// OVERRIDE EDIT FOOD
// =====================================================

const originalEditFood = editFood;

editFood = function(id){

    createCancelButton();

    document
        .getElementById("cancelEditButton")
        .style.display = "inline-block";

    originalEditFood(id);

}


// =====================================================
// OVERRIDE CANCEL
// =====================================================

const originalCancelEdit =
    cancelEdit;

cancelEdit = function(){

    originalCancelEdit();

    updateImagePreview();

    const button =
        document.getElementById("cancelEditButton");

    if(button){

        button.style.display = "none";

    }

}
// =====================================================
// foods.js
// Part 6/6
// Kitty Meal Planner Ultimate
// =====================================================


// =====================================================
// IMAGE FALLBACK
// =====================================================

document.addEventListener("error", function(event){

    const target = event.target;

    if(target.tagName === "IMG"){

        target.src =
            "https://placehold.co/600x400/png?text=🍱";

    }

}, true);


// =====================================================
// REFRESH AFTER CRUD
// =====================================================

async function refreshFoods(){

    await loadFoods();

    applyFilters();

}


// =====================================================
// OVERRIDE CRUD
// =====================================================

const originalLoadFoods = loadFoods;

loadFoods = async function(){

    await originalLoadFoods();

    applyFilters();

}


// =====================================================
// AUTO REFRESH WHEN RETURN
// =====================================================

window.addEventListener("focus", async()=>{

    await refreshFoods();

});


// =====================================================
// RESET FILTERS
// =====================================================

function resetFilters(){

    document.getElementById("searchFood").value = "";

    document.getElementById("categoryFilter").value = "all";

    document.getElementById("favoriteFilter").value = "all";

    document.getElementById("sortFood").value = "name";

    applyFilters();

}


// =====================================================
// FOOD COUNT
// =====================================================

function updateFoodCount(){

    let counter =
        document.getElementById("foodCounter");

    if(!counter){

        counter = document.createElement("div");

        counter.id = "foodCounter";

        counter.style.marginBottom = "15px";

        counter.style.fontWeight = "bold";

        const container =
            document.getElementById("foods");

        container.parentNode.insertBefore(
            counter,
            container
        );

    }

    counter.innerHTML =
        `🍱 ทั้งหมด ${filteredFoods.length} เมนู`;

}


// =====================================================
// OVERRIDE RENDER
// =====================================================

const originalRenderFoods =
    renderFoods;

renderFoods = function(){

    originalRenderFoods();

    updateFoodCount();

}


// =====================================================
// INITIALIZE
// =====================================================

window.addEventListener("load", ()=>{

    updateImagePreview();

    updateFoodCount();

});


// =====================================================
// END OF FILE
// =====================================================

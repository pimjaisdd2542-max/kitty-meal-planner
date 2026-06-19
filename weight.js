// =====================================================
// weight.js
// Part 1/4
// Kitty Meal Planner Ultimate
// =====================================================

let allWeights = [];

document.addEventListener("DOMContentLoaded", async () => {

    setTodayDate();

    await loadWeights();

    const saveButton = document.getElementById("saveWeight");

    if(saveButton){

        saveButton.addEventListener("click", saveWeight);

    }

});


// =====================================================
// SET TODAY
// =====================================================

function setTodayDate(){

    const dateInput = document.getElementById("recordDate");

    if(!dateInput) return;

    dateInput.value = new Date().toISOString().split("T")[0];

}


// =====================================================
// LOAD WEIGHTS
// =====================================================

async function loadWeights(){

    const { data, error } = await supabaseClient
        .from("weight_history")
        .select("*")
        .order("record_date",{ascending:false});

    if(error){

        console.log(error);

        return;

    }

    allWeights = data;

    renderSummary();

    renderHistory();

}


// =====================================================
// SUMMARY
// =====================================================

function renderSummary(){

    const latestWeight = document.getElementById("latestWeight");

    const totalRecords = document.getElementById("totalRecords");

    if(totalRecords){

        totalRecords.textContent = allWeights.length;

    }

    if(latestWeight){

        if(allWeights.length===0){

            latestWeight.textContent="-";

        }else{

            latestWeight.textContent=
                Number(allWeights[0].weight).toFixed(1)+" kg";

        }

    }

}
// =====================================================
// SAVE WEIGHT
// Part 2/4
// =====================================================

async function saveWeight(){

    const recordDate =
        document.getElementById("recordDate").value;

    const weight =
        document.getElementById("weightInput").value;

    if(recordDate===""){

        alert("กรุณาเลือกวันที่");

        return;

    }

    if(weight===""){

        alert("กรุณากรอกน้ำหนัก");

        return;

    }

    const { error } = await supabaseClient
        .from("weight_history")
        .insert([

            {

                record_date: recordDate,

                weight: Number(weight)

            }

        ]);

    if(error){

        alert(error.message);

        console.log(error);

        return;

    }

    document.getElementById("weightInput").value = "";

    await loadWeights();

    alert("✅ บันทึกน้ำหนักเรียบร้อย");

}
// =====================================================
// RENDER HISTORY
// Part 3/4
// =====================================================

function renderHistory(){

    const historyDiv = document.getElementById("weightHistory");

    if(!historyDiv) return;

    if(allWeights.length===0){

        historyDiv.innerHTML = `
            <div class="empty-card">
                ยังไม่มีข้อมูลน้ำหนัก
            </div>
        `;

        return;

    }

    let html = "";

    allWeights.forEach(item=>{

        html += `

        <div class="meal-item">

            <div class="meal-detail">

                <div class="planner-food-title">

                    ⚖ ${Number(item.weight).toFixed(1)} kg

                </div>

                <div>

                    📅 ${item.record_date}

                </div>

            </div>

            <button
                class="delete-btn"
                onclick="deleteWeight('${item.id}')">

                🗑 ลบ

            </button>

        </div>

        `;

    });

    historyDiv.innerHTML = html;

}


// =====================================================
// DELETE WEIGHT
// =====================================================

async function deleteWeight(id){

    const confirmDelete =
        confirm("ต้องการลบรายการนี้ใช่หรือไม่?");

    if(!confirmDelete) return;

    const { error } = await supabaseClient
        .from("weight_history")
        .delete()
        .eq("id", id);

    if(error){

        alert(error.message);

        console.log(error);

        return;

    }

    await loadWeights();

}
// =====================================================
// FORMAT DATE
// Part 4/4
// =====================================================

function formatDate(dateString){

    if(!dateString) return "-";

    const date = new Date(dateString);

    return date.toLocaleDateString("th-TH",{

        year:"numeric",

        month:"short",

        day:"numeric"

    });

}


// =====================================================
// REFRESH PAGE
// =====================================================

async function refreshWeight(){

    await loadWeights();

}


// =====================================================
// CLEAR INPUT
// =====================================================

function clearWeightInput(){

    document.getElementById("weightInput").value = "";

    setTodayDate();

}


// =====================================================
// OVERRIDE SAVE
// =====================================================

const originalSaveWeight = saveWeight;

saveWeight = async function(){

    await originalSaveWeight();

    clearWeightInput();

}


// =====================================================
// OVERRIDE HISTORY
// =====================================================

const originalRenderHistory = renderHistory;

renderHistory = function(){

    const historyDiv = document.getElementById("weightHistory");

    if(!historyDiv) return;

    if(allWeights.length===0){

        historyDiv.innerHTML = `
            <div class="empty-card">
                ยังไม่มีข้อมูลน้ำหนัก
            </div>
        `;

        return;

    }

    let html = "";

    allWeights.forEach(item=>{

        html += `

        <div class="meal-item">

            <div class="meal-detail">

                <div class="planner-food-title">

                    ⚖ ${Number(item.weight).toFixed(1)} kg

                </div>

                <div>

                    📅 ${formatDate(item.record_date)}

                </div>

            </div>

            <button
                class="delete-btn"
                onclick="deleteWeight('${item.id}')">

                🗑 ลบ

            </button>

        </div>

        `;

    });

    historyDiv.innerHTML = html;

}


// =====================================================
// INITIAL REFRESH
// =====================================================

window.addEventListener("focus", async()=>{

    await refreshWeight();

});


// =====================================================
// END OF FILE
// =====================================================

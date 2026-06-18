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

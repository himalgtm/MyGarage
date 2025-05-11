const username = localStorage.getItem("username");
const token = localStorage.getItem("token");

function fetchCars() {
  fetch(`/api/cars/${username}/${token}`)
    .then(res => res.json())
    .then(data => {
      carList.innerHTML = "";
      data.forEach(car => {
        const li = document.createElement("li");
        li.className =
          "bg-zinc-900 dark:bg-white/10 border border-yellow-500 dark:border-yellow-300 p-4 rounded-lg shadow-md relative";
        li.innerHTML = `
          <h3 class="text-xl font-semibold text-yellow-400 dark:text-yellow-300">${car.year} ${car.make} ${car.model}</h3>
          <p class="text-sm mt-1">Engine: <strong>${car.engine}</strong> | Fuel: <strong>${car.fuelType}</strong></p>
          <p class="text-sm">Mileage: ${car.mileage} km | VIN: ${car.vin}</p>
          <p class="text-sm">Service: ${car.lastService?.split("T")[0] || "N/A"} | Reg. Expiry: ${car.registrationExpiry?.split("T")[0] || "N/A"}</p>
          <button class="absolute top-2 right-8 text-yellow-400 hover:text-white" onclick='beginEdit(${JSON.stringify(car).replace(/"/g, "&quot;")})'">Edit</button>
          <button class="absolute top-2 right-2 text-red-400 hover:text-red-600" onclick="deleteCar('${car._id}')">✖</button>
        `;
        carList.appendChild(li);
      });
    });
}

function addCar() {
  const car = {
    make: document.getElementById("make").value,
    model: document.getElementById("model").value,
    year: parseInt(document.getElementById("year").value),
    engine: document.getElementById("engine").value,
    vin: document.getElementById("vin").value,
    mileage: parseInt(document.getElementById("mileage").value),
    lastService: document.getElementById("lastService").value,
    fuelType: document.getElementById("fuelType").value,
    registrationExpiry: document.getElementById("registrationExpiry").value,
  };

  fetch(`/api/cars/${username}/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(car),
  })
    .then(res => res.json())
    .then(() => {
      document.querySelectorAll("#carForm input, #carForm select").forEach(el => el.value = "");
      fetchCars();
    });
}

function deleteCar(id) {
  fetch(`/api/cars/${username}/${token}/${id}`, {
    method: "DELETE"
  }).then(() => fetchCars());
}

// Dark Mode Toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.createElement("button");
  toggleBtn.innerText = "🌓 Toggle Theme";
  toggleBtn.className =
    "fixed bottom-6 right-6 px-4 py-2 bg-yellow-400 dark:bg-yellow-600 text-black font-bold rounded shadow-md hover:bg-yellow-300";
  toggleBtn.onclick = () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
  };
  document.body.appendChild(toggleBtn);

  // Load preference
  const saved = localStorage.getItem("theme");
  if (saved === "dark") document.documentElement.classList.add("dark");
});


/* ---------- state ---------- */
let editingId = null;  

/* ---------- hook the form ---------- */
document.getElementById("carForm").addEventListener("submit", e => {
  e.preventDefault();
  editingId ? updateCar(editingId) : addCar();   // decide what to do
});

function beginEdit(car) {
  document.getElementById("make").value               = car.make;
  document.getElementById("model").value              = car.model;
  document.getElementById("year").value               = car.year;
  document.getElementById("engine").value             = car.engine;
  document.getElementById("vin").value                = car.vin;
  document.getElementById("mileage").value            = car.mileage;
  document.getElementById("lastService").value        = car.lastService?.slice(0,10) || "";
  document.getElementById("fuelType").value           = car.fuelType;
  document.getElementById("registrationExpiry").value = car.registrationExpiry?.slice(0,10) || "";

  editingId = car._id;
  document.getElementById("submit-button").innerText = "Save";
}

function updateCar(id) {
  const updated = {
    make: document.getElementById("make").value,
    model: document.getElementById("model").value,
    year:  parseInt(document.getElementById("year").value),
    engine: document.getElementById("engine").value,
    vin:    document.getElementById("vin").value,
    mileage:           parseInt(document.getElementById("mileage").value),
    lastService:       document.getElementById("lastService").value,
    fuelType:          document.getElementById("fuelType").value,
    registrationExpiry:document.getElementById("registrationExpiry").value,
  };

  fetch(`/api/cars/${username}/${token}/${id}`, {
    method: "PUT",                      
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated)
  })
    .then(res => {
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    })
    .then(() => {
      resetForm();
      fetchCars();                   
    })
    .catch(err => alert(err.message));
}

function resetForm() {
  document.querySelectorAll("#carForm input, #carForm select").forEach(el => el.value = "");
  editingId = null;
  document.getElementById("submit-button").innerText = "Add";
}

let camStream;            
const vinInput = document.getElementById("vin");

document.getElementById("scanVinBtn").onclick = async () => {
  try {
    camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
    document.getElementById("camStream").srcObject = camStream;
    document.getElementById("camModal").classList.remove("hidden");
  } catch (err) {
    alert("Camera error: " + err.message);
  }
};

function closeCamera() {
  camStream?.getTracks().forEach(t => t.stop());
  document.getElementById("camModal").classList.add("hidden");
}
document.getElementById("closeCam").onclick = closeCamera;


document.getElementById("captureBtn").onclick = () => {
  const video = document.getElementById("camStream");
  const canvas = document.createElement("canvas");
  canvas.width  = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataURL = canvas.toDataURL("image/jpeg", 0.8);  
  closeCamera();
  extractVIN(dataURL);
};

function extractVIN(base64) {
  console.log(base64)
  fetch(`/api/vin-ocr/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64 })
  })
    .then(res => res.json())
    .then(data => {
      if (data.vin) {
        vinInput.value = data.vin;
      } else {
        alert("VIN not detected — try again.");
      }
    })
    .catch(err => alert("OCR error: " + err.message));
}


fetchCars();
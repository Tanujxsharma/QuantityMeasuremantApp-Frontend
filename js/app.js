let isLogin = true;

function toggleForm() {
  isLogin = !isLogin;
  document.getElementById("title").innerText = isLogin ? "Login" : "Signup";
  document.getElementById("toggleText").innerHTML =
    isLogin
      ? `Don't have an account? <span onclick="toggleForm()">Signup</span>`
      : `Already have an account? <span onclick="toggleForm()">Login</span>`;
}

async function submitForm() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Enter username & password");
    return;
  }

  const url = isLogin
    ? "http://localhost:8080/auth/login"
    : "http://localhost:8080/auth/signup";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const text = await response.text();
    console.log("Token:", text);

    if (!response.ok) {
      alert(text);
      return;
    }

    if (isLogin) {
      localStorage.setItem("token", text);

      // ✅ redirect fix
      window.location.href = "./dashboard.html";
    } else {
      alert("Signup successful");
      toggleForm();
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

function getMeasurementType(type) {
  return {
    length: "LengthUnit",
    weight: "WeightUnit",
    volume: "VolumeUnit",
    temperature: "TemperatureUnit"
  }[type];
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = "none");
  document.getElementById(tabName + '-tab').style.display = "block";
}

async function performOperation(type) {
  const token = localStorage.getItem("token");

  const v1Input = document.getElementById(`${type}-v1`).value.trim();
  const v2Input = document.getElementById(`${type}-v2`).value.trim();
  const u1Input = document.getElementById(`${type}-u1`).value.trim();
  const u2Input = document.getElementById(`${type}-u2`).value.trim();

  const resultDiv = document.getElementById(`${type}-result`);

  if (!v1Input || !v2Input || !u1Input || !u2Input) {
    resultDiv.innerHTML = " Please fill all fields";
    return;
  }

  const v1 = parseFloat(v1Input);
  const v2 = parseFloat(v2Input);

  if (isNaN(v1) || isNaN(v2)) {
    resultDiv.innerHTML = " Values must be numbers";
    return;
  }

  const operation = type === "temperature"
    ? "compare"
    : document.getElementById(`${type}-operation`).value;

  resultDiv.innerHTML = "⏳ Processing...";

  const body = {
    thisQuantity: {
      value: v1,
      unit: u1Input.toUpperCase(),
      measurementType: getMeasurementType(type)
    },
    thatQuantity: {
      value: v2,
      unit: u2Input.toUpperCase(),
      measurementType: getMeasurementType(type)
    }
  };

  console.log("Request:", { type, operation, body });

  try {
    const response = await fetch(`http://localhost:8080/api/measurements/${operation}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    console.log("Response text:", text);

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = text;
    }

    if (!response.ok) {
      resultDiv.innerHTML = `Error: ${typeof result === 'object' ? JSON.stringify(result) : result}`;
      return;
    }

    if (operation === "compare") {

      let isEqual = false;

      if (typeof result === "boolean") {
        isEqual = result;
      } else if (typeof result === "string") {
        isEqual = result.toLowerCase().trim() === "equal";
      } else if (typeof result === "object" && result !== null) {
        isEqual =
          result.resultString?.toLowerCase().trim() === "equal" ;
          
      }

      resultDiv.innerHTML = isEqual ? " Equal" : " Not Equal";


    } else if (operation === "add" || operation === "subtract"|| operation ==="divide") {

      let value = "";
      let unit = "";

      if (typeof result === "object" && result !== null) {
        value = result.resultValue;
        unit = result.resultUnit;
      } else {
        value = result;
      }

      resultDiv.innerHTML = ` Result: <strong>${value} ${unit}</strong>`;

    } else {
      resultDiv.innerHTML = ` Result: ${JSON.stringify(result)}`;
    }

  } catch (err) {
    console.error("API Error:", err);
    resultDiv.innerHTML = " API Error - Check console";
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "./index.html";
}
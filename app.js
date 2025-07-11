// Canvas element ko access kiya jahan photo draw hogi
let canvas = document.getElementById("canvas");
if (canvas) {
  // Canvas ka drawing context liya (2D drawing ke liye)
  let ctx = canvas.getContext("2d");

  // Video element ko access kiya jahan live webcam chalegi
  let video = document.getElementById("video");

  // Capture button ko access kiya jo photo aur data save karega
  let capturePic = document.getElementById("capture");

  // Caption jahan messages ya errors dikhayenge
  let caption = document.getElementById("caption");

  let attendform = document.getElementById("attendform");

  // Input fields: name aur roll number
  let name = document.getElementById("name");
  let email = document.getElementById("email");
  let batch = document.getElementById("batch");
  let cnic = document.getElementById("cnic");

  // ----------- Camera ko browser se access karna ------------

  // Browser ko permission mangwana ke webcam access ho
  navigator.mediaDevices
    .getUserMedia({ video: true }) // Sirf video chahiye
    .then((stream) => {
      video.srcObject = stream; // Video stream ko <video> tag mein daal do
      video.play(); // Video play ho jaye
    })
    .catch((err) => {
      // Agar webcam access nahi milta, to error handle karo
      console.error("camera error", err);
      caption.textContent = "camera open nhi howa: " + err.message;
    });

  // ----------- Location Function ------------

  // Yeh function user ka latitude aur longitude return karega
  function getlocation(callback) {
    navigator.geolocation.getCurrentPosition(
      function (a) {
        let latitude = a.coords.latitude; // Latitude mil gaya
        let longitude = a.coords.longitude; // Longitude mil gaya

        callback(latitude, longitude); // Dono values callback function ko bhej do
      },
      function (error) {
        // Agar location nahi mili to default "N/A"
        callback((latitude = "N/A"), (longitude = "N/A"));
      }
    );
  }

  // ----------- Jab button press ho ------------

  // Jab "Capture & Save Attendance" button click ho
  capturePic.addEventListener("click", (e) => {
    e.preventDefault();
    // 1️: Canvas pe video ka current frame draw karo (photo capture)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // attendform.style.display="none";
    // video.style.display="block"

    // 2️: Canvas image ko base64 PNG mein convert karo
    let imagedata = canvas.toDataURL("image/png");

    // 3️: Location lo, phir object create karo
    getlocation((latitude, longitude) => {
      let time = new Date().toLocaleString(); // Current time get karo

      // Attendance object banaya
      let attend = {
        name: name.value, // User ka name
        email: email.value, // User ka email
        batch: batch.value, // User ka batch no
        cnic: cnic.value, // User ka cnic
        imageSrc: imagedata, // Captured image
        location: `lati${latitude}|longi${longitude}`, // Location string bana ke daala
        time: time, // Date & time
      };

      // Pehle se localStorage mein kuch hai to nikaalo warna empty array lo
      let data = JSON.parse(localStorage.getItem("attend")) || [];

      // Nayi attendance record array mein daal do
      data.push(attend);

      // Console pe dekhne ke liye
      console.log(data);

      // localStorage mein save karo updated data
      localStorage.setItem("attend", JSON.stringify(data));

      Swal.fire({
        icon: "success",
        title: "Attendance Saved!",
        text: "Your attendance has been recorded successfully.",
        showConfirmButton: false,
        timer: 2000,
      });

      attendform.style.display = "none";
      video.style.display = "none";
    });
  });
}
//-------------------------------------Admin Page------------------------------------------------------

let admin = document.getElementById("admin");
if (admin) {
  admin.addEventListener("click", (e) => {
    e.preventDefault();

    window.location.href = "login.html";
    Swal.fire({
      icon: "info",
      title: "Admin Area",
      text: "Redirecting to admin login...",
      timer: 1500,
      showConfirmButton: false,
    });
  });
}
let adminlogin = document.getElementById("userlogin");
if (adminlogin) {
  adminlogin.addEventListener("submit", (e) => {
    e.preventDefault();

    let adminemail = document.getElementById("loginemail").value;
    let adminpassword = document.getElementById("loginpassword").value;

    if (adminemail === "owais@gmail.com" && adminpassword === "owais") {
      window.location.href = "admin.html";

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Welcome, Admin!",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed!",
        text: "Only Admin Access allowed.",
        showConfirmButton: false,
        timer: 2000,
      });

      window.location.href = "index.html";
    }
  });
}

// // ----------- Table mein row dikhane ka function ------------

// function render() {

//       // Table ka reference jahan attendance log dikhayenge
//       let table = document.getElementById("logtable");

//       // Table ke body ko access kiya (jahan rows add karni hain)
//       let tbody = document.getElementById("tablebody");

//   let data = JSON.parse(localStorage.getItem("attend")) || [];

// console.log(data)
//   // ✅ Table ko pehle clear karo
//   tbody.innerHTML = "";

//   for (let i = 0; i < data.length; i++) {
//     tbody.innerHTML += `
//       <tr>
//         <td>${data[i].name}</td>
//         <td>${data[i].email}</td>
//         <td>${data[i].batch}</td>
//         <td>${data[i].cnic}</td>
//         <td>${data[i].location}</td>
//         <td>${data[i].time}</td>
//         <td><img src="${data[i].imageSrc}" width="100"/></td>
//       </tr>`;
//   }
// }
//   render(); // LocalStorage ka data table mein dikhaye

// ------------------------------------------------------------------------------------------------
// Yeh code commented hai. isme location dikhana.

// let show = document.getElementById("show"); // Show div ka reference

// function getlocation() {
//   // User ki location lene ke liye geolocation API use karenge
//   navigator.geolocation.getCurrentPosition(function (a) {
//     let latitude = a.coords.latitude; // Latitude le liya
//     let longitude = a.coords.longitude; // Longitude le liya
//     console.log(latitude, longitude); // Console pe check karo location

//     // Google Maps iframe banakar location dikha rahe hain
//     show.innerHTML = `<iframe src="https://maps.google.com/maps?q=${latitude},${longitude}&hl=es;z=14&amp;output=embed"></iframe>`;
//   });
// }
// getlocation(); // Location function call karo

// ------------------------------------------------------------------------------------------------
// Yeh bhi commented hai. Internet connection status check karne ke liye

// let show = document.getElementById("show"); // Show div ka reference
// let online = navigator.onLine; // Browser online/offline status check karo
// console.log(online); // Console pe status dikhayenge
// if (online === true) {
//   alert("Your Welcome"); // Agar connected ho to alert dikhaye
//   show.innerHTML = `Your Welcome`; // Page pe message show karo
// } else {
//   alert("Please connect the internet"); // Agar offline ho to alert dikhaye
//   show.innerHTML = `Please connect the internet`; // Page pe message show karo
// }

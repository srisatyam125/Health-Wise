const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

document.addEventListener("DOMContentLoaded",()=>{
  const loginForm = document.querySelector("#login");
  const createAcc = document.querySelector("#createaccount");

  document.querySelector("#sign-in-btn").addEventListener("click",()=>{
    // loginForm.classList.add("form--hidden");
    // createAcc.classList.remove("form--hidden");
  })

})

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

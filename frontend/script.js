const API = "/api";


async function register(){
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    const res = await fetch(`${API}/register`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
    });

    const data = await res.json();
    document.getElementById("regMsg").innerText = data.message;
}

async function login(){
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch(`${API}/login`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
    });

    const data = await res.json();

    if(data.token){
        localStorage.setItem("token",data.token);
        localStorage.setItem("email",data.email);
        window.location.href="portfolio.html";
    } else {
        document.getElementById("loginMsg").innerText = data.message;
    }
}

const generatorForm=document.querySelector(".generator-form");
const image_gallery=document.querySelector(".image_gallery");

const OPENAI_API_KEY="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";

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard= image_gallery.querySelectorAll(".img-card")[index];
        const imgElement= imgCard.querySelector("img");
        const downloadbtn= imgCard.querySelector(".download-btn");

        const aiGeneratedImg =`data:image/jpeg;base64, ${imgObject.b64_json}`;
        imgElement.src= aiGeneratedImg;

        imgElement.onload=() => {
            imgCard.classList.remove("loading");
            downloadbtn.setAttribute("href", aiGeneratedImg);
            downloadbtn.setAttribute("download", `${new Date().getTime()}.jpg`);

        }
    });
}

const generateAiImage= async(user, userImg) => {
    try{
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body:JSON.stringify({
                prompt: user,
                n:parseInt(userImg),
                size:"512x512",
                response_format:"b64_json"
            })
        });

        if(!response.ok) throw new Error("Failed to generate images! Please try again.");

        const {data}= await response.json();
        updateImageCard([...data]);
        console.log(data);
    } catch(error){
        alert(error.message);
    }

}

const x= (e) => {
    //e.preventDefault();
    const user=e.srcElement[0].value;
    const userImg=e.srcElement[1].value;

    const h = Array.from({length: userImg}, () =>
        `<div class="img-card loading">
            <img src="images/tubespinner.svg" alt="image">
            <a href="#" class="download-btn">
                <img src="images/download.svg" alt="download">
            </a>
        </div>`
    ).join("");
    //console.log(h);
    image_gallery.innerHTML=h;
    generateAiImage(user, userImg);
}

generatorForm.addEventListener("submit",x);
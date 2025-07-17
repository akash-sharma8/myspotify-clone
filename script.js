console.log("hello world")
let songs;
let currFolder;
    let currentSong=new Audio();
    function secondsToMinutesSeconds(seconds){
        if(isNaN(seconds) || seconds < 0){
            return "00:00";
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }
async function getSongs(folder) {
    currFolder=folder
    let a = await fetch(`http://127.0.0.1:3000/${folder}`)
    console.log(a)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
     songs = []
     console.log("📂 All anchor tags:", [...as].map(a => a.href));
    console.log("🎵 Extracted songs:", songs);

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
          
            songs.push(decodeURIComponent(element.href).split(`${folder}/`)[1])
        }

    }

        let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0];
        songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+`
        
        <li>
                        <img class="invert" src="https://cdn.hugeicons.com/icons/music-note-03-stroke-standard.svg" alt="">
                        <div class="info">
                            <div> ${song.replaceAll("%20"," ")}</div>
                            <div>Akash</div>
                        </div>
                        <span>Play now
                        </span>
                        <img class=" play invert" src="https://cdn.hugeicons.com/icons/play-stroke-standard.svg" alt="">
                     </li>`
    }
    // var audio= new Audio(songs[0]);
    // // audio.play();
    // audio.addEventListener("ontimeupdate",()=>{
    //     let duration=audio.duration;
    //     console.log(duration)
// });

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element =>{
        // console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

   return songs;
}
const playMusic =(track,pause=false)=>{
    // let audio = new Audio("/songs/" +track)
    currentSong.src=`/${currFolder}/` +track
    if(!pause){
        
        currentSong.play();
        play.src="https://cdn.hugeicons.com/icons/pause-stroke-standard.svg"
    }
     document.querySelector(".songinfo").innerHTML=decodeURI(track)
     document.querySelector(".songtime").innerHTML="00:00 / 00:00"



     
}
async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors= div.getElementsByTagName("a");
    let CardContainer=document.querySelector(".CardContainer")
    let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("/songs/")){
            let folder = e.href.split("/").slice(-2)[0];
            // get the meta data of the folder
          let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
          console.log(a)
    let response = await a.json();
    console.log(response)
    CardContainer.innerHTML= CardContainer.innerHTML+`   <div data-folder="${folder}" class="card">
                        <div class="playButton">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="black"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <img aria-hidden="false" draggable="false" loading="eager"
                            src="/songs/${folder}/cover.jpg" alt=""
                            class="mMx2LUixlnN_Fu45JpFB CmkY1Ag0tJDfnFXbGgju _EShSNaBK1wUIaZQFJJQ Yn2Ei5QZn19gria6LjZj"
                            sizes="(min-width: 1280px) 232px, 192px">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }

    
      Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click",async item=>{
            console.log(item,item.currentTarget.dataset)
            // songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            let folderName= item.currentTarget.dataset.folder
    songs = await getSongs(`songs/${folderName}`)
    playMusic(songs[0])

           
        })
    });



//     Array.from(document.getElementsByClassName("card")).forEach(e => {
//     e.addEventListener("click", async item => {
//         let folderName = item.currentTarget.dataset.folder;
//         console.log("Clicked folder:", folderName);
//         await getSongs(`songs/${folderName}`); // encode if needed
//     });
// })
}

async function main() {


      await getSongs(`songs/ncs`)
    // console.log(songs[0],true)
    playMusic(songs[0],true)

     displayAlbums()

    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src="https://cdn.hugeicons.com/icons/pause-stroke-standard.svg"
        }
        else{
            currentSong.pause();
            play.src="https://cdn.hugeicons.com/icons/play-stroke-standard.svg";
        }
    })
    currentSong.addEventListener("timeupdate",()=>{
        // console.log(currentSong.currentTime,currentSong.duration);
         document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
         document.querySelector(".circle").style.left=(currentSong.currentTime / currentSong.duration)*100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime= ((currentSong.duration)*percent)/100
    })
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })
  previous.addEventListener("click", () => {
    let currentFile = decodeURIComponent(currentSong.src.split("/").slice(-1)[0]);
    let index = songs.indexOf(currentFile);
    if ((index - 1) >= 0) {
        playMusic(songs[index - 1]);
    }
});

   next.addEventListener("click", () => {
    let currentFile = decodeURIComponent(currentSong.src.split("/").slice(-1)[0]);
    let index = songs.indexOf(currentFile);
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1]);
    }
});

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        // console.log(e,e.target,e.target.value)
        currentSong.volume=parseInt(e.target.value)/100
        if(currentSong.volume>0){
            document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace("https://cdn.hugeicons.com/icons/volume-mute-02-stroke-sharp.svg","https://cdn.hugeicons.com/icons/volume-high-stroke-sharp.svg")
        }
    })

    document.querySelector(".volume>img").addEventListener("click",e=>{
        // console.log(e.target)
        // console.log("changing",e.target.src)
        if(e.target.src.includes("https://cdn.hugeicons.com/icons/volume-high-stroke-sharp.svg")){
            e.target.src=e.target.src.replace("https://cdn.hugeicons.com/icons/volume-high-stroke-sharp.svg","https://cdn.hugeicons.com/icons/volume-mute-02-stroke-sharp.svg")
            currentSong.volume=0;
                document.querySelector(".range").getElementsByTagName("input")[0]=0;
        }
        else{
            e.target.src=e.target.src.replace("https://cdn.hugeicons.com/icons/volume-mute-02-stroke-sharp.svg","https://cdn.hugeicons.com/icons/volume-high-stroke-sharp.svg")
            currentSong.volume=0.1;
                document.querySelector(".range").getElementsByTagName("input")[0]=10;
        }
    })
  

}
main();

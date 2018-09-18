const API_KEY = "23c45880-b77f-11e8-bf0e-e9322ccde4db";

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("galleryInfo")){
    displaySavedGalleries(JSON.parse(localStorage.getItem("galleryInfo")))
  }
  else {
    const url = `https://api.harvardartmuseums.org/gallery?apikey=${API_KEY}`;
    showGalleries(url, []);
  }
});

function backToGalleries(){
  document.querySelector("#all-objects").style.display = "none";
  document.querySelector("#all-galleries").style.display = "block";
  document.querySelector("#gallery-objs").innerHTML = "<thead> <th>Title</th> <th>Image</th> <th>URL</th> <th>People</th> <th>More Information</th> </thead>";
}

function backToGalleryObjs(){
  document.getElementById("img-div").innerHTML = "";
  document.querySelector("#img-details").style.display = "none";
  document.querySelector("#all-objects").style.display = "block";
}

function displaySavedGalleries(galleries){
  for (let i = 0; i < galleries.length; i++){
    document.querySelector("#galleries").innerHTML += `
      <li>
        <a href="#${galleries[i].id}" onclick="getObjects(${galleries[i].id})">
          Gallery #${galleries[i].id}: ${galleries[i].name} (Floor ${galleries[i].floor})
        </a>
      </li>
    `;
  }
}

function showGalleries(url, savedGalleryInfo) {
  fetch(url)
  .then(response => response.json())
  .then(data => {
    data.records.forEach(gallery => {
      savedGalleryInfo.push(gallery)
      document.querySelector("#galleries").innerHTML += `
        <li>
          <a href="#${gallery.id}" onclick="getObjects(${gallery.id})">
            Gallery #${gallery.id}: ${gallery.name} (Floor ${gallery.floor})
          </a>
        </li>
      `;
    });
    if (data.info.next) {
      showGalleries(data.info.next, savedGalleryInfo);
    }
  })
  document.querySelector("#all-galleries").style.display = "block";
  localStorage.setItem("galleryInfo", JSON.stringify(savedGalleryInfo))
}

function getObjects(id) {
  if (localStorage.getItem("gallery" + id)){
    displaySavedObjects(JSON.parse(localStorage.getItem("gallery" + id)))
  }
  else {
    const url = `https://api.harvardartmuseums.org/object?gallery=${id}&apikey=${API_KEY}`
    showObjectsTable(url, [], id)
  }
}

function getPplInvolved(ppl, count) {
  let pplList = ""
  for (let i = 0; i < count; i++) {
    pplList += ppl[i].name
    if (count !== i + 1) {
      pplList += ", "
    }
  }
  return pplList
}

function displaySavedObjects(savedObjs){
  savedObjs.forEach(object => {

      let title = object.title ? object.title : "Title Not Available"
      let img = object.images[0] ? object.images[0].baseimageurl : "Image Not Available"
      let url = object.url ? object.url : "Object URL Not Available"
      let ppl = object.peoplecount > 0 ? getPplInvolved(object.people, object.peoplecount) : "Involved Individuals Not Available"

      let paramObj = {
        "title" : title.trim(),
        "description" : object.description ? object.description : "Description Not Available",
        "provenance" : object.provenance ? object.provenance : "Provenance Not Available",
        "yr" : object.accessionyear ? object.accessionyear : "Accession Year Not Available",
        "img" : object.images[0] ? object.images[0].baseimageurl : "Image Not Available"
      }

      let jsonObj = JSON.stringify(paramObj)

      document.querySelector("#gallery-objs").innerHTML += `
          <tr>
            <td>${title}</td>
            <td><img src="${img}" alt="${title} image" class="gallery-image"></td>
            <td><a href=${url}>Harvard Art Museum Link</a></td>
            <td>${ppl}<br></td>
            <td><a href="#obj${object.id}" onclick='getImageDetails(${jsonObj})''>More Information</a></td>
          </tr>
      `;
    });
  document.querySelector("#all-objects").style.display = "block";
  document.querySelector("#gallery-objs").style.display = "block";
  document.querySelector("#all-galleries").style.display = "none";
}

function showObjectsTable(url, saveObjects, id) {
  fetch(url)
  .then(response => response.json())
  .then(data => {

    data.records.forEach(object => {
      saveObjects.push(object)
      let title = object.title ? object.title : "Title Not Available"
      let img = object.images[0] ? object.images[0].baseimageurl : "Image Not Available"
      let url = object.url ? object.url : "Object URL Not Available"
      let ppl = object.peoplecount > 0 ? getPplInvolved(object.people, object.peoplecount) : "Involved Individuals Not Available"

      let paramObj = {
        "title" : title.trim(),
        "description" : object.description ? object.description : "Description Not Available",
        "provenance" : object.provenance ? object.provenance : "Provenance Not Available",
        "yr" : object.accessionyear ? object.accessionyear : "Accession Year Not Available",
        "img" : object.images[0] ? object.images[0].baseimageurl : "Image Not Available"
      }

      let jsonObj = JSON.stringify(paramObj)

      document.querySelector("#gallery-objs").innerHTML += `
          <tr>
            <td>${title}</td>
            <td><img src="${img}" alt="${title} image" class="gallery-image"></td>
            <td><a href=${url}>Harvard Art Museum Link</a></td>
            <td>${ppl}<br></td>
            <td><a href="#obj${object.id}" onclick='getImageDetails(${jsonObj})''>More Information</a></td>
          </tr>
      `;
    });
    if (data.info.next) {
      showObjectsTable(data.info.next, saveObjects, id);
    }
  })
  document.querySelector("#all-objects").style.display = "block";
  document.querySelector("#gallery-objs").style.display = "block";
  document.querySelector("#all-galleries").style.display = "none";
  localStorage.setItem("gallery" + id, JSON.stringify(saveObjects))
}


function getImageDetails(imgInfo){

    document.querySelector("#img-div").innerHTML += `
        <h4 id="object-title">${imgInfo.title}</h4><br>
        <img src="${imgInfo.img}" alt="${imgInfo.title} image" width="30%"><br>
        Accession Year: ${imgInfo.yr}<br>
        Description:  ${imgInfo.description}<br>
        Provenance: ${imgInfo.provenance}<br>
      
    `;

  document.querySelector("#all-objects").style.display = "none";
  document.querySelector("#img-details").style.display = "block";

}

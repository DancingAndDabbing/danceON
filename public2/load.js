
// <div class = "container">
//   <div class="card">
//     <div class="card-image">
//       <figure class="image is-4by3">
//         <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
//       </figure>
//     </div>
//     <div class="card-content">
//       <div class="media">
//         <div class="media-left">
//         </div>
//         <div class="media-content">
//           <p class="title is-4">John Smith</p>
//         </div>
//       </div>
//       <div class="content">
//         Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris. 
//       </div>
//     </div>
//   </div>
// </div>


function createCard(title, description, src="http://localhost:3000/assets/sample.jpg",id){
    const htmlContent = `
  <div class="card">
  <a href="http://localhost:3000/?id=${id}">
    <div class="card-image">
      <figure class="image is-4by3">
        <img src="${src}" alt="Placeholder image">
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-left">
        </div>
        <div class="media-content">
          <p class="title is-4">${title}</p>
        </div>
      </div>
      <div class="content">
        ${description} 
      </div>
    </div>
  </div>
`
const div = document.createElement('div');
div.innerHTML = htmlContent;
return div;
    // let div1 = document.createElement('div');
    
    // let div2 = document.createElement('div');
    
    // let div3 = document.createElement('div');
    // let fig = document.createElement('figure');
    // let img = document.createElement('img');
    // let titleEl = document.createElement('p');
    // let descriptionEl = document.createElement('p');
    // let a = document.createElement('a');
    // let url = `http://localhost:3000/?id=${id}`;
    // a.href = url;
    // div1.classList.add('is-one-quarter','column');
    
    // div2.classList.add('card','large');
    
    // div3.classList.add('card-image');
    // fig.classList.add('image');
    // titleEl.classList.add('title-query');
    // titleEl.innerHTML = title;
    // descriptionEl.classList.add('desc-query')
    // descriptionEl.innerHTML = description;
    // img.src = src;

    // fig.appendChild(img);
    // fig.appendChild(titleEl);
    // fig.appendChild(descriptionEl);
    // a.appendChild(fig);
    // div3.appendChild(a);
    // div2.appendChild(div3);
    // div1.appendChild(div2);
    // return div1;
    
}



window.addEventListener('load', async function (){
    let res = await fetch('http://localhost:3000/examples/files');


    let data = await res.json();

    
    
    let rootDiv = document.getElementById('exampleID');

    let colDiv = document.createElement('div');
    let count = data.length-1;
    // colDiv.classList.add('row','columns');

    
    while (count >=0){
        // for (var i =0; i<4 && count>=0; i++){
            let card = createCard(
                data[count].title,
                data[count].description,
                "http://localhost:3000/assets/sample.jpg", 
                data[count]._id
            );
            colDiv.appendChild(card);
            count--;
        // }
    }
    
    
    
    // rootDiv.createElement('div');
    rootDiv.appendChild(colDiv);
})

// const yesBtnEl = document.createElement("button");
// yesBtnEl.id = "form-yes";
// yesBtnEl.classList.add("form-input-btn");
// yesBtnEl.innerHTML = "YES"; // TODO i18n

// // no button
// const noBtnEl = document.createElement("button");
// noBtnEl.id = "form-no";
// noBtnEl.classList.add("form-input-btn");
// noBtnEl.innerHTML = "NO";